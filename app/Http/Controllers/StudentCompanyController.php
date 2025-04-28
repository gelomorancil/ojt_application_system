<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCompany;
use App\Models\Company;
use App\Models\Student;

class StudentCompanyController extends Controller
{
    public function index()
    {
        $companies = Company::all();
        $students = Student::all();
        return inertia('StudentDetails', [
            'company_list' => $companies,
            'details_list' => $students
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'Comp_ID' => 'required',
            'Student_ID' => 'required',
            'Sem' => 'required',
            'AY' => 'required',
            'Status' => 'required',
        ]);

        StudentCompany::create($request->all());

        return redirect()->back()->with('success', 'Student applied company saved successfully.');
    }

    public function update(Request $request, StudentCompany $studentCompany)
    {
        $request->validate([
            'Comp_ID' => 'required|exists:tbl_companies,id', // Ensure the correct table name
            'Student_ID' => 'required|exists:tbl_students,Student_ID', // Ensure the correct table name
            'Sem' => 'required',
            'AY' => 'required',
            'Status' => 'required',
        ]);

        $studentCompany->update($request->all());

        return redirect()->back()->with('success', 'Student company record updated successfully.');
    }

    public function destroy(StudentCompany $studentCompany)
    {
        $studentCompany->delete();

        return redirect()->back()->with('success', 'Student company record deleted.');
    }

    public function show($studentId)
{
    $studentCompany = StudentCompany::with('company')
        ->where('Student_ID', $studentId)
        ->first();

    return inertia('Student/StudentDetails', [
        'student' => Student::find($studentId),
        'companyData' => $studentCompany ? [
            'Comp_name' => $studentCompany->company->Comp_name ?? 'Not Available',
            'Status' => $studentCompany->Status ?? 'Not Available'
        ] : null,
    ]);
}

}
