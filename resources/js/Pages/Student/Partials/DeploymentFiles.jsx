import { useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { FaSave, FaSpinner } from "react-icons/fa";

export default function DeploymentFiles({ id }) {
    const { data, setData, post, processing, reset } = useForm({
        Student_Num: id,
        category: "",
        file_name: "",
        file: null,
    });

    const categories = [
        "INTERNSHIP PROGRAM COVER",
        "COMPANY PROFILE",
        "CERTIFICATE OF REGISTRATION",
        "INTERNSHIP UNDERTAKING",
        "INTERNSHIP INFORMATION SHEET",
        "DAILY TIME RECORD",
    ];

    const [uploadedCategories, setUploadedCategories] = useState({});
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);
    const [processingCategory, setProcessingCategory] = useState(null); // ← NEW

    const handleFileChange = (category, file) => {
        setData({
            ...data,
            file_name: file ? file.name : "",
            file: file || null,
            category: category,
        });

        if (file) {
            setFilePreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (category, e) => {
        e.preventDefault();
        setProcessingCategory(category); // ← Mark this category as processing

        const formData = new FormData();
        formData.append("Student_Num", data.Student_Num);
        formData.append("category", category);
        formData.append("file_name", data.file_name);
        formData.append("file", data.file);

        post(route("student-files.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setUploadedCategories((prev) => ({
                    ...prev,
                    [category]: true,
                }));
                reset("file_name", "file", "category");
                setFilePreviewUrl(null);
                setProcessingCategory(null); // ← Reset
            },
            onFinish: () => {
                setProcessingCategory(null); // ← Ensure reset
            },
        });
    };

    return (
        <div className="ml-4 space-y-4">
            {categories.map((category) => (
                <div key={category} className="border-b border-gray-200 pb-4">
                    <form onSubmit={(e) => handleSubmit(category, e)} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-uslsgreen">
                                <span className={`mr-2 ${data.file_name && data.category === category ? "text-green-600" : "text-gray-400"}`}>
                                    {data.file_name && data.category === category ? "✓" : "○"}
                                </span>
                                {category}
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(category, e.target.files[0])}
                                />
                            </label>

                            <div className="text-xs text-gray-600 flex items-center gap-2">
                                {data.file_name && data.category === category ? (
                                    <>
                                        <span className="truncate max-w-xs">{data.file_name}</span>
                                        <button
                                            type="submit"
                                            title={`Save ${category}`}
                                            className="text-uslsgreen hover:text-green-800 text-lg"
                                            disabled={
                                                !data.file ||
                                                data.category !== category ||
                                                processingCategory === category
                                            }
                                        >
                                            {processingCategory === category ? (
                                                <FaSpinner className="animate-spin" />
                                            ) : (
                                                <FaSave />
                                            )}
                                        </button>

                                        {filePreviewUrl && (
                                            <a
                                                href={filePreviewUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline ml-2"
                                            >
                                                Preview
                                            </a>
                                        )}
                                    </>
                                ) : uploadedCategories[category] ? (
                                    <span className="text-green-600">Uploaded!</span>
                                ) : (
                                    <span className="text-gray-400">Not uploaded</span>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            ))}
        </div>
    );
}
