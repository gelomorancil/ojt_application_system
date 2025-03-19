import { useEffect, useState } from "react";

export default function MoaForm({ compId, data, setData, handleSubmit, editingMoa, resetForm, errors }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        if (editingMoa) {
            setData("Comp_ID", compId);
        }
    }, [editingMoa, compId, setData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file && file.type !== "application/pdf") {
            alert("Only PDF files are allowed!");
            e.target.value = "";
            return;
        }

        setData("file", file);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file)); // Create preview URL
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg w-full max-w-md m-4">
            <h3 className="mb-4 text-lg font-semibold">{editingMoa ? "Edit MOA" : "Upload MOA"}</h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-1 gap-4">
                {/* File Upload */}
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="border p-2 rounded" required={!editingMoa} />
                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}

                {/* Preview Button */}
                {previewUrl && (
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
                    >
                        Preview File
                    </button>
                )}

                {/* Start Date */}
                <input type="date" value={data.start || ""} onChange={(e) => setData("start", e.target.value)} className="border p-2 rounded" required />
                {errors.start && <p className="text-red-500 text-sm">{errors.start}</p>}

                {/* End Date */}
                <input type="date" value={data.end || ""} onChange={(e) => setData("end", e.target.value)} className="border p-2 rounded" required />
                {errors.end && <p className="text-red-500 text-sm">{errors.end}</p>}

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={data.processing}>
                    {editingMoa ? "Update MOA" : "Upload MOA"}
                </button>

                {/* Cancel Button */}
                {editingMoa && (
                    <button type="button" onClick={resetForm} className="w-full bg-gray-500 text-white py-2 rounded mt-2 hover:bg-gray-700">
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* Preview Modal */}
            {isPreviewOpen && previewUrl && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <h3 className="text-lg font-semibold mb-4">MOA Preview</h3>
                        <iframe src={previewUrl} className="w-full h-96" />
                        <button onClick={() => setIsPreviewOpen(false)} className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
