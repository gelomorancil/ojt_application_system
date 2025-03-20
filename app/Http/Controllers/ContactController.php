<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CompCourse;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'Course_id' => 'nullable|array', // Allow multiple course IDs
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
        'Course_id' => 'nullable|array', // Ensure it is an array
        'Course_id.*' => 'integer|exists:tbl_course,id', // Validate each ID
        'email' => 'required|email|max:255|unique:tbl_comp_course,email,' . $id,
        'contact_number' => 'required|string|max:20',
        'Capacity' => 'nullable|integer|min:1',
        'mode' => 'nullable|string|in:On-site,Blended,Work from Home',
        'Comp_ID' => 'required|integer|exists:tbl_company,id',
    ]);

    $contact = CompCourse::findOrFail($id); // Ensures it exists

    // Convert Course_id array to JSON before saving
    if (isset($validatedData['Course_id'])) {
        $validatedData['Course_id'] = $validatedData['Course_id'];
    }

    $contact->update($validatedData);

    return back()->with('success', 'Contact updated successfully.');
}

    /**
     * Delete a contact.
     */
    public function destroy($id)
    {
        $contact = CompCourse::find($id);
        if (!$contact) {
            return back()->withErrors(['error' => 'Contact not found.']);
        }

        $contact->delete();
        return redirect()->back()->with('success', 'Contact deleted successfully.');
    }
}
