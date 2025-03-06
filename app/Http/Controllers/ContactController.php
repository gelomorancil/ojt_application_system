<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompCourse;
use App\Models\Company;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Store a new contact for a company.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'Course' => 'nullable|string|max:255',
            'email' => 'required|email|max:255|unique:tbl_comp_course,email',
            'contact_number' => 'required|string|max:20',
            'Capacity' => 'nullable|integer|min:1',
            'mode' => 'nullable|string|in:On-site,Blended,Work from Home',
            'Comp_ID' => 'required|integer|exists:tbl_company,id',
        ]);
        CompCourse::create($validatedData);

        return back()->with('success', 'Contact added successfully.');
    }

    /**
     * Update an existing contact.
     */
    public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'position' => 'required|string|max:255',
        'Course' => 'nullable|string|max:255',
        'email' => 'required|email|max:255|unique:tbl_comp_course,email,' . $id,
        'contact_number' => 'required|string|max:20',
        'Capacity' => 'nullable|integer|min:1',
        'mode' => 'nullable|string|in:On-site,Blended,Work from Home',
        'Comp_ID' => 'required|integer|exists:tbl_company,id',
    ]);

    $contact = CompCourse::findOrFail($id);
    $contact->update($validatedData);

    return back()->with('success', 'Contact updated successfully.');
}


    /**
     * Delete a contact.
     */
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return redirect()->back()->with('success', 'Contact deleted successfully.');
    }


}
