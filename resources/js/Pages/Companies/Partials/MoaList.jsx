import { useState } from "react";
import { Eye, Trash2 } from "lucide-react";

export default function MoaList({ moa_list = [], handleDelete }) {
    const [previewFile, setPreviewFile] = useState(null);

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto min-h-full">
            <h3 className="mb-4 text-lg font-semibold">MOA Files</h3>
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">File Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Start Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">End Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {moa_list.length > 0 ? (
                        moa_list.map((moa, index) => (
                            <tr key={moa.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4">{index + 1}</td>
                                <td className="px-4 py-4">{moa.File_name}</td>
                                <td className="px-4 py-4">{moa.Start}</td>
                                <td className="px-4 py-4">{moa.End}</td>
                                <td className="px-4 py-4 flex space-x-4">
                                    {/* Preview Button */}
                                        <button
                                            onClick={() => {
                                                if (moa.File) {
                                                    setPreviewFile(`/storage/${moa.File}`);
                                                } else {
                                                    alert("File not found!");
                                                }
                                            }}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <Eye size={20} />
                                        </button>


                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(moa.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                                No MOA files available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for PDF Preview */}
            {previewFile && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">MOA Preview</h2>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="text-red-500 text-lg"
                            >
                                &times;
                            </button>
                        </div>
                        <iframe src={previewFile} className="w-full h-[500px]"></iframe>
                    </div>
                </div>
            )}
        </div>
    );
}
