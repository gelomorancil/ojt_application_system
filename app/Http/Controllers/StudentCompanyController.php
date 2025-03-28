<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCompany;

class StudentCompanyController extends Controller
{
    public function saveStudentCompany(Request $request)
{
    \Log::info('Received request:', $request->all()); // Log incoming request

    $validatedData = $request->validate([
        'Student_ID' => 'required|exists:tbl_student,Student_Num',
        'Comp_ID' => 'required|exists:tbl_company,id',
        'Sem' => 'required|in:1st,2nd,Summer',
        'AY' => 'required',
        'Status' => 'required|in:Denied,On going,Completed'
    ]);

    try {
        $studentCompany = StudentCompany::create([
            'Student_ID' => $validatedData['student_id'],
            'Comp_ID' => $validatedData['Comp_ID'],
            'Sem' => $validatedData['Sem'],
            'AY' => $validatedData['AY'],
            'Status' => $validatedData['Status']
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Company information saved successfully',
            'data' => $studentCompany
        ]);
    } catch (\Exception $e) {
        \Log::error('Error saving student company:', ['error' => $e->getMessage()]); // Log error
        return response()->json([
            'success' => false,
            'message' => 'Failed to save company information',
            'error' => $e->getMessage()
        ], 500);
    }
}

}
