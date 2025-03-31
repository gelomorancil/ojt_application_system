<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentCompany;
use Inertia\Inertia;

class StudentCompanyController extends Controller
{
    // // INDEX METHOD
    // public function index()
    // {
    //     $studentCompanies = StudentCompany::all();

    //     return Inertia::render('StudentCompanies/Index', [
    //         'studentCompanies' => $studentCompanies,
    //     ]);
    // }

    // STORE METHOD
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'Student_ID' => 'required|exists:tbl_student,Student_Num',
            'Comp_ID' => 'required|exists:tbl_company,id',
            'Sem' => 'required|in:1st,2nd,Summer',
            'AY' => 'required',
            'Status' => 'required|in:Denied,On going,Completed'
        ]);

        StudentCompany::create([
            'Student_ID' => $validatedData['Student_ID'],
            'Comp_ID' => $validatedData['Comp_ID'],
            'Sem' => $validatedData['Sem'],
            'AY' => $validatedData['AY'],
            'Status' => $validatedData['Status']
        ]);

        return redirect()->route('student-companies.index')->with('success', 'Student company saved successfully.');
    }

    // EDIT METHOD
    public function edit($id)
    {
        $studentCompany = StudentCompany::findOrFail($id);

        return Inertia::render('StudentCompanies/Edit', [
            'studentCompany' => $studentCompany,
        ]);
    }

    // UPDATE METHOD
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'Student_ID' => 'required|exists:tbl_student,Student_Num',
            'Comp_ID' => 'required|exists:tbl_company,id',
            'Sem' => 'required|in:1st,2nd,Summer',
            'AY' => 'required',
            'Status' => 'required|in:Denied,On going,Completed'
        ]);

        $studentCompany = StudentCompany::findOrFail($id);

        $studentCompany->update([
            'Student_ID' => $validatedData['Student_ID'],
            'Comp_ID' => $validatedData['Comp_ID'],
            'Sem' => $validatedData['Sem'],
            'AY' => $validatedData['AY'],
            'Status' => $validatedData['Status']
        ]);

        return redirect()->route('student-companies.index')->with('success', 'Student company updated successfully.');
    }

    // DELETE METHOD
    public function destroy($id)
    {
        StudentCompany::destroy($id);

        return redirect()->route('student-companies.index')->with('success', 'Student company deleted successfully.');
    }

    // DETAILS METHOD
    public function details($id)
    {
        $studentCompany = StudentCompany::findOrFail($id);

        return Inertia::render('StudentCompanies/View', [
            'studentCompany' => $studentCompany,
        ]);
    }
}
