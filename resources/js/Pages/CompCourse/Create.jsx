import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function CreateCompCourse({ companies, courses }) {
    const { data, setData, post, processing } = useForm({
        Comp_ID: '',
        Course_ID: '',
        Capacity: '',
        Mode: 'On-site',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('compcourse.store'));
    };
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Add Internship Opportunity</h2>}
        >
            <Head title="Add Internship Opportunity" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Company Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Company:</label>
                                <select 
                                    name="Comp_ID"
                                    value={data.Comp_ID} 
                                    onChange={(e) => setData('Comp_ID', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.id}>{company.Comp_name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Course Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course:</label>
                                <select 
                                    name="Course_ID"
                                    value={data.Course_ID} 
                                    onChange={(e) => setData('Course_ID', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="">Select Course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>{course.Course}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Capacity Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Capacity:</label>
                                <input 
                                    type="number"
                                    name="Capacity"
                                    value={data.Capacity} 
                                    onChange={(e) => setData('Capacity', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mode:</label>
                                <select 
                                    name="Mode"
                                    value={data.Mode} 
                                    onChange={(e) => setData('Mode', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="On-site">On-site</option>
                                    <option value="Blended">Blended</option>
                                    <option value="Work from Home">Work from Home</option>
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                {processing ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
