<?php

namespace App\Http\Controllers;

use App\Models\Moa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MoaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:2048',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'Comp_ID' => 'required|exists:tbl_company,id',
        ]);

        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();

        $filePath = $file->storeAs('moa_files', $fileName, 'public');

        Moa::create([
            'Comp_ID' => $request->Comp_ID,
            'File_name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'File_type' => 'PDF',
            'File' => $filePath,
            'Start' => $request->start,
            'End' => $request->end,
            'uploaded_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'MOA uploaded successfully.');
    }

    public function index()
    {
        $moa_list = Moa::with('company')->get();
        return Inertia::render('Companies/View', ['moa_list' => $moa_list]);
    }

    public function destroy($id)
    {
        $moa = Moa::findOrFail($id);

        // Check if the file exists and delete it
        if ($moa->File && Storage::disk('public')->exists($moa->File)) {
            Storage::disk('public')->delete($moa->File);
        }

        // Delete the MOA record from the database
        $moa->delete();

        return redirect()->back()->with('success', 'MOA deleted successfully.');
    }

}
