<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\ContactPerson;
use Inertia\Inertia;
use App\Models\CompCourse;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
//     public function index()
// {
//     $company_course = CompCourse::with('company')->get()->map(function ($compCourse) {
//         return $compCourse;
//     });

//     $company_list = Company::all()->map(function ($company) {
//         return [
//             'id' => $company->id,
//             'Comp_name' => $company->Comp_name,
//             'Contact' => $company->Tel_num,
//             'Address' => $company->Address,
//         ];
//     });

//     // dd($company_course);

//     return Inertia::render('Companies/Index', [
//         'company_course' => $company_course,
//         'company_list' => $company_list,
//     ]);
// }

// NEW INDEX

public function index()
{
    $company_list = Company::all(); // Missing semicolon fixed

    return Inertia::render('Companies/Index', [
        'company_list' => $company_list,
    ]);
}


public function store(Request $request)
{
    $request->validate([
        'Comp_name' => 'required',
        'Address' => 'required',
        'Course' => 'required',
    ]);

    Company::create([
        'Comp_name' => $request->Comp_name,
        'Address' => $request->Address,
        'Course' => $request->Course,
    ]);

    return redirect()->route('companies.index');
}

public function edit($id)
{
    $companyCourse = CompCourse::where('Comp_ID', $id)->first();
    $company_list = Company::all()->map(function ($company) {
        return [
            'id' => $company->id,
            'Comp_name' => $company->Comp_name,
            'Address' => $company->Address,
            'Course' => $companyCourse->course,
        ];
    });
}

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'Comp_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'Tel_num' => 'nullable|string|max:20',
            'Position' => 'nullable|string|max:255',
            'course' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'capacity' => 'nullable|integer|min:1',
            'mode' => 'nullable|string|in:On-Site,Blended,Work From Home',
        ]);

        
        $company = Company::findOrFail($id);
        $company->update([
            'Comp_name' => $validatedData['Comp_name'],
            'Tel_num' => $validatedData['Tel_num'],
            'Address' => $validatedData['address'],
        ]);

       
        $companyCourse = CompCourse::where('Comp_ID', $id);
        if ($companyCourse) {
            $companyCourse->update([
                'email' => $validatedData['email'],
                'Position' => $validatedData['Position'],
                'Course' => $validatedData['course'],
                'Capacity' => $validatedData['capacity'],
                'Mode' => $validatedData['mode'],
            ]);
        } else {
            CompCourse::create([
                'Comp_ID' => $id,
                'email' => $validatedData['email'],
                'Position' => $validatedData['Position'],
                'Course' => $validatedData['course'],
                'Capacity' => $validatedData['capacity'],
                'Mode' => $validatedData['mode'],
            ]);
        }

        return redirect()->back()->with('success', 'Company updated successfully.');
    }




public function destroy(Request $request)
{
    // Ensure related internship records are deleted first
    CompCourse::where('Comp_ID', $request->id)->delete();
    Company::where('id', $request->id)->delete();
    // $company->delete();

    return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
}

public function details($id)
    {
        // Retrieve the company by id using `where` clause
        $company = Company::where('id', $id)->firstOrFail();

        // Return Inertia response with the company data
        return Inertia::render('Companies/View', [
            'company' => $company
        ]);
    }

}
