import React, { useState } from "react";

const categories = ['Pre-Deployment', 'Deployment', 'DTR', 'Final Requirement'];

export default function UploadFiles() {
    const [filesByCategory, setFilesByCategory] = useState({});
    const [errors, setErrors] = useState({});
    const [studentNum] = useState("2021-00001");

    const handleFileChange = (e, category) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => file.type === "application/pdf");

        if (validFiles.length !== selectedFiles.length) {
            setErrors(prev => ({ ...prev, [category]: "Only PDF files are allowed." }));
        } else {
            setErrors(prev => ({ ...prev, [category]: "" }));
        }

        const existingFiles = filesByCategory[category]?.map(f => f.file.name) || [];
        const newFiles = validFiles.filter(f => !existingFiles.includes(f.name));

        setFilesByCategory(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), ...newFiles.map(file => ({
                file,
                uploadedAt: new Date().toLocaleString(),
            }))]
        }));
    };

    const handleRemoveFile = (category, fileName) => {
        setFilesByCategory(prev => ({
            ...prev,
            [category]: prev[category].filter(f => f.file.name !== fileName)
        }));
    };

    const handleUpload = (category) => {
        const selectedFiles = filesByCategory[category] || [];

        selectedFiles.forEach((fileWrapper) => {
            const formData = new FormData();
            formData.append("file", fileWrapper.file);
            formData.append("Student_Num", studentNum);
            formData.append("category", category);

            fetch("/student-files", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    if (res.ok) {
                        setFilesByCategory(prev => ({
                            ...prev,
                            [category]: prev[category].filter(f => f.file.name !== fileWrapper.file.name)
                        }));
                    } else {
                        return res.json().then(data => {
                            throw new Error(data.message || "Upload failed.");
                        });
                    }
                })
                .catch((error) => {
                    setErrors(prev => ({
                        ...prev,
                        [category]: error.message,
                    }));
                });
        });
    };

    return (
        <div className="bg-white p-3 shadow rounded-md max-w-full mx-auto mt-4 space-y-3">
            <h2 className="text-base font-semibold text-gray-800">Upload Files</h2>

            {categories.map(category => (
                <div key={category} className="border rounded p-2 bg-gray-50 space-y-1">
                    <p className="text-sm font-medium text-gray-700">{category}</p>

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap w-full">
                            <label className="cursor-pointer bg-white border border-gray-300 px-2 py-1 rounded text-xs text-gray-700 hover:bg-gray-100">
                                📂 Choose PDF Files
                                <input
                                    type="file"
                                    multiple
                                    accept="application/pdf"
                                    onChange={(e) => handleFileChange(e, category)}
                                    className="hidden"
                                />
                            </label>

                            {filesByCategory[category] && filesByCategory[category].length > 0 && (
                                <ul className="text-xs text-gray-700 flex flex-col sm:flex-row gap-2 sm:items-center">
                                    {filesByCategory[category].map((f, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                            📄 {f.file.name}
                                            <button
                                                onClick={() => handleRemoveFile(category, f.file.name)}
                                                className="text-red-500 hover:text-red-700 text-xs"
                                            >
                                                ❌
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <button
                            onClick={() => handleUpload(category)}
                            disabled={!filesByCategory[category] || filesByCategory[category].length === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs disabled:bg-gray-300"
                        >
                            ⬆️ Upload
                        </button>
                    </div>

                    {errors[category] && (
                        <p className="text-red-500 text-xs">{errors[category]}</p>
                    )}
                </div>
            ))}
        </div>
    );
}
