<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Moa;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MoaController extends Controller
{
    public function index()
    {
        // Retrieve MOAs
        $moas = Moa::all()->map(function ($moa) {
            return [
                'id' => $moa->id,
                'File_name' => $moa->File_name,
                'File_type' => $moa->File_type,
                'Start' => $moa->Start,
                'End' => $moa->End,
                'uploaded_by' => session("uploaded_by_{$moa->id}", 'Unknown'), // Get uploader from session
            ];
        });

        return Inertia::render('Moa/Moa', ['moas' => $moas]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:25600',
        ]);

        $file = $request->file('file');
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileExtension = $file->getClientOriginalExtension();
        $concatenatedFileName = $originalName . '.' . $fileExtension;
        $filePath = $file->storeAs('moa_files', $concatenatedFileName, 'public');

        // Store the file in database
        $moa = Moa::create([
            'File_name' => $originalName,
            'File_type' => $fileExtension,
            'File' => $filePath,
            'Start' => $request->input('start', now()),
            'End' => $request->input('end', now()->addYear()),
        ]);

        // Store uploader's name in session
        session(["uploaded_by_{$moa->id}" => Auth::user()->name]);

        return redirect()->route('moa')->with('success', 'PDF uploaded successfully.');
    }

    public function download($file_name, $file_type)
    {
        $filePath = "moa_files/{$file_name}.{$file_type}";

        if (!Storage::disk('public')->exists($filePath)) {
            return back()->with('error', 'File not found.');
        }

        return response()->download(storage_path("app/public/{$filePath}"), "{$file_name}.{$file_type}");
    }

    public function preview($file_name)
    {
        $filePath = storage_path("app/public/moa_files/{$file_name}");

        if (!file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        if (pathinfo($filePath, PATHINFO_EXTENSION) !== 'pdf') {
            abort(403, 'Preview is only available for PDF files.');
        }

        return response()->file($filePath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }

    public function destroy($id)
    {
        $moa = Moa::findOrFail($id);

        if (Storage::disk('public')->exists($moa->File)) {
            Storage::disk('public')->delete($moa->File);
        }

        // Remove session data for deleted file
        session()->forget("uploaded_by_{$moa->id}");

        $moa->delete();

        return redirect()->route('moa')->with('success', 'File deleted successfully.');
    }
}
