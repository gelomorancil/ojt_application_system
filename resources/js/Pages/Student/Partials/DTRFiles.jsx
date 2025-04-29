import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FaEye, FaSave, FaSpinner, FaTrash, FaCheckCircle } from 'react-icons/fa';

export default function DTRFiles({ id, dtr, auth }) {
  const isCoordinator = true;
  const user = auth?.user;

  const { data, setData, post, processing, reset, delete: destroy } = useForm({
    Student_Num: id,
    category: 'DTR',
    file_name: '',
    file: null,
    from_date: '',
    to_date: '',
  });

  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const latestDTR = dtr?.filter(f => f.category === 'DTR')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  const handleFileChange = (file) => {
    setData({
      ...data,
      file_name: file?.name || '',
      file: file || null,
    });
    if (file) {
      setFilePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('Student_Num', data.Student_Num);
    formData.append('category', 'DTR');
    formData.append('file_name', data.file_name);
    formData.append('file', data.file);
    formData.append('from_date', data.from_date);
    formData.append('to_date', data.to_date);

    post(route('student-files.store'), {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        setUploaded(true);
        reset('file_name', 'file', 'from_date', 'to_date');
        setFilePreviewUrl(null);
      },
    });
  };

  const handleDelete = (e, fileId) => {
    e.preventDefault();
    destroy(route('student-files.destroy', fileId), {
      onSuccess: () => {
        reset();
        setUploaded(false);
      },
    });
  };

  return (
    <div className="ml-4 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Date Range */}
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <input
              type="date"
              value={data.from_date}
              onChange={(e) => setData('from_date', e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ps-10"
              placeholder="Start date"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative w-full">
            <input
              type="date"
              value={data.to_date}
              onChange={(e) => setData('to_date', e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 ps-10"
              placeholder="End date"
            />
          </div>
        </div>

        {/* Upload Field */}
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-uslsgreen">
            <span className={`mr-2 ${data.file_name ? 'text-green-600' : 'text-gray-400'}`}>
              {data.file_name ? '✓' : '○'}
            </span>
            DAILY TIME RECORD
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </label>

          <div className="text-xs text-gray-600 flex items-center gap-2">
            {data.file_name ? (
              <>
                <span className="truncate max-w-xs">{data.file_name}</span>
                <button
                  type="submit"
                  title="Save DTR"
                  className="text-uslsgreen hover:text-green-800 text-lg"
                  disabled={!data.file || processing}
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
            ) : latestDTR ? (
              <>
                <span className="text-green-600">
                  {latestDTR.file_name.length > 10
                    ? `${latestDTR.file_name.slice(0, 10)}...`
                    : latestDTR.file_name}
                  <span className="text-gray-500 text-xs ml-1">
                    ({new Date(latestDTR.created_at).toLocaleString()})
                  </span>
                </span>
                <a
                  href={`/storage/uploads/${latestDTR.file_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-lg ml-2"
                  title="View File"
                >
                  <FaEye />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, latestDTR.id)}
                  className="text-red-600 hover:text-red-800 ml-2"
                  title="Delete DTR"
                >
                  <FaTrash />
                </button>
                {isCoordinator && (
                  <button
                    type="button"
                    onClick={() => post(route('student-files.verify', latestDTR.id))}
                    className="text-green-600 ml-2 cursor-pointer"
                    title="Verify File"
                  >
                    {latestDTR.verified ? <FaCheckCircle /> : '○'}
                  </button>
                )}
              </>
            ) : uploaded ? (
              <>
                <span className="text-green-600">Uploaded!</span>
                {filePreviewUrl && (
                  <a
                    href={filePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-2"
                  >
                    View
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
  );
}
