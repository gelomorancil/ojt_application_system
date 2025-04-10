<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StudentFileController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'Student_Num' => 'required',
            'category' => 'required',
            'file_name' => 'required|file|mimes:pdf,jpeg,jpg,png',
        ]);

        $fileName = null;

        if ($request->hasFile('file_name')) {
            $extension = $request->file('file_name')->getClientOriginalExtension();
            $fileName = Str::random(32) . '.' . $extension;
            $path = $request->file('file_name')->storeAs('public/uploads', $fileName);
        }

        $record = StudentFile::create([
            'Student_Num' => $request->Student_Num,
            'category' => $request->category,
            'file_name' => $fileName,
        ]);

        return response()->json([
            'message' => 'File uploaded successfully!',
            'file' => $record,
        ]);
    }
}
