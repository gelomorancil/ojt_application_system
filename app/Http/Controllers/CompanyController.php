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
        $company_list = Company::select('id', 'Comp_name', 'Street_Address', 'Barangay', 'City', 'Province', 'Postal_Code', 'Country')
            ->with('CompCourse')
            ->get()
            ->map(function ($company) {
                $courseIds = collect($company->CompCourse)->pluck('Course_id')->map(function ($courseId) {
                    return is_string($courseId) ? json_decode($courseId, true) : $courseId;
                })->flatten()->unique()->toArray();

                $courses = Course::whereIn('id', $courseIds)->pluck('Course')->toArray();
                $company->course_names = implode(', ', $courses);

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
            'Street_Address' => 'required',
            'Barangay' => 'required',
            'City' => 'required',
            'Province' => 'required',
            'Postal_Code' => 'required',
            'Country' => 'required',
        ]);

        Company::create([
            'Comp_name' => $request->Comp_name,
            'Street_Address' => $request->Street_Address,
            'Barangay' => $request->Barangay,
            'City' => $request->City,
            'Province' => $request->Province,
            'Postal_Code' => $request->Postal_Code,
            'Country' => $request->Country,
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
            'Street_Address' => 'required',
            'Barangay' => 'required',
            'City' => 'required',
            'Province' => 'required',
            'Postal_Code' => 'required',
            'Country' => 'required',
        ]);

        $company = Company::findOrFail($id);

        $company->update([
            'Comp_name' => $request->Comp_name,
            'Street_Address' => $request->Street_Address,
            'Barangay' => $request->Barangay,
            'City' => $request->City,
            'Province' => $request->Province,
            'Postal_Code' => $request->Postal_Code,
            'Country' => $request->Country,
        ]);

        return redirect()->route('companies.index');
    }

    // DELETE METHOD
    public function destroy($id)
    {
        MoaProcess::where('Comp_ID', $id)->delete();
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
            $courseIds = is_string($contact->Course_id) ? json_decode($contact->Course_id, true) : $contact->Course_id;

            // If Course_id is still not an array, make it an empty array
            if (!is_array($courseIds)) {
                $courseIds = [];
            }

            $courses = Course::whereIn('id', $courseIds)->pluck('Course')->toArray();
            $contact->course_names = $courses;
            return $contact;
        });

        $intern_list = StudentCompany::with(['student.course'])->where('Comp_ID', $id)->get();

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
        $intern_list = StudentCompany::where('Comp_ID', $id)
            ->with('student')
            ->get();

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
