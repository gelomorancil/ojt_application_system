import { useState, useEffect } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function EditStudent() {
    const { student } = usePage().props; // Inertia passed data
    const { data, setData, patch, errors, processing } = useForm({
        Course_ID: student.Course_ID || '',
        Fname: student.Fname || '',
        Lname: student.Lname || '',
        Student_Num: student.Student_Num || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('student.update', student.id), {
            onSuccess: () => {
                alert('Student updated successfully!');
                window.location.href = route('student'); // Redirect after successful update
            },
            onError: () => {
                alert('Failed to update student. Please check the errors.');
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Student</h2>}
        >
            <Head title="Edit Student" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Course ID</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Course_ID}
                                    onChange={(e) => setData('Course_ID', e.target.value)}
                                />
                                {errors.Course_ID && <p className="text-red-500">{errors.Course_ID}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Fname}
                                    onChange={(e) => setData('Fname', e.target.value)}
                                />
                                {errors.Fname && <p className="text-red-500">{errors.Fname}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Lname}
                                    onChange={(e) => setData('Lname', e.target.value)}
                                />
                                {errors.Lname && <p className="text-red-500">{errors.Lname}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Student Number</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Student_Num}
                                    onChange={(e) => setData('Student_Num', e.target.value)}
                                />
                                {errors.Student_Num && <p className="text-red-500">{errors.Student_Num}</p>}
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                disabled={processing}
                            >
                                Update Student
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
