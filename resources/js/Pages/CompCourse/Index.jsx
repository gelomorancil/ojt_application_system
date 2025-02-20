import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function CompCourse({ CompCourses }) {
    console.log(CompCourse);
    return (
        <AuthenticatedLayout
            header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800 flex justify-between">
                Internship Opportunities
                <Link
                    href={route('compcourse.create')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    + Add New
                </Link>
            </h2>}
        >
            <Head title="Internship Opportunities" />

                {/* Internship Opportunities Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 mt-4">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Company</th>
                                <th className="border border-gray-300 px-4 py-2">Course</th>
                                <th className="border border-gray-300 px-4 py-2">Capacity</th>
                                <th className="border border-gray-300 px-4 py-2">Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CompCourses.length > 0 ? (
                                CompCourses.map((cc) => (
                                    <tr key={cc.id} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">
                                        <Link 
                                            href={route('company.contacts', cc.company?.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {cc.company?.Comp_name}
                                        </Link>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {cc.course?.Course}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {cc.Capacity}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {cc.Mode}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4">
                                        No internship opportunities available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </AuthenticatedLayout>
    );
}
