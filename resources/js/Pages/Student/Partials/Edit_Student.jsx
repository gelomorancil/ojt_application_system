import { useState, useEffect, useMemo } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export default function EditStudent({ courses = [], colleges = [] }) {
    const { student } = usePage().props; // Inertia passed data
    const { data, setData, patch, errors, processing } = useForm({
        College: student.College || '',
        Course: student.Course || '',
        Fname: student.Fname || '',
        Lname: student.Lname || '',
        Student_Num: student.Student_Num || '',
    });

    const filteredCourses = useMemo(() => {
        if (!data.College) return [];
        
        // Get courses for the selected college
        const collegeFilteredCourses = courses.filter(course => course.College === data.College);
        
        // Remove duplicates by creating a Map with course names as keys
        const uniqueCoursesMap = new Map();
        collegeFilteredCourses.forEach(course => {
            if (!uniqueCoursesMap.has(course.Course)) {
                uniqueCoursesMap.set(course.Course, course);
            }
        });
        
        // Convert Map values back to array
        return Array.from(uniqueCoursesMap.values());
    }, [data.College, courses]);

    // Ensure pre-selected course exists within filtered list
    useEffect(() => {
        if (filteredCourses.length > 0 && !filteredCourses.some(course => course.Course === data.Course)) {
            setData('Course', filteredCourses[0]?.Course || '');
        }
    }, [filteredCourses]);

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

    const handleCancel = () => {
        router.visit(route("student"));
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
                                <label className="block text-sm font-medium text-gray-700">College</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={data.College}
                                    onChange={(e) => setData('College', e.target.value)}
                                >
                                    <option value="">Select College</option>
                                    {colleges.map((college) => (
                                        <option key={college} value={college}>
                                            {college}
                                        </option>
                                    ))}
                                </select>
                                {errors.College && <p className="text-red-500">{errors.College}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Course</label>
                                <select
    className="w-full border rounded-lg p-2"
    value={data.Course}
    onChange={(e) => setData('Course', e.target.value)}
    disabled={!data.College || filteredCourses.length === 0}
>
    <option value="">Select Course</option>
    {filteredCourses.map((course) => (
        <option key={course.id} value={course.Course}>
            {course.Course}
        </option>
    ))}
</select>
                                {errors.Course && <p className="text-red-500">{errors.Course}</p>}
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

                            {/* Update Button */}
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Update
                                </button>

                            {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
