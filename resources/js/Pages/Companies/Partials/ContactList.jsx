import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function ContactList() {
    const [activeTab, setActiveTab] = useState('contacts');

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto min-h-full">
            {/* Tab Navigation */}
            <div className="border-b">
                <nav className="flex space-x-8">
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'contacts' ? 'border-b-2 border-black' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('contacts')}
                    >
                        List of Contacts
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'interns' ? 'border-b-2 border-black' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('interns')}
                    >
                        List of Interns
                    </button>
                    <button
                        className={`py-2 px-4 font-medium ${
                            activeTab === 'moa' ? 'border-b-2 border-black' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('moa')}
                    >
                        List of MOA
                    </button>
                </nav>
            </div>

            {/* Content for "List of Contacts" */}
            {activeTab === 'contacts' && (
                <table className="min-w-full divide-y divide-gray-200 table-fixed align-top mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {/* Empty state for now */}
                    </tbody>
                </table>
            )}

            {/* Placeholder content for MOA and Interns */}
            {activeTab !== 'contacts' && (
                <div className="mt-4 text-gray-500 text-center">No data available for {activeTab}.</div>
            )}
        </div>
    );
}
