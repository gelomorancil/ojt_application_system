import React, { useState } from "react";

export default function UploadFiles({ id }) {
  const [selectedCategory, setSelectedCategory] = useState("Pre-Deployment");
  const [files, setFiles] = useState({
    "Pre-Deployment": {
      "RESUME": null,
      "ENDORSEMENT LETTER": null,
      "APPLICATION LETTER": null,
      "PARENT'S/GUARDIAN CONSENT": null,
      "PARENT'S/GUARDIAN ID": null
    },
    "Deployment": {
      "INTERNSHIP PROGRAM COVER": null,
      "COMPANY PROFILE": null,
      "CERTIFICATE OF REGISTRATION": null,
      "INTERNSHIP UNDERTAKING": null,
      "INTERNSHIP INFORMATION SHEET": null,
      "DAILY TIME RECORD": null
    },
    "Final Requirements": {
      "INTERNSHIP SITE EVALUATION": null,
      "TRAINEE'S PERFORMANCE EVALUATION": null,
      "INTERNSHIP PORTFOLIO": null
    }
  });
  
  const [processing, setProcessing] = useState({
    "Pre-Deployment": false,
    "Deployment": false,
    "Final Requirements": false
  });

  const handleFileChange = (category, documentType, file) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [category]: {
        ...prevFiles[category],
        [documentType]: file
      }
    }));
  };

  const onSubmit = (category, e) => {
    e.preventDefault();
    
    // Update processing state for this category
    setProcessing(prev => ({
      ...prev,
      [category]: true
    }));
    
    // Create FormData
    const formData = new FormData();
    formData.append("Student_Num", id);
    formData.append("category", category);
    
    // Append only files from the selected category
    Object.entries(files[category]).forEach(([docType, file]) => {
      if (file) {
        formData.append(`files[${category}][${docType}]`, file);
      }
    });
    
    // Mock form submission since we don't have backend
    console.log(`Submitting files for ${category}:`, formData);
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(prev => ({
        ...prev,
        [category]: false
      }));
      alert(`Files for ${category} submitted successfully!`);
    }, 1500);
  };

  const categories = Object.keys(files);
  
  const renderFileList = (category) => {
    return (
      <div className="ml-4 space-y-2">
        {Object.entries(files[category]).map(([docType, file]) => (
          <div key={docType} className="flex items-center justify-between border-b border-gray-200 py-1">
            <div className="flex-1">
              <label className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-uslsgreen">
                <span className={`mr-2 ${file ? 'text-green-600' : 'text-gray-400'}`}>
                  {file ? '✓' : '○'}
                </span>
                {docType}
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(category, docType, e.target.files[0])}
                />
              </label>
            </div>
            <div className="text-gray-500 text-xs">
              {file && (
                <div className="flex items-center">
                  <span className="truncate max-w-xs">{file.name}</span>
                  <button 
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => handleFileChange(category, docType, null)}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Function to count uploaded files per category
  const getUploadedCount = (category) => {
    return Object.values(files[category]).filter(Boolean).length;
  };

  // Function to get total files per category
  const getTotalCount = (category) => {
    return Object.keys(files[category]).length;
  };

  return (
    <div className="max-w-full mx-auto space-y-4">
      <div className="space-y-6">
        {/* Category Selection */}
        <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
          <div className="flex mb-4 border-b pb-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`mr-4 py-1 px-3 rounded ${
                  selectedCategory === category
                    ? "bg-uslsgreen text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Render the selected category section */}
          <div className="bg-white rounded-md p-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-uslsgreen text-lg">{selectedCategory}</h3>
              <div className="text-sm text-gray-600">
                {getUploadedCount(selectedCategory)}/{getTotalCount(selectedCategory)} files uploaded
              </div>
            </div>
            
            {renderFileList(selectedCategory)}
            
            {/* Submit button for the current category */}
            <div className="text-right mt-4 pt-2 border-t border-gray-200">
              <form onSubmit={(e) => onSubmit(selectedCategory, e)}>
                <button
                  type="submit"
                  className="bg-uslsgreen text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
                  disabled={processing[selectedCategory] || getUploadedCount(selectedCategory) === 0}
                >
                  {processing[selectedCategory] 
                    ? `Submitting ${selectedCategory}...` 
                    : `Submit ${selectedCategory} Files`}
                </button>
              </form>
            </div>
          </div>
        </div>
        </div>
      </div>
  );
}