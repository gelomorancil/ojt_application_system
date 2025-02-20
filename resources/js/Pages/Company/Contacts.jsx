import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Contacts({ company, contacts }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Contact Persons for {company.Comp_name}
                </h2>
            }
        >
            <Head title={`Contacts - ${company.Comp_name}`} />

            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">List of Contact Persons</h3>

                {/* Contact Persons Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr className="text-left">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Position</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.length > 0 ? (
                                contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{contact.name}</td>
                                        <td className="border border-gray-300 px-4 py-2">{contact.department}</td>
                                        <td className="border border-gray-300 px-4 py-2">{contact.position}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <a href={`mailto:${contact.email}`} className="text-blue-500 underline">
                                                {contact.email}
                                            </a>
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{contact.phone}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-gray-500">
                                        No contact persons available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
