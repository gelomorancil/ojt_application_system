<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MoaProcess;
use App\Models\Company;
use Inertia\Inertia;

class MoaProcessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // ✅ Get all Moa Processes with their associated Company name
        $moaProcesses = MoaProcess::with('company')->get();

        return Inertia::render('MoaProcess/MoaProcess', [
            'moaProcesses' => $moaProcesses, // ✅ Send to frontend
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('MoaProcess/CreateMoaProcess');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'Comp_ID' => 'required|exists:tbl_company,id', // ✅ Ensures Comp_ID exists in tbl_company
            'For_Review' => 'nullable|date',
            'For_Coordinator' => 'nullable|date',
            'For_VCAA' => 'nullable|date',
            'For_Company' => 'nullable|date',
            'For_Notarization' => 'nullable|date',
            'Expiry' => 'nullable|date',
        ]);

        // ✅ Add new MOA Process record
        MoaProcess::create($request->all());

        return redirect()->route('moaprocess.index')->with('success', 'MOA Process added successfully!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MoaProcess $moaprocess)
    {
        return Inertia::render('MoaProcess/EditMoaProcess', [
            'moaprocess' => $moaprocess
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, MoaProcess $moaprocess)
    {

        $request->validate([
            'Comp_ID' => 'required|exists:tbl_company,id',
            'For_Review' => 'nullable|date',
            'For_Coordinator' => 'nullable|date',
            'For_VCAA' => 'nullable|date',
            'For_Company' => 'nullable|date',
            'For_Notarization' => 'nullable|date',
            'Expiry' => 'nullable|date',
        ]);

        $moaprocess->update($request->all());

        return redirect()->route('moaprocess.index')->with('success', 'MOA Process updated successfully!');
    }


    public function showCompany($id)
    {
        $company = Company::findOrFail($id);

        return Inertia::render('MoaProcess/CompanyDetails', [
            'company' => $company
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Find the company
        $company = Company::findOrFail($id);

        // Delete the company first
        $company->delete();

        // Then delete the related MOA process entry
        MoaProcess::where('Comp_ID', $id)->delete();

        return redirect()->back()->with('success', 'Company deleted first, then MOA Process deleted.');
    }

}
