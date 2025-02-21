<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ContactPerson;

class ContactController extends Controller
{
    public function showContacts($id)
{
    $contacts = ContactPerson::where('Comp_ID', $id)->get();
    dd($contacts); // Debugging: Check if contacts exist
}


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        ContactPerson::create($request->all());

        return redirect()->back()->with('success', 'Contact added successfully!');
    }

    public function update(Request $request, $id)
    {
        $contact = ContactPerson::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $contact->update($request->all());

        return redirect()->back()->with('success', 'Contact updated successfully!');
    }

    public function destroy($id)
    {
        $contact = ContactPerson::findOrFail($id);
        $contact->delete();

        return redirect()->back()->with('success', 'Contact deleted successfully!');
    }
}
