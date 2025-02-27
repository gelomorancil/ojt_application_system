import React, { useState } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Download, Eye, Trash2, Search, AlertCircle, AlertTriangle, Clock } from "lucide-react";

export default function Moa() {
    const { moas } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        file: null,
        start: "",
        end: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("moa.store"));
    };

    const handlePreview = (fileName) => {
        setPreviewUrl(route("moa.preview", { file_name: fileName + ".pdf" }));
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this file?")) {
            router.delete(route("moa.destroy", id));
        }
    };

   const filteredMoas = moas
    .filter((moa) => moa.File_name.toLowerCase().includes(search.toLowerCase()))
    .map((moa) => {
        const today = new Date();
        const endDate = new Date(moa.End);
        const timeDiff = endDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return {
            ...moa,
            daysLeft,
            isExpiringSoon: daysLeft <= 7 && daysLeft > 0,
            isExpired: daysLeft < 0,
        };
    })
    .sort((a, b) => {
        if (a.isExpired && !b.isExpired) return -1;  // Expired first
        if (!a.isExpired && b.isExpired) return 1;
        if (a.isExpiringSoon && !b.isExpiringSoon) return -1;  // Expiring soon second
        if (!a.isExpiringSoon && b.isExpiringSoon) return 1;
        return 0;  // Otherwise, keep original order
    });

    const today = new Date();
today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

const sortedMoas = [...filteredMoas].sort((a, b) => {
    const endDateA = new Date(a.End);
    const endDateB = new Date(b.End);
    endDateA.setHours(0, 0, 0, 0);
    endDateB.setHours(0, 0, 0, 0);

    const daysLeftA = Math.ceil((endDateA - today) / (1000 * 60 * 60 * 24));
    const daysLeftB = Math.ceil((endDateB - today) / (1000 * 60 * 60 * 24));

    if (daysLeftA < 0 && daysLeftB >= 0) return -1; // Expired first
    if (daysLeftB < 0 && daysLeftA >= 0) return 1;
    if (daysLeftA === 0 && daysLeftB !== 0) return -1; // Expires today second
    if (daysLeftB === 0 && daysLeftA !== 0) return 1;
    if (daysLeftA <= 7 && daysLeftB > 7) return -1; // Expiring soon third
    if (daysLeftB <= 7 && daysLeftA > 7) return 1;
    return 0; // Others remain in original order
});

    return (
        <AuthenticatedLayout
            // header={<h2 className="text-xl font-semibold text-gray-800">MOA Management</h2>}
        >
            <Head title="MOA Management" />
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-4 gap-6">
                    {/* Upload MOA Form */}
                    <div className="col-span-1 bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Upload New MOA</h3>
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upload PDF:</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => setData("file", e.target.files[0])}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                                <input
                                    type="date"
                                    value={data.start}
                                    onChange={(e) => setData("start", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date:</label>
                                <input
                                    type="date"
                                    value={data.end}
                                    onChange={(e) => setData("end", e.target.value)}
                                    min={data.start}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                                disabled={processing}
                            >
                                {processing ? "Uploading..." : "Upload MOA"}
                            </button>
                        </form>
                    </div>

                    {/* MOA Files Table */}
                    <div className="col-span-3 bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">MOA Files</h3>

                        {/* Filter Input */}
                        <div className="relative mb-4">
    <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-4 py-2 border rounded-md w-64 focus:ring-blue-500 focus:border-blue-500"
    />
    <Search size={20} className="absolute left-3 top-2.5 text-gray-500" />
</div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
    {sortedMoas.length > 0 ? (
        sortedMoas.map((moa) => {
            const endDate = new Date(moa.End);
            endDate.setHours(0, 0, 0, 0);
            const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

            const isExpired = daysLeft < 0;
            const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
            const isExpiringToday = daysLeft === 0;

            return (
                <tr key={moa.id} className={`hover:bg-gray-50
                    ${isExpired ? "bg-red-100" : ""}
                    ${isExpiringToday ? "bg-orange-100" : ""}
                    ${isExpiringSoon ? "bg-yellow-100" : ""}`}
                >
                    <td className="px-6 py-4 text-sm text-gray-900 truncate flex items-center gap-2">
                        {isExpired && <AlertCircle className="text-red-600" size={18} />} {/* 🚨 Expired */}
                        {isExpiringToday && <Clock className="text-orange-600" size={18} />} {/* 🟠 Expires Today */}
                        {isExpiringSoon && !isExpiringToday && <AlertTriangle className="text-yellow-600" size={18} />} {/* ⚠️ Expiring Soon */}
                        {moa.File_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{moa.File_type}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(moa.Start).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(moa.End).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{moa.uploaded_by}</td>
                    <td className="px-6 py-4 text-sm font-medium flex space-x-2">
                        <a
                            href={route("moa.download", { file_name: moa.File_name, file_type: moa.File_type })}
                            className="text-green-600 hover:text-green-900"
                        >
                            <Download size={20} />
                        </a>
                        <button
                            onClick={() => handlePreview(moa.File_name)}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            <Eye size={20} />
                        </button>
                        <button
                            onClick={() => handleDelete(moa.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            <Trash2 size={20} />
                        </button>
                    </td>
                </tr>
            );
        })
    ) : (
        <tr>
            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No matching MOA files found.
            </td>
        </tr>
    )}
</tbody>


                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* PDF Preview Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-center flex-grow">PDF Preview</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                        <iframe src={previewUrl} className="w-full h-full border rounded-lg"></iframe>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
