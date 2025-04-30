import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FaEye, FaSave, FaSpinner, FaTrash, FaCheckCircle } from 'react-icons/fa';

export default function DTRFiles({ id, dtr, auth }) {

  console.log(dtr)
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
        // reset('file_name', 'file', 'from_date', 'to_date');
        reset();
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
              name='from_date'
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
              name='to_date'
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
                {/* <span className="text-green-600">
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
                )} */}
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
      {/* Upload History */}
      {dtr?.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-m font-semibold text-gray-700 mb-2">Upload History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300 rounded">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs border-b">
                <tr>
                  <th scope="col" className="px-4 py-2">DTR Coverage</th>
                  <th scope="col" className="px-4 py-2">Date Uploaded</th>
                  <th scope="col" className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dtr
                  .filter(f => {
                    if (f.category !== 'DTR') return false;
                    const created = new Date(f.created_at);
                    // const from = data.from_date ? new Date(data.from_date) : null;
                    // const to = data.to_date ? new Date(data.to_date) : null;
                    // if (from && created < from) return false;
                    // if (to && created > to) return false;
                    return true;
                  })
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // ASCENDING ORDER
                  .map(file => (
                    <tr key={file.id} className="border-t">
                      <td className="px-4 py-2">
                        {file.from_date && file.to_date ? (
                          <>
                            {new Date(file.from_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} to {new Date(file.to_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </>
                        ) : (
                          "No date coverage"
                        )}
                      </td>
    
                      <td className="px-4 py-2">
                      {new Date(file.created_at).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})} at {new Date(file.created_at).toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2">
                        <a
                          href={`/storage/uploads/${file.file_name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700"
                          title="View"
                        >
                          <FaEye />
                        </a>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, file.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        {isCoordinator && (
                          <button
                            type="button"
                            onClick={() => post(route('student-files.verify', file.id))}
                            className="text-green-600"
                            title="Verify"
                          >
                            {file.verified ? <FaCheckCircle /> : '○'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
