<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompCourse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    public function index()
{
    $company_course = CompCourse::with('company')->get()->map(function ($compCourse) {
        return $compCourse;
    });

    $company_list = Company::all()->map(function ($company) {
        return [
            'id' => $company->id,
            'Comp_name' => $company->Comp_name,
            'Contact' => $company->Tel_num,
            'Address' => $company->Address,
        ];
    });

    // dd($company_course);

    return Inertia::render('Companies/Index', [
        'company_course' => $company_course,
        'company_list' => $company_list,
    ]);
}


public function store(Request $request)
{
    $request->validate([
        'Comp_name' => 'required',
        'email' => 'required|email',
        'Tel_num' => 'required',
        'address' => 'required',
        'Position' => 'required',
        'course' => 'required',
        'capacity' => 'required|integer',
        'mode' => 'required',
    ]);

    $company = Company::create([
        'Comp_name' => $request->Comp_name,
        'Address' => $request->address,
        'Tel_num' => $request->Tel_num,
    ]);

    CompCourse::create([
        'Comp_ID' => $company->id,
        'email' => $request->email,
        'Position' => $request->Position,
        'Course' => $request->course,
        'Capacity' => $request->capacity,
        'Mode' => $request->mode,
    ]);

    return redirect()->route('companies.index');
}

    public function destroy(Company $company)
    {
        $company->delete();
        return redirect()->route('companies.index');
    }
}