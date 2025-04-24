<?php

namespace App\Http\Controllers;

use App\Models\Form;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class FormsController extends Controller
{
    /**
     * Display the forms page with data
     */
    public function index(Request $request, $collegeId = null)
    {
        // If no collegeId is specified, use 1 as default
        if (!$collegeId) {
            $collegeId = 1;
        }
        
        // Get forms from database using the Form model
        $forms = Form::where('Course_ID', $collegeId)
            ->select(['id', 'Filename', 'Label'])
            ->get();
        
        // For API requests, return JSON data
        if ($request->expectsJson()) {
            return response()->json(['forms' => $forms]);
        }
        
        // For web requests, return Inertia view with data
        return Inertia::render('Forms', [
            'forms' => $forms
        ]);
    }

    /**
     * Upload a new form template
     */
    public function upload(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:255',
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:10240', // 10MB max
            'college_id' => 'required|integer'
        ]);
        
        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            return back()->withErrors($validator)->withInput();
        }
        
        try {
            // Get form data
            $label = $request->input('label');
            $collegeId = $request->input('college_id');
            $file = $request->file('file');
            
            // Generate a unique filename
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = Str::slug($label) . '-' . time() . '.' . $extension;
            
            // Store the file
            $filePath = $file->storeAs(
                "forms", 
                $filename, 
                'public'
            );
            
            // Insert using the Form model
            $form = Form::create([
                'Course_ID' => $collegeId,
                'Label' => $label,
                'Filename' => $filename
            ]);
            
            // Log successful upload
            Log::info("Form uploaded: {$label}");
            
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Form uploaded successfully'
                ]);
            }
            
            return redirect()->route('forms.index')->with('success', 'Form uploaded successfully');
            
        } catch (\Exception $e) {
            Log::error('Form upload error: ' . $e->getMessage());
            
            if ($request->expectsJson()) {
                return response()->json(['error' => 'An error occurred while uploading: ' . $e->getMessage()], 500);
            }
            
            return back()->with('error', 'An error occurred while uploading: ' . $e->getMessage());
        }
    }

    /**
     * Download a specific form
     */
    public function download($id, Request $request)
{
    try {
        // Get form details using the Form model
        $form = Form::findOrFail($id);
        
        $filePath = storage_path('app/public/forms/' . $form->Filename);
        
        // Check if file exists
        if (!File::exists($filePath)) {
            Log::warning("File not found: {$filePath} for form ID: {$id}");
            return back()->with('error', 'File not found on server');
        }
        
        // Check if this is a preview request
        if ($request->has('preview') && $request->preview === 'true') {
            // Get file extension
            $extension = File::extension($filePath);
            
            // For PDF files, we can display them directly
            if (strtolower($extension) === 'pdf') {
                return response()->file($filePath, [
                    'Content-Type' => 'application/pdf',
                ]);
            }
            
            // For other file types, we'll need to handle differently
            // For Office documents, you might redirect to a preview service
            // or use a library that converts them to viewable format
            
            // For now, just send with inline disposition
            return response()->file($filePath, [
                'Content-Type' => $this->getContentType($filePath),
                'Content-Disposition' => 'inline; filename="' . $form->Label . '"'
            ]);
        }
        
        // If not a preview, log download and proceed with download
        $this->logFormDownload($form->id);
        
        // Get file extension safely
        $extension = File::extension($filePath);
        $downloadFilename = Str::slug($form->Label) . '.' . $extension;
        
        // Return file for download
        return response()->download(
            $filePath,
            $downloadFilename,
            [
                'Content-Type' => $this->getContentType($filePath),
                'Content-Disposition' => 'attachment; filename="' . $downloadFilename . '"'
            ]
        );
    } catch (\Exception $e) {
        Log::error('Form download error: ' . $e->getMessage());
        return back()->with('error', 'Failed to download form');
    }
}

    /**
     * Delete a form
     */
    public function deleteForm($id)
    {
        try {
            // Get form details using the Form model
            $form = Form::findOrFail($id);
            
            // Delete the file
            $filePath = storage_path('app/public/forms/' . $form->Filename);
            if (File::exists($filePath)) {
                File::delete($filePath);
            }
            
            // Delete from database
            $form->delete();
            
            // Log deletion
            Log::info("Form deleted: ID {$id}");
            
            if (request()->expectsJson()) {
                return response()->json(['success' => true, 'message' => 'Form deleted successfully']);
            }
            
            return redirect()->route('forms.index')->with('success', 'Form deleted successfully');
            
        } catch (\Exception $e) {
            Log::error('Form deletion error: ' . $e->getMessage());
            
            if (request()->expectsJson()) {
                return response()->json(['error' => 'Failed to delete form: ' . $e->getMessage()], 500);
            }
            
            return back()->with('error', 'Failed to delete form');
        }
    }

    /**
     * Log form downloads (for analytics)
     */
    protected function logFormDownload($formId)
    {
        try {
            DB::table('form_downloads')->insert([
                'form_id' => $formId,
                'user_id' => Auth::id() ?? null,
                'downloaded_at' => now(),
                'ip_address' => request()->ip()
            ]);
        } catch (\Exception $e) {
            // Just log the error but don't fail the download
            Log::error('Failed to log download: ' . $e->getMessage());
        }
    }

    /**
     * Get content type based on file extension
     */
    protected function getContentType($filename)
    {
        $extension = strtolower(File::extension($filename));
        
        $contentTypes = [
            'pdf' => 'application/pdf',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc' => 'application/msword',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls' => 'application/vnd.ms-excel',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain',
            'csv' => 'text/csv',
        ];

        return $contentTypes[$extension] ?? 'application/octet-stream';
    }
}