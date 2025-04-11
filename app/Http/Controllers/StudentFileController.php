<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentFile;
use Illuminate\Support\Facades\Storage;

class StudentFileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'Student_Num' => 'required|string',
            'files.*' => 'file|mimes:pdf',
            'category' => 'required|string',
        ]);

        $uploadedFiles = [];

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs("public/student_files/{$request->category}", $filename);

                $record = StudentFile::create([
                    'Student_Num' => $request->Student_Num,
                    'file_name' => $filename,
                    'category' => $request->category,
                ]);

                $uploadedFiles[] = $record;
            }
        }

        return response()->json([
            'message' => 'Files uploaded successfully.',
            'files' => $uploadedFiles,
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'Student_Num' => 'required|string|exists:tbl_student,Student_Num',
        'category' => 'required|string',
        'file' => 'required|file|mimes:pdf',
    ]);

    // Check if a file in this category already exists for the student
    $exists = StudentFile::where('Student_Num', $request->Student_Num)
        ->where('category', $request->category)
        ->where('file_name', $request->file->getClientOriginalName())
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'This file has already been uploaded in this category.'
        ], 409);
    }

    $file = $request->file('file');
    $filename = time() . '_' . $file->getClientOriginalName();
    $file->storeAs('student_files', $filename, 'public');

    $studentFile = new StudentFile();
    $studentFile->Student_Num = $request->Student_Num;
    $studentFile->file_name = $filename;
    $studentFile->category = $request->category;
    $studentFile->save();

    return response()->json(['message' => 'File uploaded successfully.']);
}

}
