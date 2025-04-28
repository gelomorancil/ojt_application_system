<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCompany;
use App\Models\Company;
use App\Models\Student;
use App\Models\OjtHours;
use App\Models\StudentFile;
use Inertia\Inertia;
use \Illuminate\Support\Facades\Storage;
use \Illuminate\Support\Facades\Auth;

class InternStudentCompanyController extends Controller
{
    public function show($studentId)
    {
        // Get the student and related company data
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
        ->where('tbl_student.id', $studentId)
        ->firstOrFail();

        // Get the companies associated with the student
        $studentCompany = StudentCompany::where('Student_ID', $studentId)
            ->with('company') // Load related company details
            ->get();

        // Retrieve relevant deployment files (Pre-deployment, Deployment, Final)
        $preDeployment = StudentFile::where('Student_Num', $studentId)
            ->whereIn('category', [
                'RESUME',
                'ENDORSEMENT LETTER',
                'APPLICATION LETTER',
                "PARENT'S/GUARDIAN CONSENT",
                "PARENT'S/GUARDIAN ID",
                "LETTER OF INTENT",
            ])
            ->get();

        $deployment = StudentFile::where('Student_Num', $studentId)
            ->whereIn('category', [
                "INTERNSHIP PROGRAM COVER",
                "COMPANY PROFILE",
                "CERTIFICATE OF REGISTRATION",
                "INTERNSHIP UNDERTAKING",
                "INTERNSHIP INFORMATION SHEET",
                "DAILY TIME RECORD",
            ])
            ->get();

        $final = StudentFile::where('Student_Num', $studentId)
            ->whereIn('category', [
                "DAILY TIME RECORD (DTR)",
                "ACCOMPLISHMENT REPORT",
                "STUDENT INTERNSHIP EVALUATION",
                "CERTIFICATE OF COMPLETION",
            ])
            ->get();

        // Pass the data to the Inertia page
        return Inertia::render('Intern/StudentDetails', [
            'student' => $student,
            'student_company' => $studentCompany,
            'preDeployment' => $preDeployment,
            'deployment' => $deployment,
            'final' => $final,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    // File Upload Method (from StudentFileController)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'Student_Num' => 'required',
            'category' => 'required',
            'file_name' => 'required|string',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();

        Storage::disk('public')->putFileAs('uploads', $file, $filename);

        StudentFile::create([
            'Student_Num' => $request->Student_Num,
            'category' => $request->category,
            'file_name' => $filename,
            'needs_letter_of_intent' => $request->category === 'LETTER OF INTENT' ? true : false,
        ]);

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    // File Listing Method (from StudentFileController)
    public function showFiles($studentId)
    {
        $files = StudentFile::where('Student_Num', $studentId)
            ->get()
            ->groupBy('category');

        return Inertia::render('Student/UploadFiles', [
            'studentFiles' => $files,
        ]);
    }

    // File Download Method (from StudentFileController)
    public function download($id)
    {
        $file = StudentFile::findOrFail($id);
        return Storage::download('public/uploads/' . $file->file_name);
    }

    // File Deletion Method (from StudentFileController)
    public function destroy($fileId)
    {
        $file = StudentFile::findOrFail($fileId);

        // Delete the physical file
        Storage::disk('public')->delete('uploads/' . $file->file_name);

        // Delete the database record
        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }

    // File Verification Method (from StudentFileController)
    public function verify($id)
    {
        $file = StudentFile::findOrFail($id);
        $file->verified = !$file->verified;
        $file->save();

        return redirect()->back()->with('success', 'File verification status updated.');
    }
}
