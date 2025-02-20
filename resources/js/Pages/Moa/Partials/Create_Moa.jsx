import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateMoa() {
    const { data, setData, post, processing, errors } = useForm({
        file: null,
        start: '',
        end: '',
    });

    const [minEndDate, setMinEndDate] = useState('');

    // Handle Start Date Change
    const handleStartDateChange = (e) => {
        const startDate = e.target.value;
        setData('start', startDate);
        setMinEndDate(startDate); // Restrict End Date selection
    };

    // Handle Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('moa.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Upload MOA</h2>}>
            <Head title="Upload MOA" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload PDF:</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setData('file', e.target.files[0])}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                        </div>

                        {/* Start Date Input */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Start Date:</label>
                            <input
                                type="date"
                                value={data.start}
                                onChange={handleStartDateChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
                        </div>

                        {/* End Date Input */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">End Date:</label>
                            <input
                                type="date"
                                value={data.end}
                                onChange={(e) => setData('end', e.target.value)}
                                min={minEndDate} // Prevent selecting an End Date earlier than Start Date
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
                                disabled={processing}
                            >
                                {processing ? 'Uploading...' : 'Upload MOA'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
