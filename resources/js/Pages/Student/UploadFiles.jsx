import React, { useState } from "react";

const categories = ['Pre-Deployment', 'Deployment', 'DTR', 'Final Requirement'];

export default function UploadFiles() {
    const [filesByCategory, setFilesByCategory] = useState({});
    const [errors, setErrors] = useState({});
    const [studentNum, setStudentNum] = useState("2021-00001"); // Replace this with actual student number dynamically if needed

    const handleFileChange = (e, category) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => file.type === "application/pdf");

        if (validFiles.length !== selectedFiles.length) {
            setErrors(prev => ({ ...prev, [category]: "Only PDF files are allowed." }));
        } else {
            setErrors(prev => ({ ...prev, [category]: "" }));
        }

        setFilesByCategory(prev => ({
            ...prev,
            [category]: [...(prev[category] || []), ...validFiles.map(file => ({
                file,
                uploadedAt: new Date().toLocaleString(),
            }))]
        }));
    };

    const handleUpload = (category) => {
        const selectedFiles = filesByCategory[category] || [];

        selectedFiles.forEach((fileWrapper) => {
            const formData = new FormData();
            formData.append("file", fileWrapper.file);
            formData.append("Student_Num", studentNum); // Replace dynamically if needed
            formData.append("category", category);

            fetch("/student-files", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    if (res.ok) {
                        console.log(`${fileWrapper.file.name} uploaded to ${category}`);
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
        <div className="bg-white p-6 shadow rounded-lg mt-6 space-y-6">
            <h2 className="text-lg font-semibold">Upload Files</h2>

            {categories.map(category => (
                <div key={category}>
                    <p className="text-gray-700 font-medium">{category} Files</p>
                    <input
                        type="file"
                        multiple
                        accept="application/pdf"
                        onChange={(e) => handleFileChange(e, category)}
                        className="mt-2 border p-2 w-full"
                    />
                    {errors[category] && (
                        <p className="text-red-500 text-sm mt-2">{errors[category]}</p>
                    )}

                    {filesByCategory[category] && filesByCategory[category].length > 0 && (
                        <ul className="text-sm text-green-600 mt-2 space-y-1">
                            {filesByCategory[category].map((f, i) => (
                                <li key={i}>
                                    📄 {f.file.name} <span className="text-gray-400">({f.uploadedAt})</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        onClick={() => handleUpload(category)}
                        disabled={!filesByCategory[category] || filesByCategory[category].length === 0}
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        Upload to {category}
                    </button>
                </div>
            ))}
        </div>
    );
}
