<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\Moa;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\CompCourse;
use App\Models\MoaProcess;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    // INDEX METHOD
    public function index()
    {
        $company_list = Company::select('id', 'Comp_name', 'Address')
            ->with('CompCourse') // Ensure the relationship is loaded
            ->get()
            ->map(function ($company) {
                // Extract course IDs from CompCourse records
                $courseIds = collect($company->CompCourse)->pluck('Course_id')->map(function ($courseId) {
                    // Decode only if it's a string (to prevent errors)
                    return is_string($courseId) ? json_decode($courseId, true) : $courseId;
                })->flatten()->unique()->toArray();

                // Fetch course names
                $courses = Course::whereIn('id', $courseIds)->pluck('Course')->toArray();
                $company->course_names = implode(', ', $courses); // Store as a comma-separated string

                return $company;
            });

        return Inertia::render('Companies/Index', [
            'company_list' => $company_list,
        ]);
    }


    // STORE METHOD
    public function store(Request $request)
    {
        $request->validate([
            'Comp_name' => 'required',
            'Address' => 'required',
        ]);

        Company::create([
            'Comp_name' => $request->Comp_name,
            'Address' => $request->Address,
        ]);

        return redirect()->route('companies.index');
    }

    public function edit($id)
{
    $company = Company::findOrFail($id);

    return Inertia::render('Companies/Edit', [
        'company' => $company,
    ]);
}


    // UPDATE METHOD (FIXED)
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'Comp_name' => 'required',
            'Address' => 'required',
        ]);

        $company = Company::findOrFail($id);
        $company->update([
            'Comp_name' => $validatedData['Comp_name'],
            'Address' => $validatedData['Address'],
        ]);

        return redirect()->route('companies.index');
    }
    // DELETE METHOD
    public function destroy(Request $request)
    {
        // Delete from tbl_company first
        Company::where('id', $request->id)->delete();

        // Then delete related records from tbl_moa_process
        MoaProcess::where('Comp_ID', $request->id)->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }


    // DETAILS METHOD
    public function details($id)
    {
        $company = Company::findOrFail($id);
        $moa_list = Moa::where('Comp_ID', $id)->get(); // Fetch MOA list for this company
        $course_list = Course::all();

        $contact_list = CompCourse::where('Comp_ID', $id)->get()->map(function ($contact) {
            // Ensure Course_id is properly formatted
            $courseIds = is_string($contact->Course_id) ? json_decode($contact->Course_id, true) : $contact->Course_id;

            // If Course_id is still not an array, make it an empty array
            if (!is_array($courseIds)) {
                $courseIds = [];
            }

            // Fetch course names based on IDs
            $courses = Course::whereIn('id', $courseIds)->pluck('Course')->toArray();

            // Attach course names to the contact object
            $contact->course_names = $courses;
            return $contact;
        });


        return Inertia::render('Companies/View', [
            'company' => $company,
            'course_list' => $course_list,
            'contact_list' => $contact_list,
            'moa_list' => $moa_list // Pass MOA list to the frontend
        ]);
    }


    // PROFILE METHOD
    public function profile($id)
{
    $company = Company::with('contacts')->findOrFail($id);
    return Inertia::render('Companies/Profile', [
        'company' => $company

    ]);
}

}
