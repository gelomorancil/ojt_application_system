import { Link, usePage } from '@inertiajs/react'; // 👈 Import usePage to access user role
import React, { useState, useMemo } from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

export default function CompanyList({ company_list, handleEdit, handleDelete }) {
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Extract unique provinces
    const provinces = useMemo(() => {
        return [...new Set(company_list.map(item => item.Province).filter(Boolean))].sort((a, b) =>
            a.localeCompare(b)
        );
    }, [company_list]);

    // Extract cities based on selected province
    const cities = useMemo(() => {
        return [...new Set(
            company_list
                .filter(item => !selectedProvince || item.Province === selectedProvince)
                .map(item => item.City)
                .filter(Boolean)
        )].sort((a, b) => a.localeCompare(b));
    }, [company_list, selectedProvince]);

    // Filtered and sorted companies
    const sortedCompanies = [...company_list]
        .filter(item =>
            (!selectedProvince || item.Province === selectedProvince) &&
            (!selectedCity || item.City === selectedCity)
        )
        .sort((a, b) => a.Comp_name.localeCompare(b.Comp_name));

    const { user } = usePage().props.auth; // 👈 Get user from page props
    const isStudent = user?.role === 'student'; // 👈 Check if the user is a student

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg h-[650px]">
            <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <h3 className="text-lg font-semibold">List of Companies</h3>
                <div className="flex gap-2 items-center">
                    <select
                        value={selectedProvince}
                        onChange={(e) => {
                            setSelectedProvince(e.target.value);
                            setSelectedCity('');
                        }}
                        className="border border-gray-300 text-sm rounded px-2 py-1"
                    >
                        <option value="">All Provinces</option>
                        {provinces.map((prov, idx) => (
                            <option key={idx} value={prov}>{prov}</option>
                        ))}
                    </select>

                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="border border-gray-300 text-sm rounded px-2 py-1"
                        disabled={!selectedProvince}
                    >
                        <option value="">All Cities</option>
                        {cities.map((city, idx) => (
                            <option key={idx} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="min-w-full divide-y divide-gray-200 table-fixed align-top">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                        {/* Conditionally render the Actions column based on the role */}
                        {!isStudent && (
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {sortedCompanies.map((items, index) => {
                        const fullAddress = [
                            items.Street_Address,
                            items.City,
                        ]
                            .filter(Boolean)
                            .join(', ');

                        return (
                            <tr key={items.id}>
                                <td className="align-top px-4 py-4">{index + 1}</td>
                                <td className="align-top px-4 py-4">
                                    {!isStudent ? ( // 👈 Only show Link if not a student
                                        <Link href={`/companies/${items.id}/profile`}>
                                            {items.Comp_name}
                                        </Link>
                                    ) : (
                                        items.Comp_name
                                    )}
                                </td>
                                <td className="align-top px-4 py-4 max-w-[250px] truncate">
                                    {fullAddress || 'N/A'}
                                </td>
                                <td className="align-top px-4 py-4 max-w-[250px]">
                                    {items.course_names ? items.course_names : <span className="text-gray-500">No courses</span>}
                                </td>
                                {/* Conditionally render Actions if not a student */}
                                {!isStudent && (
                                    <td className="align-top px-4 py-4 flex gap-4">
                                        <button onClick={() => handleEdit(items)} className="text-blue-500 hover:text-blue-700">
                                            <FiEdit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(items.id)} className="text-red-500 hover:text-red-700 ml-2">
                                            <MdDelete size={20} />
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}