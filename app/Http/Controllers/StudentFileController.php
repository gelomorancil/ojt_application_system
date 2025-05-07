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
        'from_date' => 'nullable|date',
        'to_date' => 'nullable|date|after_or_equal:from_date',
    ]);

    $file = $request->file('file');
    $filename = time() . '_' . $file->getClientOriginalName();
    Storage::disk('public')->putFileAs('uploads', $file, $filename);

    // Attempt to find an existing file with matching Student_Num, category, and coverage
    $existing = StudentFile::where('Student_Num', $request->Student_Num)
        ->where('category', $request->category)
        ->where('from_date', $request->from_date)
        ->where('to_date', $request->to_date)
        ->first();

    if ($existing) {
        // Delete old file from storage if it exists
        if (Storage::disk('public')->exists('uploads/' . $existing->file_name)) {
            Storage::disk('public')->delete('uploads/' . $existing->file_name);
        }

        // Update existing record
        $existing->update([
            'file_name' => $filename,
            'uploaded_by' => auth()->id(),
        ]);
    } else {
        // Create new file record
        StudentFile::create([
            'Student_Num' => $request->Student_Num,
            'category' => $request->category,
            'file_name' => $filename,
            'needs_letter_of_intent' => $request->category === 'LETTER OF INTENT',
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
            'uploaded_by' => auth()->id(),
        ]);
    }

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

}
