import { useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { FaEye, FaSave, FaSpinner, FaTrash, FaCheckCircle, FaUpload } from "react-icons/fa";

export default function PreDeploymentFiles({ id, preDeployment, auth, student_company, comp_id }) {
export default function PreDeploymentFiles({ id, preDeployment = [] }) {
  // TEMPORARY: Always treat the user as a coordinator for now
  const isCoordinator = true;

  const { auth } = usePage().props;
  const user = auth?.user;
  const isStudent = user?.role;

  const { data, setData, post, processing, reset, delete: destroy, patch } = useForm({
    Student_Num: id,
    Comp_ID:comp_id,
    category: "",
    file_name: "",
    file: null,
  });

  const [needsLetterOfIntent, setNeedsLetterOfIntent] = useState(() => {
    if (!preDeployment || preDeployment.length === 0) return false;
    const letterOfIntentFile = preDeployment.find(
      (file) => file.category === "LETTER OF INTENT"
    );
    return letterOfIntentFile?.needs_letter_of_intent === 1;
  });

  const categories = [
    "RESUME",
    "ENDORSEMENT LETTER",
    "APPLICATION LETTER",
    "PARENT'S/GUARDIAN CONSENT",
    "PARENT'S/GUARDIAN ID",
    ...(preDeployment.some(f => f.category === "LETTER OF INTENT") || needsLetterOfIntent ? ["LETTER OF INTENT"] : []),
  ];

  const [uploadedCategories, setUploadedCategories] = useState({});
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState({});

  const latestFiles = {};
  preDeployment.forEach((file) => {
    if (
      !latestFiles[file.category] ||
      new Date(file.created_at) > new Date(latestFiles[file.category].updated_at)
    ) {
      latestFiles[file.category] = file;
    }
  });

  const handleFileChange = (category, file) => {
    setData({
      ...data,
      file_name: file ? file.name : "",
      file: file || null,
      category: category,
      Comp_ID: comp_id,
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
    formData.append("Comp_ID", data.Comp_ID);
    formData.append("needs_letter_of_intent", needsLetterOfIntent ? true : false);

    post(route("student-files.store"), {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        setUploadedCategories((prev) => ({
          ...prev,
          [category]: true,
        }));
        setSubmittedFiles((prev) => ({
          ...prev,
          [category]: filePreviewUrl,
        }));
        reset("file_name", "file", "category");
        setFilePreviewUrl(null);
      },
    });
  };

  const handleDelete = (e, fileId) => {
    e.preventDefault();

    destroy(route('student-files.destroy', fileId), {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleVerify = (fileId) => {
    post(route('student-files.verify', fileId), {
      onSuccess: () => { },
    });
  };

  return (
    <div className="ml-4 space-y-4">
      <div className="mb-4">
        <label className="flex items-center text-sm text-gray-700">
          <input
            type="checkbox"
            checked={needsLetterOfIntent}
            onChange={(e) => setNeedsLetterOfIntent(e.target.checked)}
            className="mr-2"
          />
          I am an intern outside of the city (requires Letter of Intent)
        </label>
      </div>

      {categories.map((category) => (
        <div key={category} className="border-b border-gray-200 pb-4">
          <form onSubmit={(e) => handleSubmit(category, e)} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-uslsgreen">
                <span
                  className={`mr-2 ${data.file_name && data.category === category
                    ? "text-green-600"
                    : "text-gray-400"
                    }`}
                >
                  <a
                  className="text-uslsgreen hover:text-gray-700"
                  title="Upload File"
                  >
                  <FaUpload />
                  </a>
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
                    <span className="truncate max-w-xs">
                      {data.file_name.length > 10
                        ? `${data.file_name.slice(0, 10)}...`
                        : data.file_name}
                    </span>
                    <button
                      type="submit"
                      title={`Save ${category}`}
                      className="text-uslsgreen hover:text-green-800 text-lg"
                      disabled={!data.file || data.category !== category || processing}
                    >
                      {processing ? <FaSpinner className="animate-spin" /> : <FaSave />}
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
                ) : latestFiles[category] ? (
                  <>
                    <span className="text-green-600">
                      {latestFiles[category].file_name.length > 10
                        ? `${latestFiles[category].file_name.slice(0, 10)}...`
                        : latestFiles[category].file_name}
                      <span className="text-gray-500 text-xs"> ({new Date(latestFiles[category].updated_at).toLocaleString()})</span>
                    </span>
                    <a
                      href={`/storage/uploads/${latestFiles[category].file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 text-lg ml-2"
                      title="View File"
                    >
                      <FaEye />
                    </a>

                    {(isStudent != "student") && (
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, latestFiles[category].id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                      title={`Delete ${category}`}
                    >
                      <FaTrash />
                    </button>
                    )}

                    {isCoordinator && (
                      <button
                        type="button"
                        onClick={() => handleVerify(latestFiles[category].id)}
                        className="text-green-600 ml-2 cursor-pointer"
                        title="Verify File"
                      >
                        {latestFiles[category]?.verified === 1 || latestFiles[category]?.verified === true ? (
                          <FaCheckCircle />
                        ) : (
                          "○"
                        )}
                      </button>
                    )}
                  </>
                ) : uploadedCategories[category] ? (
                  <>
                    {submittedFiles[category] && (
                      <a
                        href={submittedFiles[category]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline ml-2"
                      >
                      </a>
                    )}
                  </>
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
