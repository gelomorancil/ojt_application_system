import React from "react";

export default function ContactList({ contacts = [], handleDelete, contact_list, handleEdit }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto min-h-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed align-top">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {contact_list.length > 0 ? (
                        contact_list.map((contact, index) => (
                            <tr key={contact.id} className="hover:bg-gray-50">
                                <td className="align-top px-4 py-4">{index + 1}</td>
                                <td className="align-top px-4 py-4">{contact.name}</td>
                                <td className="align-top px-4 py-4">{contact.position}</td>
                                <td className="align-top px-4 py-4 max-w-[200px]">{contact.Course || "N/A"}</td>
                                <td className="align-top px-4 py-4">{contact.email}</td>
                                <td className="align-top px-4 py-4">{contact.contact_number}</td>
                                <td className="align-top px-4 py-4">{contact.Capacity || "N/A"}</td>
                                <td className="align-top px-4 py-4">{contact.mode}</td>
                                <td className="align-top px-4 py-4 flex gap-2">
                                    <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:underline">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:underline ml-2">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="px-4 py-3 text-center text-gray-500">
                                No contacts available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
