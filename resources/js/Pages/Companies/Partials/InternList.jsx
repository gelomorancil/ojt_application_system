import React from 'react';

export default function InternList({ intern_list = [] }) {
    console.log(intern_list);
    // const { intern } = usePage().props;
    return (
        <table className="min-w-full divide-y divide-gray-200 table-fixed align-top mt-4">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Number</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">School Year</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {intern_list.length > 0 ? (
                    intern_list.map((intern, index) => (
                        <tr key={intern.id || index} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3">{intern.student?.Fname || 'N/A'}</td>
                            <td className="px-4 py-3">{intern.student?.Lname || 'N/A'}</td>
                            <td className="px-4 py-3">{intern.student?.Student_Num || 'N/A'}</td>
                            <td className="px-4 py-3">{intern.student?.course?.Course || 'N/A'}</td>
                            <td className="px-4 py-3">{intern.Sem || 'N/A'}</td>
                            <td className="px-4 py-3">{intern.student?.Year || 'N/A'}</td>
                            <td className="px-4 py-3">{intern.Status || 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="px-4 py-3 text-center text-gray-500">
                            No interns available.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
