<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\StudentsImport;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:xlsx,xls|max:2048', // Accepts Excel files only
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Store file temporarily
        $file = $request->file('file');
        $filePath = $file->store('uploads');

        // Process Excel file
        Excel::import(new StudentsImport, $filePath);

        return response()->json(['message' => 'File uploaded successfully']);
    }
}
