<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use App\Models\ContactPerson;
use Inertia\Inertia;

class CompanyController extends Controller
{
    public function index()
    {
        return Inertia::render('Company/Company', [
            'companies' => Company::all(),
        ]);
    }
    public function create()
    {
        return Inertia::render('Company/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'Comp_name' => 'required|string|max:255',
            'Address' => 'required|string|max:500',
            'Tel_num' => 'required|string|max:20',
        ]);

        Company::create($request->all());

        return redirect()->route('company');
    }

    public function edit($id)
    {
    $company = Company::findOrFail($id);
    return Inertia::render('Company/Edit', compact('company'));
    }

    public function update(Request $request, $id)
    {
    $request->validate([
        'Comp_name' => 'required|string|max:255',
        'Address' => 'required|string|max:255',
        'Tel_num' => 'required|string|max:20',
    ]);

    $company = Company::findOrFail($id);
    $company->update($request->all());

    return redirect()->route('company')->with('success', 'Company updated successfully.');
    }

    public function destroy($id)    
    {
    $company = Company::findOrFail($id);
    $company->delete();

    return redirect()->route('company')->with('success', 'Company deleted successfully.');
    }

    public function showContacts($id)
    {
        $company = Company::findOrFail($id);
        $contacts = ContactPerson::where('Comp_ID', $id)->get();

        return Inertia::render('Company/Contacts', [
            'company' => $company,
            'contacts' => $contacts
        ]);
    }

}
