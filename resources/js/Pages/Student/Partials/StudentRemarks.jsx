import React, { useState } from "react";
import { router } from '@inertiajs/react';
import { format } from 'date-fns';

function StudentRemarks({ studentId, initialRemarks = "", remarksReadAt = null }) {
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [tempRemarks, setTempRemarks] = useState(initialRemarks || "");
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  
  const handleToggleRemarkInput = () => {
    setShowRemarkInput(!showRemarkInput);
    setTempRemarks(initialRemarks || "");
  };
  
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    // Auto-hide the notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };
  
  const handleSaveRemarks = () => {
    setIsSaving(true);
    router.post(route('student.update-remarks', { id: studentId }), {
      remarks: tempRemarks
    }, {
      preserveState: true,
      onSuccess: () => {
        setShowRemarkInput(false);
        setIsSaving(false);
        showNotification(initialRemarks ? "Remarks updated successfully" : "Remarks added successfully");
      },
      onError: () => {
        setIsSaving(false);
        showNotification("Failed to save remarks. Please try again.", "error");
      },
      onFinish: () => {
        setIsSaving(false);
      }
    });
  };

  // Check if remarksReadAt is a valid date and not the default empty value
  const hasReadRemarks = remarksReadAt && remarksReadAt !== '0000-00-00 00:00:00';
  
  // Format the read timestamp if it exists and is valid
  const formattedReadTime = hasReadRemarks 
    ? `Last read on ${format(new Date(remarksReadAt), 'MMM d, yyyy h:mm a')}`
    : 'The student has not yet viewed the remarks.';
  
  return (
    <div className="bg-white p-6 shadow rounded-lg relative">
      {/* Notification popup */}
      {notification.show && (
        <div className={`absolute top-2 right-2 px-4 py-2 rounded-lg text-white ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        }`}>
          {notification.message}
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="font-bold text-lg mr-3">Remarks</h3>
          <span className={`text-sm ${hasReadRemarks ? 'text-green-600' : 'text-gray-500'}`}>
            {formattedReadTime}
          </span>
        </div>
        {!showRemarkInput && (
          <button
            onClick={handleToggleRemarkInput}
            className="px-4 py-2 bg-uslsgreen text-white rounded-lg"
          >
            {initialRemarks ? "Update Remarks" : "Add Remarks"}
          </button>
        )}
      </div>
      {showRemarkInput ? (
        <div className="space-y-3">
          <textarea
            value={tempRemarks}
            onChange={(e) => setTempRemarks(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg h-32"
            placeholder="Enter remarks about this student..."
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleToggleRemarkInput}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRemarks}
              className="px-4 py-2 bg-uslsgreen text-white rounded-lg"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Remarks"}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg min-h-32">
          {initialRemarks ? (
            <div className="whitespace-pre-wrap">{initialRemarks}</div>
          ) : (
            <p className="text-gray-500 italic">No remarks added yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StudentRemarks;