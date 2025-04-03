import React, { useState } from "react";

function UploadFiles() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type === "application/pdf") {
                setSelectedFile(file);
                setError("");
            } else {
                setError("Only PDF files are allowed.");
                setSelectedFile(null);
            }
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log("Uploading:", selectedFile.name);
            // Add file upload logic here
        }
    };

    return (
        <div className="col-span-1 bg-white p-6 shadow rounded-lg">
            <h2 className="text-lg font-semibold">Upload Files</h2>
            <p className="text-gray-500">Upload OJT-related documents here.</p>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mt-4 border p-2 w-full"
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {selectedFile && (
                <p className="text-green-500 text-sm mt-2">Selected: {selectedFile.name}</p>
            )}
            <button
                onClick={handleUpload}
                disabled={!selectedFile}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
            >
                Upload
            </button>
        </div>
    );
}

export default UploadFiles;
