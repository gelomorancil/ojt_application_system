import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';

export default function Moa() {
    const { moas } = usePage().props;

    // Form Handling for File Upload
    const { data, setData, post, processing, errors } = useForm({
        file: null,
        start: '',
        end: '',
    });

    const [minEndDate, setMinEndDate] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [showModal, setShowModal] = useState(false);

    // Handle Start Date Change
    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setData('start', startDate);
        setMinEndDate(startDate); // Restrict End Date selection
    };

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('moa.store'));
    };

    // Handle PDF Preview
    const handlePreview = (fileName) => {
        const previewUrl = route('moa.preview', { file_name: fileName + '.pdf' });
        setPreviewUrl(previewUrl);
        setShowModal(true);
    };

    // Handle File Deletion
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('moa.destroy', id), {
                onSuccess: () => alert('File deleted successfully!'),
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">MOA Management</h2>}>
            <Head title="MOA Management" />

            <div className="py-12 max-w-7xl mx-auto flex gap-6">

                {/* 📂 UPLOAD MOA FORM */}
                <div className="w-1/4 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold mb-4">Upload New MOA</h3>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload PDF:</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                        </div>

                        {/* Start Date Input */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                            <input
                                type="date"
                                value={data.start}
                                onChange={handleStartDateChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
                        </div>

                        {/* End Date Input */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">End Date:</label>
                            <input
                                type="date"
                                value={data.end}
                                onChange={(e) => setData('end', e.target.value)}
                                min={minEndDate} // Prevent selecting an End Date earlier than Start Date
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                                disabled={processing}
                            >
                                {processing ? 'Uploading...' : 'Upload MOA'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* 📜 MOA FILE LIST */}
                <div className="w-3/4 bg-white shadow-sm sm:rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">MOA Files</h3>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 min-w-[200px]">File Name</th>
                                <th className="border p-2">File Type</th>
                                <th className="border p-2">Start Date</th>
                                <th className="border p-2">End Date</th>
                                <th className="border p-2">Uploaded By</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {moas.map((moa) => (
                                <tr key={moa.id} className="border">
                                    <td className="border p-2 min-w-[200px] truncate">{moa.File_name}</td>
                                    <td className="border p-2">{moa.File_type}</td>
                                    <td className="border p-2">{new Date(moa.Start).toLocaleDateString()}</td>
                                    <td className="border p-2">{new Date(moa.End).toLocaleDateString()}</td>
                                    <td className="border p-2">{moa.uploaded_by}</td>
                                    <td className="border p-2 flex gap-2">
                                        <a
                                            href={route('moa.download', { file_name: moa.File_name, file_type: moa.File_type })}
                                            className="px-3 py-1 bg-green-500 text-white rounded"
                                        >
                                            <Download size={20} />
                                        </a>
                                        <button
                                            onClick={() => handlePreview(moa.File_name)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded"
                                        >
                                            <Eye size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(moa.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded"
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

            {/* 🔍 PDF PREVIEW MODAL */}
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
                        <div className="flex-grow">
                            <iframe src={previewUrl} className="w-full h-full border rounded-lg"></iframe>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
