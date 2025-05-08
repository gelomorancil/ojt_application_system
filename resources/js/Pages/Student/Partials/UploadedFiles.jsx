import React from "react";
import { FaEye } from "react-icons/fa";

export default function UploadedFiles({ preDeployment, deployment, final, dtr }) {

  const renderFileGroup = (title, files) => (
    <div className="mb-8">
      <h4 className="text-lg font-semibold text-uslsgreen border-b pb-2 mb-3">{title}</h4>
      {files.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No files uploaded.</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200"
            >
              <div className="text-sm text-gray-700">
                <div className="font-medium">{file.category}</div>
                <div className="text-xs text-gray-500">{file.file_name}</div>
              </div>
              <a
                href={`/storage/uploads/${file.file_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-lg"
                title="View File"
              >
                <FaEye />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 px-4 py-2">
      {renderFileGroup("Pre-Deployment", preDeployment)}
      {renderFileGroup("Deployment", deployment)}
      {renderFileGroup("Final Requirements", final)}
      {renderFileGroup("Daily Time Record", dtr)}
    </div>
  );
}