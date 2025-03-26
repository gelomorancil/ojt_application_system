<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCompany;

class StudentCompanyController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'student_id' => 'required|exists:students,Student_Num',
            'company' => 'required|string',
            'semester' => 'required|string',
            'schoolYear' => 'required|string',
        ]);

        StudentCompany::create([
            'student_id' => $validatedData['student_id'],
            'company' => $validatedData['company'],
            'semester' => $validatedData['semester'],
            'school_year' => $validatedData['schoolYear'],
        ]);

        return response()->json(['message' => 'Data saved successfully'], 201);
    }
}
