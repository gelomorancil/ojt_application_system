import { Link } from '@inertiajs/react';
import React from 'react';

export default function CompanyList({ company_list, handleEdit, handleDelete }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto h-[650px]">
            <h3 className="mb-4 text-lg font-semibold">List of Companies</h3>
            <table className="min-w-full divide-y divide-gray-200 table-fixed align-top">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {company_list.map((items, index) => (
                        <tr key={items.id}>
                            <td className="align-top px-4 py-4">{index + 1}</td>
                            <td className="align-top px-4 py-4">
                                <Link href={`/companies/${items.id}/profile`}>
                                    {items.Comp_name}
                                </Link>
                            </td>
                            <td className="align-top px-4 py-4  max-w-[200px]">{items.Address}</td>
                            <td className="align-top px-4 py-4  max-w-[250px]">{items.Course}</td>
                            <td className="align-top px-4 py-4 flex gap-2">
                                <button onClick={() => handleEdit(items.id)} className="text-blue-500 hover:underline">Edit</button>
                                <button onClick={() => handleDelete(items.id)} className="text-red-500 hover:underline ml-2">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}