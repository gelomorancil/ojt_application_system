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
            'files' => 'required|array',
        ]);
    
        $uploadedFiles = [];
    
        foreach ($request->file('files') as $docType => $file) {
            if ($file && $file->isValid()) {
                $extension = $file->getClientOriginalExtension();
                $fileName = Str::random(32) . '.' . $extension;
                $file->storeAs('public/uploads', $fileName);
    
                $record = StudentFile::create([
                    'Student_Num' => $request->Student_Num,
                    'category' => $request->category,
                    'file_name' => $fileName,
                ]);
    
                $uploadedFiles[] = $record;
            }
        }
    
        return response()->json([
            'message' => 'Files uploaded successfully!',
            'files' => $uploadedFiles,
        ]);
    }
    
}
