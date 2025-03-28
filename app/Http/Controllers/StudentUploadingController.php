<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentUploadingController extends Controller
{
    public function index()
    {
        return Inertia::render('StudentUploading/StudentUploading'); // Ensure the Inertia component exists
    }

    public function upload(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'college' => 'required|string',
            'course' => 'required|string',
            'schoolYear' => 'required|string',
            'semester' => 'required|string',
            'file' => 'required|file|mimes:xlsx,xls,csv'
        ]);

        try {
            // Process the file upload
            $file = $request->file('file');
            $filename = $file->getClientOriginalName();
            $path = $file->store('student-uploads'); // Store in storage/app/student-uploads

            // Additional processing logic here (e.g., reading Excel file, saving to database)
            
            // Redirect back with success message
            return redirect()->back()->with('success', 'Students uploaded successfully');
        } catch (\Exception $e) {
            // Redirect back with error message
            return redirect()->back()->withErrors(['msg' => 'Upload failed: ' . $e->getMessage()]);
        }
    }
}
