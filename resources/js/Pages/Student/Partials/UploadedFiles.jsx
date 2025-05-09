import React, { useEffect, useState } from "react";
import { FaEye, FaExclamationTriangle } from "react-icons/fa";

export default function UploadedFiles({ preDeployment, deployment, final, dtr }) {
  // State to track files with their validity status
  const [validatedFiles, setValidatedFiles] = useState({
    Student_Num: [],
    preDeployment: [],
    deployment: [],
    final: [],
    dtr: []
  });

  // Effect to validate files when component mounts or props change
  useEffect(() => {
    // Helper function to check if file exists
    const validateFiles = async (files) => {
      if (!files || !Array.isArray(files)) return [];
      
      const validatedList = await Promise.all(files.map(async (file) => {
        try {
          // Try to fetch the file to see if it exists
          const response = await fetch(`/storage/uploads/${file.file_name}`, { method: 'HEAD' });
          return {
            ...file,
            exists: response.ok
          };
        } catch (error) {
          console.error(`Error checking file ${file.file_name}:`, error);
          return {
            ...file,
            exists: false
          };
        }
      }));
      
      // Filter out files that don't exist
      return validatedList.filter(file => file.exists);
    };

    // Validate all file groups
    const updateAllFiles = async () => {
      const validPreDeployment = await validateFiles(preDeployment);
      const validDeployment = await validateFiles(deployment);
      const validFinal = await validateFiles(final);
      const validDtr = await validateFiles(dtr);

      setValidatedFiles({
        preDeployment: validPreDeployment,
        deployment: validDeployment,
        final: validFinal,
        dtr: validDtr
      });
    };

    updateAllFiles();
  }, [preDeployment, deployment, final, dtr]);

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
      {renderFileGroup("Pre-Deployment", validatedFiles.preDeployment)}
      {renderFileGroup("Deployment", validatedFiles.deployment)}
      {renderFileGroup("Final Requirements", validatedFiles.final)}
      {renderFileGroup("Daily Time Record", validatedFiles.dtr)}
    </div>
  );
}
