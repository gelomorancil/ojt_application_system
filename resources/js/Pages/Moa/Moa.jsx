import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Eye, Trash2 } from 'lucide-react';

export default function Moa() {
    const { moas } = usePage().props;

    const [previewUrl, setPreviewUrl] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handlePreview = (fileName) => {
        const previewUrl = route('moa.preview', { file_name: fileName + '.pdf' });
        setPreviewUrl(previewUrl);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(route('moa.destroy', id), {
                onSuccess: () => alert('File deleted successfully!'),
            });
        }
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">MOA Files</h2>}>
            <Head title="MOA" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <a href={route('moa.create')} className="px-4 py-2 bg-blue-500 text-white rounded">
                            Upload New File
                        </a>
                        <table className="w-full mt-4 border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2 min-w-[200px]">File Name</th>
                                    <th className="border p-2">File Type</th>
                                    <th className="border p-2">Start Date</th>
                                    <th className="border p-2">End Date</th>
                                    <th className="border p-2">Uploaded By</th> {/* NEW COLUMN */}
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {moas.map(moa => (
                                    <tr key={moa.id} className="border">
                                        <td className="border p-2 min-w-[200px] truncate">{moa.File_name}</td>
                                        <td className="border p-2">{moa.File_type}</td>
                                        <td className="border p-2">{new Date(moa.Start).toLocaleDateString()}</td>
                                        <td className="border p-2">{new Date(moa.End).toLocaleDateString()}</td>
                                        <td className="border p-2">{moa.uploaded_by}</td> {/* DISPLAY UPLOADER */}
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
            </div>

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
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border rounded-lg"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
