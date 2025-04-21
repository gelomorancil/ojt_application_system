import { useForm, router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { FaSave, FaSpinner, FaTrash, FaEye } from "react-icons/fa";

export default function PreDeploymentFiles({ id, preDeployment }) {
  const { data, setData, post, processing, reset } = useForm({
    Student_Num: id,
    category: "",
    file_name: "",
    file: null,
  });

  const categories = [
    "RESUME",
    "ENDORSEMENT LETTER",
    "APPLICATION LETTER",
    "PARENT'S/GUARDIAN CONSENT",
    "PARENT'S/GUARDIAN ID",
  ];

  const [latestFiles, setLatestFiles] = useState({});
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);

  useEffect(() => {
    // Filter the latest file for each category
    const latest = {};
    preDeployment.forEach((file) => {
      if (
        !latest[file.category] ||
        new Date(file.created_at) > new Date(latest[file.category].created_at)
      ) {
        latest[file.category] = file;
      }
    });
    setLatestFiles(latest);
  }, [preDeployment]);

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

    const formData = new FormData();
    formData.append("Student_Num", data.Student_Num);
    formData.append("category", category);
    formData.append("file_name", data.file_name);
    formData.append("file", data.file);

    post(route("student-files.store"), {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        reset("file_name", "file", "category");
        setFilePreviewUrl(null);
        setTimeout(() => {
          window.location.reload(); // Refresh to see latest file and enable re-upload
        }, 500);
      },
    });
  };

  const handleDelete = (fileId) => {
    if (confirm("Are you sure you want to delete this file?")) {
      router.delete(route("student-files.destroy", fileId), {
        onSuccess: () => {
          setTimeout(() => {
            window.location.reload();
          }, 300);
        },
      });
    }
  };

  return (
    <div className="ml-4 space-y-4">
      {categories.map((category) => {
        const file = latestFiles[category];

        return (
          <div key={category} className="border-b border-gray-200 pb-4">
            <form onSubmit={(e) => handleSubmit(category, e)} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-uslsgreen">
                  <span
                    className={`mr-2 ${
                      data.file_name && data.category === category
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
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
                  {file ? (
                    <>
                      <span className="text-green-600 truncate max-w-xs">
                        {file.file_name}
                      </span>
                      <a
                        href={`/storage/uploads/${file.file_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                        title="View File"
                      >
                        <FaEye />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(file.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete File"
                      >
                        <FaTrash />
                      </button>
                    </>
                  ) : (
                    <>
                      {data.file_name && data.category === category ? (
                        <>
                          <span className="truncate max-w-xs">{data.file_name}</span>
                          <button
                            type="submit"
                            title={`Save ${category}`}
                            className="text-uslsgreen hover:text-green-800 text-lg"
                            disabled={
                              !data.file || data.category !== category || processing
                            }
                          >
                            {processing ? (
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
                      ) : (
                        <span className="text-gray-400">Not uploaded</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        );
      })}
    </div>
  );
}
