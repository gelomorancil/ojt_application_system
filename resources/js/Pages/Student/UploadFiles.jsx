import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const categories = ['Pre-Deployment', 'Deployment', 'DTR', 'Final Requirements'];

export default function UploadFiles({ id }) {
    const [filesByCategory, setFilesByCategory] = useState({});
    const [errors, setErrors] = useState({});

    const { post, processing, reset } = useForm();

    const handleFileChange = (e, category) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(
            (file) => file.type === "application/pdf" || file.type.startsWith("image/")
        );

        if (validFiles.length !== selectedFiles.length) {
            setErrors((prev) => ({
                ...prev,
                [category]: "Only PDF and image files are allowed.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, [category]: "" }));
        }

        const newFiles = validFiles.map((file) => ({
            file,
            uploadedAt: new Date().toLocaleString(),
        }));

        setFilesByCategory((prev) => ({
            ...prev,
            [category]: [...(prev[category] || []), ...newFiles],
        }));
    };

    const handleUpload = (category) => {
        console.log(category);
        const files = filesByCategory[category] || [];
    
        files.forEach((f) => {
            const formData = new FormData();
            formData.append("Student_Num", id);
            formData.append("category", category);
            formData.append("file_name", f.file);
    
            post(route("student-files.store"), formData, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                    setFilesByCategory((prev) => ({
                        ...prev,
                        [category]: prev[category].filter((x) => x.file.name !== f.file.name),
                    }));
                },
                onError: () => {
                    setErrors((prev) => ({
                        ...prev,
                        [category]: "Upload failed.",
                    }));
                },
                onFinish: () => reset(),
            });
        });
    };
    

    return (
        <div className="max-w-full mx-auto space-y-4">
            {categories.map((category) => (
                <div key={category} className="bg-white border border-uslscream rounded-md p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-uslsgreen text-m">{category}</h3>

                        <label className="text-m text-gray-700 cursor-pointer hover:underline">
                            + Add File
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileChange(e, category)}
                            />
                        </label>
                    </div>

                    {/* File List */}
                    {filesByCategory[category] && filesByCategory[category].length > 0 && (
                        <ul className="space-y-1 text-m text-gray-700">
                            {filesByCategory[category].map((f, index) => (
                                <li key={index} className="flex justify-between items-center border-b border-gray-200 py-1">
                                    <div className="flex-1 truncate">📄 {f.file.name}</div>
                                    <div className="text-gray-500 ml-2 whitespace-nowrap">
                                        {f.uploadedAt}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Error */}
                    {errors[category] && (
                        <p className="text-red-500 text-m">{errors[category]}</p>
                    )}

                    {/* Upload Button */}
                    <div className="text-right">
                        <button
                        type="file"
                        multiple
                            onClick={() => handleUpload(category)}
                            disabled={
                                !filesByCategory[category] || filesByCategory[category].length === 0 || processing
                            }
                            className="bg-uslsgreen text-white text-m px-3 py-1 rounded hover:bg-green-800 disabled:bg-gray-400"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
