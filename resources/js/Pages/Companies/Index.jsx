import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ company_course }) {
    const { data, setData, post, put, reset, delete: destroy } = useForm({
        Comp_name: '',
        email: '',
        Tel_num: '',
        Position: '',
        course: '',
        address: '',
        capacity: '',
        mode: '',
    });
    
    const [editingCompany, setEditingCompany] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCompany) {
            put(route('companies.update', editingCompany.id), { onSuccess: () => resetForm() });
        } else {
            post(route('companies.store'), { onSuccess: () => resetForm() });
        }
    };

    const handleEdit = (company) => {
        setEditingCompany(company);
        setData(company);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this company?')) {
            destroy(route('companies.destroy', id), {
                
             });
        }
    };

    const resetForm = () => {
        reset();
        setEditingCompany(null);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Companies</h2>}>
            <Head title="Companies" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-3 gap-6">
                    
                    <div className="col-span-1 bg-white p-6 shadow-sm sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold">{editingCompany ? 'Edit Company' : 'Add Company'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Company Name" className="w-full p-2 border rounded" value={data.Comp_name} onChange={(e) => setData('Comp_name', e.target.value)} required />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            <input type="text" placeholder="Contact Number" className="w-full p-2 border rounded" value={data.Tel_num} onChange={(e) => setData('Tel_num', e.target.value)} required />
                            <input type="text" placeholder="Position" className="w-full p-2 border rounded" value={data.Position} onChange={(e) => setData('Position', e.target.value)} required />
                            <input type="text" placeholder="Course" className="w-full p-2 border rounded" value={data.course} onChange={(e) => setData('course', e.target.value)} required />
                            <input type="text" placeholder="Address" className="w-full p-2 border rounded" value={data.address} onChange={(e) => setData('address', e.target.value)} required />
                            <input type="number" placeholder="Capacity" className="w-full p-2 border rounded" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} required />
                            <select className="w-full p-2 border rounded" value={data.mode} onChange={(e) => setData('mode', e.target.value)} required>
                                <option value="">Select Mode</option>
                                <option value="On-Site">On-Site</option>
                                <option value="Blended">Blended</option>
                                <option value="Work From Home">Work From Home</option>
                            </select>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                                {editingCompany ? 'Update Company' : 'Add Company'}
                            </button>
                            {editingCompany && (
                                <button type="button" onClick={resetForm} className="w-full bg-gray-500 text-white py-2 rounded mt-2">
                                    Cancel Edit
                                </button>
                            )}
                        </form>
                    </div>

                    <div className="col-span-2 bg-white p-6 shadow-sm sm:rounded-lg overflow-x-auto">
                        <h3 className="mb-4 text-lg font-semibold">List of Companies</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {company_course.map((items) => (
                                    <tr key={items.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.company.Comp_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.company.Tel_num}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.Position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.Course}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.company.Address}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.Capacity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{items.Mode}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => handleEdit(items)} className="text-blue-500 hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(items.Comp_ID)} className="text-red-500 hover:underline ml-4">Delete</button>
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
