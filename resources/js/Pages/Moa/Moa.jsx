import React, { useState, useRef } from "react";
import { router, usePage, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Download, Eye, Trash2, UploadCloud } from "lucide-react";

export default function Moa() {
    const { moas } = usePage().props;
    const [previewUrl, setPreviewUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        file: null,
        start: "",
        end: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.file) {
            alert("Please select a file before uploading.");
            return;
        }
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

    const handleFileDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            setData("file", file);
        }
    };

    const handleFileSelect = (e) => {
        setData("file", e.target.files[0]);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">MOA Management</h2>}
        >
            <Head title="MOA Management" />
            <div className="py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="grid grid-cols-4 gap-6">
                    {/* Upload MOA Form */}
                    <div className="col-span-1 bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">Upload New MOA</h3>
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current.click()}
                            >
                                {data.file ? (
                                    <p className="text-sm font-medium text-gray-700">{data.file.name}</p>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <UploadCloud size={40} className="text-gray-500 mb-2" />
                                        <p className="text-sm text-gray-600">Drag & drop or click to select a PDF</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>
                            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                                <input
                                    type="date"
                                    value={data.start}
                                    onChange={(e) => setData("start", e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                {errors.start && <p className="text-red-500 text-sm">{errors.start}</p>}
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
                                {errors.end && <p className="text-red-500 text-sm">{errors.end}</p>}
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
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {moas.map((moa) => (
                                        <tr key={moa.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 truncate">{moa.File_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(moa.Start).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(moa.End).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{moa.uploaded_by || "Unknown"}</td>
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
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h2 className="text-lg font-semibold">MOA Preview</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-900">
                                ✖
                            </button>
                        </div>
                        <div className="mt-4">
                            <iframe src={previewUrl} className="w-full h-[500px]" />
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
