import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ company }) {
    const { data, setData, put, processing, errors } = useForm({
        Comp_name: company.Comp_name,
        Address: company.Address,
        Tel_num: company.Tel_num,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('company.update', company.id)); 
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Company</h2>}
        >
            <Head title="Edit Company" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                
                                <div>
                                    <label className="block font-medium text-gray-700">Company Name</label>
                                    <input
                                        type="text"
                                        value={data.Comp_name}
                                        onChange={(e) => setData('Comp_name', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    {errors.Comp_name && <div className="text-red-500">{errors.Comp_name}</div>}
                                </div>

                                
                                <div>
                                    <label className="block font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        value={data.Address}
                                        onChange={(e) => setData('Address', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    {errors.Address && <div className="text-red-500">{errors.Address}</div>}
                                </div>

                                
                                <div>
                                    <label className="block font-medium text-gray-700">Telephone Number</label>
                                    <input
                                        type="text"
                                        value={data.Tel_num}
                                        onChange={(e) => setData('Tel_num', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    {errors.Tel_num && <div className="text-red-500">{errors.Tel_num}</div>}
                                </div>

                                
                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                                    >
                                        Update
                                    </button>
                                    <a
                                        href={route('company')}
                                        className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
                                    >
                                        Cancel
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
