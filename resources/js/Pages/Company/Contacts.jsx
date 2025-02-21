import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { PencilSquareIcon, TrashIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from 'react';
import axios from 'axios';

export default function Contacts({ company, contacts }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: '',
        Comp_ID: company.id,
        name: '',
        department: '',
        position: '',
        email: '',
        phone: ''
    });

    const openModal = (contact = null) => {
        if (contact) {
            setIsEditing(true);
            setData({
                id: contact.id,
                Comp_ID: contact.comp_id,
                name: contact.name,
                department: contact.department || '',
                position: contact.position,
                email: contact.email,
                phone: contact.phone || ''
            });
        } else {
            setIsEditing(false);
            reset();
        }
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('contact.update', data.id), {
                onSuccess: () => {
                    alert('Contact updated successfully!');
                    closeModal();
                }
            });
        } else {
            post(route('contact.store'), {
                onSuccess: () => {
                    alert('New contact added successfully!');
                    closeModal();
                }
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;

        try {
            await axios.delete(route('contact.destroy', id));
            alert("Contact deleted successfully");
            window.location.reload(); // Refresh page after delete
        } catch (error) {
            console.error("Error deleting contact:", error);
            alert("Failed to delete contact");
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Contact Persons for {company.Comp_name}
                </h2>
            }
        >
            <Head title={`Contacts - ${company.Comp_name}`} />

            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">List of Contact Persons</h3>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-1" />
                        Add Contact
                    </button>
                </div>

                {/* Contact Persons Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr className="text-left">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Position</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Phone</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length > 0 ? (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2 max-w-4/12">{contact.name}</td>
                                        <td className="border border-gray-300 px-4 py-2 max-w-4/12">{contact.department || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2 max-w-4/12">{contact.position}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <a href={`mailto:${contact.email}`} className="text-blue-500 underline">
                                                {contact.email}
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{contact.phone || 'N/A'}</td>
                                        <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                                            <button
                                                onClick={() => openModal(contact)}
                                                className="text-blue-500 hover:text-blue-700"
                                            >
                                                <PencilSquareIcon className="h-6 w-6" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(contact.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="h-6 w-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">
                                        No contact persons available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-semibold mb-4">
                            {isEditing ? 'Edit Contact Person' : 'Add New Contact Person'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block font-semibold">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold">Department</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded"
                                    value={data.department}
                                    onChange={(e) => setData('department', e.target.value)}
                                />
                                {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold">Position</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded"
                                    value={data.position}
                                    onChange={(e) => setData('position', e.target.value)}
                                />
                                {errors.position && <p className="text-red-500 text-sm">{errors.position}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border rounded"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold">Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border rounded"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    {processing ? 'Saving...' : isEditing ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
