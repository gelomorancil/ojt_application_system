import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Download, Trash2, FileText, X } from 'lucide-react'; // Import icons

const Forms = () => {
  const { forms: initialForms, auth } = usePage().props;
  const [selectedCollege, setSelectedCollege] = useState('1');
  const [selectedFilterCollege, setSelectedFilterCollege] = useState('1'); // New state for filter
  const [forms, setForms] = useState(initialForms || []);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    file: null,
    label: ''
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
    const user = auth?.user;
    const isStudent = user?.role;
  
  // Preview modal state
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewFormData, setPreviewFormData] = useState(null);
  
  const colleges = [
    { id: 1, name: 'CECS', fullName: 'College of Engineering and Computer Science' },
    { id: 2, name: 'CBA', fullName: 'College of Business Administration' },
    { id: 3, name: 'CAS', fullName: 'College of Arts and Sciences' },
    { id: 4, name: 'CE', fullName: 'College of Education' },
    { id: 5, name: 'CON', fullName: 'College of Nursing' }
  ];

  // Grouped form categories
  const formCategories = {
    'Pre-deployment': [
      'RESUME', 
      'ENDORSEMENT LETTER', 
      'APPLICATION LETTER', 
      'PARENT CONSENT', 
      'PARENTS ID', 
      'LETTER OF INTENT'
    ],
    'Deployment': [
      'INTERNSHIP PROGRAM COVER', 
      'COMPANY PROFILE', 
      'CERTIFICATE OF REGISTRATION', 
      'INTERNSHIP UNDERTAKING', 
      'INTERNSHIP INFORMATION SHEET', 
      'DTR'
    ],
    'Final requirements': [
      'FINAL JOURNAL',
      'INTERNSHIP PORTFOLIO', 
      'INTERNSHIP SITE EVALUATION', 
      'TRAINEE\'S PERFORMANCE EVALUATION'
    ]
  };

  // Load forms when component mounts
  useEffect(() => {
    loadForms();
  }, []);

  // Load forms when filter changes
  useEffect(() => {
    loadForms();
  }, [selectedFilterCollege]);
  
  const loadForms = async () => {
    try {
      setLoading(true);
      // Explicitly pass the college ID as a URL parameter
      const response = await fetch(`/api/forms/${selectedFilterCollege}`);
      
      if (!response.ok) {
        throw new Error('Failed to load forms');
      }
      
      const data = await response.json();
      setForms(data.forms || []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading forms:', error);
      setLoading(false);
    }
  };
  
  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
  };

  const handleFilterCollegeChange = (e) => {
    setSelectedFilterCollege(e.target.value);
  };
  
  const handleFormChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    setSuccessMessage('');
    
    // Create form data for file upload
    const formDataForUpload = new FormData();
    formDataForUpload.append('college_id', selectedCollege);
    formDataForUpload.append('label', formData.label);
    formDataForUpload.append('file', formData.file);
    
    try {
      const response = await fetch(route('api.forms.upload'), {
        method: 'POST',
        body: formDataForUpload,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setErrors(data.errors || { general: ['An error occurred during upload'] });
        setProcessing(false);
        return;
      }
      
      // Success
      setSuccessMessage('Form uploaded successfully');
      setFormData({
        label: '',
        file: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Reload forms if we're currently viewing the college we just uploaded to
      if (selectedCollege === selectedFilterCollege) {
        loadForms();
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ general: ['Network error occurred. Please try again.'] });
    }
    
    setProcessing(false);
  };
  
  const handleDownload = (formId) => {
    window.location.href = route('api.forms.download', { id: formId });
  };
  
  const handleDelete = async (formId) => {
    if (!confirm('Are you sure you want to delete this form?')) {
      return;
    }
    
    try {
      const response = await fetch(route('api.forms.delete', { id: formId }), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete form');
      }
      
      // Success - reload forms
      loadForms();
      setSuccessMessage('Form deleted successfully');
      
    } catch (error) {
      console.error('Delete error:', error);
      setErrors({ general: ['Error deleting form. Please try again.'] });
    }
  };

  // Group forms by category
  const groupFormsByCategory = () => {
    const result = {};
    
    Object.keys(formCategories).forEach(category => {
      result[category] = forms.filter(form => 
        formCategories[category].some(cat => 
          form.Label.toLowerCase().includes(cat.toLowerCase())
        )
      );
    });
    
    // Add any forms that don't match predefined categories to an "Other" category
    const otherForms = forms.filter(form => 
      !Object.values(formCategories).flat().some(cat => 
        form.Label.toLowerCase().includes(cat.toLowerCase())
      )
    );
    
    if (otherForms.length > 0) {
      result['Other'] = otherForms;
    }
    
    return result;
  };

  // File preview function - opens modal with preview
  const handlePreview = (form) => {
    setPreviewFormData(form);
    setPreviewModalOpen(true);
  };

  // Close preview modal
  const closePreviewModal = () => {
    setPreviewModalOpen(false);
    setPreviewFormData(null);
  };

  // Get file extension from filename
  const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
  };

  // Find current college name for display
  const getCurrentCollegeName = (id) => {
    const college = colleges.find(c => c.id === parseInt(id));
    return college ? `${college.name} - ${college.fullName}` : 'Unknown College';
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Downloadable Forms" />
      
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Downloadable Forms</h1>
        
        {/* Error messages */}
        {errors && Object.keys(errors).length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {Object.entries(errors).map(([key, errorArray]) => (
              Array.isArray(errorArray) ? errorArray.map((error, index) => (
                <p key={`${key}-${index}`}>{error}</p>
              )) : <p key={key}>{errorArray}</p>
            ))}
          </div>
        )}
        
        {/* Success message */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {successMessage}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
        {/* Upload Form Box - Only shown for non-students */}
        {isStudent != "student" && (
          <div className="bg-gray-100 p-4 rounded-lg mb-6 md:mb-0 md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Upload New Template</h2>
            <form onSubmit={handleUpload}>
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Select College:</label>
                <select
                  className="shadow border rounded py-2 px-3 text-gray-700 w-full"
                  value={selectedCollege}
                  onChange={handleCollegeChange}
                >
                  {colleges.map(college => (
                    <option key={college.id} value={college.id}>
                      {college.name} - {college.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Form Label:</label>
                <input
                  type="text"
                  name="label"
                  className="shadow border rounded py-2 px-3 text-gray-700 w-full"
                  value={formData.label}
                  onChange={handleFormChange}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">File:</label>
                <input
                  type="file"
                  name="file"
                  className="w-full"
                  onChange={handleFormChange}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  Allowed file types: PDF, DOC, DOCX, XLS, XLSX
                </p>
              </div>
              
              <button
                type="submit"
                disabled={processing}
                className="bg-uslsgreen text-white font-bold py-2 px-4 rounded"
              >
                {processing ? 'Uploading...' : 'Upload Template'}
              </button>
            </form>
          </div>
        )}
        
        {/* Available Templates Box - Full width for students, 2/3 width for non-students */}
        <div className={isStudent == "student" ? "w-full" : "md:w-2/3"}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Uploaded Templates</h2>
            
            {/* College Filter Dropdown */}
            <div className="flex items-center mt-2 md:mt-0">
              <label className="mr-2 text-gray-700 font-medium">Filter by College:</label>
              <select
                className="shadow border rounded py-2 px-3 text-gray-700"
                value={selectedFilterCollege}
                onChange={handleFilterCollegeChange}
              >
                {colleges.map(college => (
                  <option key={college.id} value={college.id}>
                    {college.name} - {college.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Display current selected college */}
          <div className="bg-gray-50 p-3 mb-4 rounded-lg border border-gray-200">
            <p className="text-black-700">
              <span className="font-medium">Showing forms for:</span> {getCurrentCollegeName(selectedFilterCollege)}
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-uslsgreen"></div>
            </div>
          ) : forms.length === 0 ? (
            <div className="bg-gray-50 p-10 text-center rounded-lg">
              <p className="text-gray-500">No templates available for this college.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(groupFormsByCategory()).map(([category, categoryForms]) => (
                categoryForms.length > 0 && (
                  <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-uslsgreen text-white p-3">
                      <h3 className="text-lg font-semibold">{category}</h3>
                    </div>
                    
                    <div className="p-4">
                      <ul className="space-y-3">
                        {categoryForms.map(form => (
                          <li key={form.id} className="border-b pb-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-800 font-medium">{form.Label}</span>
                              <div className="flex items-center space-x-2">
                                {/* Preview Icon */}
                                <button
                                  onClick={() => handlePreview(form)}
                                  className="text-blue-500 hover:text-blue-700"
                                  title="Preview"
                                >
                                  <FileText size={16} />
                                </button>
                                
                                {/* Download Icon */}
                                <button
                                  onClick={() => handleDownload(form.id)}
                                  className="text-gray-600 hover:text-gray-800"
                                  title="Download"
                                >
                                  <Download size={16} />
                                </button>
                                
                                {/* Delete Icon - Only shown for non-students */}
                                {isStudent != "student" && (
                                  <button
                                    onClick={() => handleDelete(form.id)}
                                    className="text-red-600 hover:text-red-800"
                                    title="Delete"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Preview Modal */}
      {previewModalOpen && previewFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-full max-h-screen md:h-4/5 flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-uslsgreen text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Preview: {previewFormData.Label}</h3>
                <button 
                onClick={closePreviewModal}
                className="text-white hover:text-gray-200"
                >
                <X size={20} />
                </button>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-4">
                {/* Check file type and handle preview appropriately */}
                {previewFormData.Filename && getFileExtension(previewFormData.Filename) === 'pdf' ? (
                <iframe
                    src={route('api.forms.download', { id: previewFormData.id }) + '?preview=true'}
                    className="w-full h-full border-0"
                    title={`Preview of ${previewFormData.Label}`}
                />
                ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <FileText size={64} className="text-gray-400 mb-4" />
                    <p className="text-xl font-medium mb-2">Preview not available</p>
                    <p className="text-gray-600 mb-6">This file type cannot be previewed directly in the browser.</p>
                    <button
                    onClick={() => handleDownload(previewFormData.id)}
                    className="bg-uslsgreen text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                    <Download size={18} className="mr-2" /> Download to view
                    </button>
                </div>
                )}
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-100 p-4 flex justify-end">
                <button
                onClick={closePreviewModal}
                className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2"
                >
                Close
                </button>
                <button
                onClick={() => handleDownload(previewFormData.id)}
                className="bg-uslsgreen text-white font-bold py-2 px-4 rounded"
                >
                Download
                </button>
            </div>
            </div>
        </div>
        )}
    </AuthenticatedLayout>
  );
};

export default Forms;