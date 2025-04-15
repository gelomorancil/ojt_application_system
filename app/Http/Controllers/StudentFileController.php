<?php

namespace App\Http\Controllers;

use App\Models\StudentFile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StudentFileController extends Controller
{
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
        $file->storeAs('public/uploads', $filename);

        StudentFile::create([
            'Student_Num' => $request->Student_Num,
            'category' => $request->category,
            'file_name' => $filename,
        ]);

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    public function show($id)
    {
        $files = StudentFile::where('Student_Num', $id)
            ->get()
            ->groupBy('category');

        return Inertia::render('Student/UploadFiles', [
            'studentFiles' => $files,
        ]);
    }

    public function download($id)
    {
        $file = StudentFile::findOrFail($id);
        return Storage::download('public/uploads/' . $file->file_name);
    }
}
