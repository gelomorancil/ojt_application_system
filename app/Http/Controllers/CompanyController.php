<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use Inertia\Inertia;
use App\Models\MoaProcess;
use App\Models\Course;
use App\Models\CompCourse;
use App\Models\StudentCompany;
use App\Models\Moa; // Import the Moa model

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

    // EDIT METHOD
    public function edit($id)
    {
        $company = Company::findOrFail($id);

        return Inertia::render('Companies/Edit', [
            'company' => $company,
        ]);
    }

    // UPDATE METHOD
    public function update(Request $request, $id)
    {
        $request->validate([
            'Comp_name' => 'required',
            'Address' => 'required',
        ]);

        $company = Company::findOrFail($id);

        // Update company details
        $company->update([
            'Comp_name' => $request->Comp_name,
            'Address' => $request->Address,
        ]);

        return redirect()->route('companies.index');
    }

    // DELETE METHOD
    public function destroy($id)
    {
        // Delete related records first
        MoaProcess::where('Comp_ID', $id)->delete();

        // Then delete the company
        Company::destroy($id);

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }

    // DETAILS METHOD
    public function details($id)
    {
        $company = Company::findOrFail($id);
        $course_list = Course::all();
        $moa_list = Moa::where('Comp_ID', $id)->get(); // Fetch MOA list for this company

        // Fetch contact list and associated course names
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

        // Fetch intern list based on Comp_ID
        // $intern_list = StudentCompany::with(['student', 'course'])->where('Comp_ID', $id)->get();
        $intern_list = StudentCompany::with(['student.course'])->where('Comp_ID', $id)->get();
        // dd($intern_list);
        return Inertia::render('Companies/View', [
            'company' => $company,
            'course_list' => $course_list,
            'moa_list' => $moa_list, // Pass MOA list to the frontend
            'contact_list' => $contact_list ?? [],
            'intern_list' => $intern_list ?? [],
        ]);
    }

    // PROFILE METHOD
    public function profile($id)
    {
        $company = Company::findOrFail($id);

        return Inertia::render('Companies/Profile', [
            'company' => $company
        ]);
    }

public function getInternsByCompany($id)
{
    // Ensure that StudentCompany has a working relationship with Student
    $intern_list = StudentCompany::where('Comp_ID', $id)
        ->with('student') // Ensure eager loading of student data
        ->get();

    // Map the data properly, ensuring the relationship exists
    $intern_list = $intern_list->map(function ($intern) {
        return [
            'Comp_ID' => $intern->Comp_ID,
            'Student_Num' => optional($intern->student)->Student_Num ?? 'N/A',
            'Name' => optional($intern->student)->name ?? 'N/A',
            'Course' => optional($intern->student)->course ?? 'N/A',
            'Semester' => optional($intern->student)->semester ?? 'N/A',
            'School_Year' => optional($intern->student)->school_year ?? 'N/A',
            'Status' => optional($intern->student)->status ?? 'N/A',
        ];
    });

    return response()->json($intern_list);
}

}
