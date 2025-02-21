import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";



export default function Company({ companies }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this company?")) {
            destroy(route('company.destroy', id), {
                onSuccess: () => alert('Company deleted successfully!')
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 flex justify-between">
                    List of Companies
                    <Link href={route('company.create')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        + Create
                    </Link>
                </h2>
            }
        >
            <Head title="Companies" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2">Company Name</th>
                                    <th className="border px-4 py-2">Address</th>
                                    <th className="border px-4 py-2">Telephone</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.map((company) => (
                                    <tr key={company.id} className="text-center">
                                        <td className="border px-4 py-2 max w-4/12">{company.Comp_name}</td>
                                        <td className="border px-4 py-2 max-w-lg w-full">{company.Address}</td>
                                        <td className="border px-4 py-2">{company.Tel_num}</td>
                                        <td className="border px-4 py-2 space-x-2">
                                            <Link href={route('company.edit', company.id)} className="text-blue-600 hover:text-blue-800">
                                            <PencilSquareIcon className="w-5 h-5 inline" />
                                            </Link>
                                            <button 
                                            onClick={() => handleDelete(company.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <TrashIcon className="w-5 h-5 inline" />
                                            </button>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
