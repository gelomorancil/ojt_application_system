import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage, useForm } from '@inertiajs/react';
import { FaSearch } from 'react-icons/fa';

export default function MoaProcess() {
    const { moaProcesses } = usePage().props;
    const { delete: destroy, processing } = useForm();
    const { data, setData, post, put, reset } = useForm({
        id: '',
        Comp_ID: '',
        Comp_name: '',
        For_Review: '',
        For_Coordinator: '',
        For_VCAA: '',
        For_Company: '',
        For_Notarization: '',
        Expiry: '',
    });

    const [editing, setEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this company?")) {
            destroy(route("moa_process.destroy", id), {
                preserveScroll: true,
                onSuccess: () => {
                    window.location.reload();
                }
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editing) {
            put(route("moaProcess.update", data.id), {
                onSuccess: () => {
                    resetForm();
                    window.location.reload();
                },
                onError: (errors) => {
                    console.error(errors);
                },
            });
        }
    };

    const handleEdit = (moa) => {
        setData({
            id: moa.id,
            Comp_ID: moa.Comp_ID,
            Comp_name: moa.company?.Comp_name || '',
            For_Review: moa.For_Review || '',
            For_Coordinator: moa.For_Coordinator || '',
            For_VCAA: moa.For_VCAA || '',
            For_Company: moa.For_Company || '',
            For_Notarization: moa.For_Notarization || '',
            Expiry: moa.Expiry || '',
        });

        setEditing(true);
    };

    const resetForm = () => {
        reset();
        setEditing(false);
    };

    const filteredMoaProcesses = moaProcesses.filter((moa) =>
        moa.company?.Comp_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AuthenticatedLayout>
            <div className="p-6 flex flex-row">
                {/* ✅ Form Section (LEFT) */}
                <div className="w-1/4 bg-white p-4 rounded-lg shadow border border-gray-300 mr-4 sticky top-6">
                    <h2 className="text-md font-semibold text-gray-700 mb-4">
                        {editing ? "Edit MOA Process" : "MOA Process Form"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">Company</label>
                            <input
                                type="text"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                                value={data.Comp_name}
                                disabled
                            />
                        </div>

                        <input type="hidden" value={data.Comp_ID} />

                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">For Review</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                value={data.For_Review}
                                onChange={(e) => setData('For_Review', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">For Coordinator</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                value={data.For_Coordinator}
                                onChange={(e) => setData('For_Coordinator', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">For VCAA</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                value={data.For_VCAA}
                                onChange={(e) => setData('For_VCAA', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">For Company</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                value={data.For_Company}
                                onChange={(e) => setData('For_Company', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">For Notarization</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                value={data.For_Notarization}
                                onChange={(e) => setData('For_Notarization', e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-medium">Expiry</label>
                            <input
                                type="date"
                                className="w-full border-gray-300 rounded-md shadow-sm p-2"
                                value={data.Expiry}
                                onChange={(e) => setData('Expiry', e.target.value)}
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className={`w-full py-2 rounded text-white ${
                                    editing ? "bg-green-500 hover:bg-green-700" : "bg-gray-500 cursor-not-allowed"
                                }`}
                                disabled={!editing || processing}
                            >
                                Update MOA
                            </button>

                            <button
                                type="button"
                                className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* ✅ Table Section (RIGHT) */}
                <div className="w-3/4 bg-white p-4 rounded-lg shadow border border-gray-300">
                    <h1 className="text-md font-semibold text-gray-700 mb-2">MOA Process List</h1>

                    {/* ✅ Search Bar */}
                    <div className="mb-4 w-1/2 relative"> {/* Adjust width here */}
    <FaSearch className="absolute left-3 top-3 text-gray-500" /> {/* Search icon */}
    <input
        type="text"
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search by Company Name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
    />
</div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-200 h-12">
                                    <th className="p-2 text-left">No.</th>
                                    <th className="p-2 text-left">Company Name</th>
                                    <th className="p-2 text-left">For Review</th>
                                    <th className="p-2 text-left">For Coordinator</th>
                                    <th className="p-2 text-left">For VCAA</th>
                                    <th className="p-2 text-left">For Company</th>
                                    <th className="p-2 text-left">For Notarization</th>
                                    <th className="p-2 text-left">Expiry</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMoaProcesses.length > 0 ? (
                                    filteredMoaProcesses.map((moa, index) => (
                                        <tr key={moa.id} className="h-10 border-b">
                                            <td className="p-2">{index + 1}</td>
                                            <td
                                                className="p-2 text-blue-500 hover:underline cursor-pointer"
                                                onClick={() => handleEdit(moa)}
                                            >
                                                {moa.company?.Comp_name || ''}
                                            </td>
                                            <td className="p-2">{moa.For_Review || ''}</td>
                                            <td className="p-2">{moa.For_Coordinator || ''}</td>
                                            <td className="p-2">{moa.For_VCAA || ''}</td>
                                            <td className="p-2">{moa.For_Company || ''}</td>
                                            <td className="p-2">{moa.For_Notarization || ''}</td>
                                            <td className="p-2">{moa.Expiry || ''}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="p-2 text-center text-gray-500">
                                            No MOA processes found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
