import { useState } from "react";
import { useForm } from "@inertiajs/react";

export default function ContactForm({data, setData, handleSubmit, editingContact, resetForm, errors }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg w-full max-w-md m-4">
            <h3 className="mb-4 text-lg font-semibold">
                {editingContact ? 'Edit Contact' : 'Add Contacts'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <input type="text" placeholder="Name" value={data.name} onChange={(e) => setData("name", e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="Position" value={data.position} onChange={(e) => setData("position", e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="Courses" value={data.Course} onChange={(e) => setData("Course", e.target.value)} className="border p-2 rounded" />
                <input type="email" placeholder="Email" value={data.email} onChange={(e) => setData("email", e.target.value)} className="border p-2 rounded" required />
                <input type="text" placeholder="Contact Number" value={data.contact_number} onChange={(e) => setData("contact_number", e.target.value)} className="border p-2 rounded" required />
                <input type="number" placeholder="Capacity" value={data.Capacity} onChange={(e) => setData("Capacity", e.target.value)} className="border p-2 rounded" />
                <select value={data.mode} onChange={(e) => setData("mode", e.target.value)} className="border p-2 rounded">
                    <option value="">Select Mode</option>
                    <option value="On-site">On-site</option>
                    <option value="Blended">Blended</option>
                    <option value="Work from Home">Work from Home</option>
                </select>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>
                {editingContact && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="w-full bg-gray-500 text-white py-2 rounded mt-2"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
}
