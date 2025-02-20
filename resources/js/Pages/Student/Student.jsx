import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';

export default function Student({ students = [] }) {
    console.log("Students Data:", students);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this student?')) {
            axios.delete(`/student/${id}`)
                .then((response) => {
                    alert('Student deleted successfully!');
                    window.location.reload(); // Refresh the page after deletion
                })
                .catch((error) => {
                    console.error('There was an error deleting the student:', error.response || error);
                    alert(error.response?.data?.message || 'Error deleting student.'); // Improved error handling
                });
        }
    };


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Student
                </h2>
            }
        >
            <Head title="Student" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Student List</h3>
                                <Link
                                    href={route('student.create')}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    + Add Student
                                </Link>
                            </div>

                            <table className="min-w-full border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="px-4 py-2 border">Course ID</th>
                                        <th className="px-4 py-2 border">First Name</th>
                                        <th className="px-4 py-2 border">Last Name</th>
                                        <th className="px-4 py-2 border">Student Number</th>
                                        <th className="px-4 py-2 border">Actions</th> {/* Actions Column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length > 0 ? (
                                        students.map((student) => (
                                            <tr key={student.id} className="border">
                                                <td className="px-4 py-2 border text-center">{student.Course_ID}</td>
                                                <td className="px-4 py-2 border text-center">{student.Fname}</td>
                                                <td className="px-4 py-2 border text-center">{student.Lname}</td>
                                                <td className="px-4 py-2 border text-center">{student.Student_Num}</td>
                                                <td className="px-4 py-2 border text-center">
                                                    {/* Edit and Delete Buttons */}
                                                    <Link
                                                        href={route('student.edit', student.id)}
                                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(student.id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4">No students found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
