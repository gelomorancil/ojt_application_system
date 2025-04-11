import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const categories = [
    "Pre-Deployment",
    "Deployment",
    "DTR",
    "Final Requirements",
];

export default function UploadFiles({ id }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        Student_Num: id,
        category: "Pre-Deployment",
        file_name: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Student_Num", id);
        formData.append("category", category);
        if (data.file_name) {
            formData.append("file_name", data.file_name);
        }

        post(route("student-files.store"), {
            onFinish: () => reset(),
            data: formData,
        });
    };

    return (
        <div className="max-w-full mx-auto space-y-4">
            <form onSubmit={onSubmit}>
                <div className="bg-white border border-uslscream rounded-md p-4 shadow-sm space-y-2">
                    <h3 className="font-semibold text-uslsgreen text-m">Pre-Deployment</h3>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            className="hidden"
                            value="Pre-Deployment"
                            name="category"
                            id="category"
                            onChange={(e) => setData("category", e.target.value)}
                        />
                        
                        <label className="text-m text-gray-700 cursor-pointer hover:underline">
                            + Add File
                            <input
                                type="file"
                                id="file_name"
                                name="file_name"
                                className="hidden"
                                onChange={(e) => setData("file_name", e.target.files[0])}
                            />
                             {/* <input
                    type="file"
                    placeholder="file_name"
                    id="file_name"
                    name="file_name"
                    // onChange={(e) =>setData("file_name", e.target.files[0])}
                    // onChange={(e) => setData("file_name", e.target.files[0])}
                    onChange={(e) =>
                        setData("file_name", e.target.files[0])
                    }
                /> */}
                        </label>
                    </div>
                    <ul className="space-y-1 text-m text-gray-700">
                        {/* Check if file_name exists before trying to display */}
                        {data.file_name && (
                            <li className="flex justify-between items-center border-b border-gray-200 py-1">
                                <div className="flex-1 truncate">
                                    📄 {data.file_name.name}
                                </div>
                                <div className="text-gray-500 ml-2 whitespace-nowrap"></div>
                            </li>
                        )}
                    </ul>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-uslsgreen text-white text-m px-3 py-1 rounded hover:bg-green-800 disabled:bg-gray-400"
                            disabled={processing}
                        >
                            {processing ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}