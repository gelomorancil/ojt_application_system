<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCompany;
use App\Models\StudentFile;
use App\Models\Company;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


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

    public function show()
    {
        $user = Auth::user();
        $id = $user->student_id;
        $student = Student::select(
                'tbl_student.id',
                'tbl_student.Student_Num',
                'tbl_student.Fname',
                'tbl_student.Lname',
                'tbl_student.Year',
                'tbl_course.College as College_Name',
                'tbl_course.Course as Course_Name',
                'tbl_ojt_hrs.Hrs as Ojt_Hours',
                'tbl_ojt_hrs.Sem as Semester'
            )
            ->leftJoin('tbl_course', 'tbl_student.Course_ID', '=', 'tbl_course.id')
            ->leftJoin('tbl_ojt_hrs', 'tbl_student.Course_ID', '=', 'tbl_ojt_hrs.Course_ID')
            ->where('tbl_student.id', $id)
            ->firstOrFail();

            $company_list = Company::all();
            // $details_list = OjtHours::all();
            $student_company = StudentCompany::where('Student_ID', $id)
        ->with('company') // Load related company details
        ->get();

    $preDeployment = StudentFile::where('Student_Num', $id)
    ->whereIn('category', [
        'RESUME',
        'ENDORSEMENT LETTER',
        'APPLICATION LETTER',
        "PARENT'S/GUARDIAN CONSENT",
        "PARENT'S/GUARDIAN ID",
        "LETTER OF INTENT",
    ])
    ->get();


    $deployment = StudentFile::where('Student_Num', $id)
    ->whereIn('category', [
        "INTERNSHIP PROGRAM COVER",
        "COMPANY PROFILE",
        "CERTIFICATE OF REGISTRATION",
        "INTERNSHIP UNDERTAKING",
        "INTERNSHIP INFORMATION SHEET",
        "DAILY TIME RECORD",
    ])
    ->get();

    $final = StudentFile::where('Student_Num', $id)
    ->whereIn('category', [
        "DAILY TIME RECORD (DTR)",
        "ACCOMPLISHMENT REPORT",
        "STUDENT INTERNSHIP EVALUATION",
        "CERTIFICATE OF COMPLETION",
    ])
    ->get();

        return Inertia::render('Student/StudentDetails', [
            'student' => $student,
            'company_list' => $company_list,
            'student_company' => $student_company,
            'preDeployment' => $preDeployment,
            'deployment' => $deployment,
            'final' => $final,
            // 'details_list' => $details_list,
        ]);
    }

}
