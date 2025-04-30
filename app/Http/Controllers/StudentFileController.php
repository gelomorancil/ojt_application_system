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

    // dd($request->all());
    $validated = $request->validate([
        'Student_Num' => 'required',
        'category' => 'required',
        'file_name' => 'required|string',
        'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:20480',
        'from_date' => 'nullable',
        'to_date' => 'nullable|date|after_or_equal:from_date',
    ]);

    $file = $request->file('file');
    $filename = time() . '_' . $file->getClientOriginalName();

    Storage::disk('public')->putFileAs('uploads', $file, $filename);

    StudentFile::create([
        'Student_Num' => $request->Student_Num,
        'category' => $request->category,
        'file_name' => $filename,
        'needs_letter_of_intent' => $request->category === 'LETTER OF INTENT' ? true : false,
        'from_date' => $request->from_date,
        'to_date' => $request->to_date,
        'uploaded_by' => auth()->id(),
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

    public function destroy($fileId)
{
    $file = StudentFile::findOrFail($fileId);

    // Delete the physical file
    Storage::disk('public')->delete('uploads/' . $file->file_name);

    // Delete the database record
    $file->delete();

    return redirect()->back()->with('success', 'File deleted successfully.');
}

public function verify($id)
    {
        $file = StudentFile::findOrFail($id);
        $file->verified = !$file->verified;
        $file->save();

        return redirect()->back()->with('success', 'File verification status updated.');
    }

    public function replace(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:10240',
        ]);
    
        $studentFile = StudentFile::findOrFail($id);
    
        // Delete old file from storage
        if ($studentFile->file_path && Storage::disk('public')->exists($studentFile->file_path)) {
            Storage::disk('public')->delete($studentFile->file_path);
        }
    
        // Store new file
        $newFile = $request->file('file');
        $filename = time() . '_' . $newFile->getClientOriginalName();
        $path = $newFile->storeAs('student_files', $filename, 'public');
    
        // Update the row in the database
        $studentFile->file_name = $filename;
        $studentFile->file_path = $path;
        $studentFile->verified = false; // Optional: reset verification status
        $studentFile->save();
    
        return response()->json(['message' => 'File replaced successfully.']);
    }

}
