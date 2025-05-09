import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { FiEdit } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import InternList from './InternList';
import MoaList from './MoaList';

export default function ContactList({
    contacts = [],
    handleDelete = () => {},
    contact_list = [],
    moa_list = [],
    intern_list = [],
    handleEdit = () => {},
    companyId,
    activeTab,
    setActiveTab,
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isStudent = user?.role === 'student';

    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto min-h-full min-w-full">
            {/* Tab Navigation */}
            <div className="border-b">
                <nav className="flex space-x-8">
                    <button
                        className={`py-2 px-4 font-medium ${activeTab === 'contacts' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                        onClick={() => setActiveTab('contacts')}
                    >
                        List of Contacts
                    </button>

                    {!isStudent && (
                        <>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === 'interns' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('interns')}
                            >
                                List of Programs
                            </button>
                            <button
                                className={`py-2 px-4 font-medium ${activeTab === 'moa' ? 'border-b-2 border-black' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('moa')}
                            >
                                Status of MOA
                            </button>
                        </>
                    )}
                </nav>
            </div>

            {/* Interns Tab */}
            {!isStudent && activeTab === 'interns' && (
                <InternList intern_list={intern_list} />
            )}

            {/* MOA Tab */}
            {!isStudent && activeTab === 'moa' && (
                <MoaList moa_list={moa_list} />
            )}

            {/* Contacts Table */}
            {activeTab === 'contacts' && (
                <table className="min-w-full divide-y divide-gray-200 table-fixed align-top mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                            {!isStudent && (
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {contact_list.length > 0 ? (
                            contact_list.map((contact, index) => (
                                <tr key={contact.id} className="hover:bg-gray-50">
                                    <td className="align-top px-4 py-4">{index + 1}</td>
                                    <td className="align-top px-4 py-4">{contact.name}</td>
                                    <td className="align-top px-4 py-4">{contact.position}</td>
                                    <td className="align-top px-4 py-4 max-w-[200px]">
                                        {contact.course_names && contact.course_names.length > 0
                                            ? contact.course_names.join(', ')
                                            : 'N/A'}
                                    </td>
                                    <td className="align-top px-4 py-4">{contact.email}</td>
                                    <td className="align-top px-4 py-4">{contact.contact_number}</td>
                                    <td className="align-top px-4 py-4">{contact.Capacity || 'N/A'}</td>
                                    <td className="align-top px-4 py-4">{contact.mode}</td>
                                    {!isStudent && (
                                        <td className="align-top px-4 py-4 flex gap-1">
                                            <button onClick={() => handleEdit(contact)} className="text-blue-500 hover:text-blue-700">
                                                <FiEdit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:text-red-700 ml-2">
                                                <MdDelete size={20} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isStudent ? 8 : 9} className="px-4 py-3 text-center text-gray-500">
                                    No contacts available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
