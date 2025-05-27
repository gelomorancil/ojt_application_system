import { Link, usePage } from '@inertiajs/react';
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

    const { user } = usePage().props.auth;
    const isStudent = user?.role === 'student';

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to get expiry status
    const getExpiryStatus = (expiryDate) => {
        if (!expiryDate) return { status: 'unknown', className: 'text-gray-500' };

        const today = new Date();
        const expiry = new Date(expiryDate);
        const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return { status: 'expired', className: 'text-red-600 font-semibold' };
        } else if (daysUntilExpiry <= 30) {
            return { status: 'expiring soon', className: 'text-orange-600 font-semibold' };
        } else {
            return { status: 'active', className: 'text-green-600' };
        }
    };

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

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed align-top">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Company</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-64">Address</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Courses</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">MOA Expiry</th>
                            {!isStudent && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">Actions</th>
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

                            const expiryStatus = getExpiryStatus(items.moa_expiry);

                            return (
                                <tr key={items.id} className="hover:bg-gray-50">
                                    <td className="align-top px-4 py-4 text-sm">{index + 1}</td>
                                    <td className="align-top px-4 py-4 text-sm">
                                        <Link
                                            href={`/companies/${items.id}/profile`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                        >
                                            {items.Comp_name}
                                        </Link>
                                    </td>
                                    <td className="align-top px-4 py-4 text-sm max-w-[250px] truncate" title={fullAddress}>
                                        {fullAddress || 'N/A'}
                                    </td>
                                    <td className="align-top px-4 py-4 text-sm max-w-[200px]">
                                        {items.course_names ? (
                                            <span className="text-gray-700">{items.course_names}</span>
                                        ) : (
                                            <span className="text-gray-500 italic">No courses</span>
                                        )}
                                    </td>
                                    <td className="align-top px-4 py-4 text-sm">
                                        <span className={expiryStatus.className}>
                                            {formatDate(items.moa_expiry)}
                                        </span>
                                    </td>
                                    {!isStudent && (
                                        <td className="align-top px-4 py-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(items)}
                                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                                                title="Edit Company"
                                            >
                                                <FiEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(items.id)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                                                title="Delete Company"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {sortedCompanies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No companies found matching the selected criteria.
                </div>
            )}
        </div>
    );
}
