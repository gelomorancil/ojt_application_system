<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\ContactPerson;
use Inertia\Inertia;
use App\Models\CompCourse;
use App\Models\MoaProcess;
use Illuminate\Support\Facades\DB;

class CompanyController extends Controller
{
    // INDEX METHOD
    public function index()
    {

        $company_list = Company::all();

        return Inertia::render('Companies/Index', [
            'company_list' => $company_list,
        ]);
    }

    // STORE METHOD
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
    $company = Company::findOrFail($id);

    return Inertia::render('Companies/Edit', [
        'company' => $company,
    ]);
}


    // UPDATE METHOD (FIXED)
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'Comp_name' => 'required',
            'Address' => 'required',
            'Course' => 'required',
        ]);

        $company = Company::findOrFail($id);
        $company->update([
            'Comp_name' => $validatedData['Comp_name'],
            'Course' => $validatedData['Course'],
            'Address' => $validatedData['Address'],
        ]);

        return redirect()->route('companies.index');
    }
    // DELETE METHOD
    public function destroy(Request $request)
    {
        // Delete from tbl_company first
        Company::where('id', $request->id)->delete();

        // Then delete related records from tbl_moa_process
        MoaProcess::where('Comp_ID', $request->id)->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }


    // DETAILS METHOD
    public function details($id)
{
    $company = Company::findOrFail($id);
    $contact_list = CompCourse::where('Comp_ID', $id)->get();

    return Inertia::render('Companies/View', [
        'company' => $company,
        'contact_list' => $contact_list
    ]);
}


    // PROFILE METHOD
    public function profile($id)
{
    $company = Company::with('contacts')->findOrFail($id);
    return Inertia::render('Companies/Profile', [
        'company' => $company
    ]);
}

}
