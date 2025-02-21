import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, errors } = useForm({
        Comp_name: '',
        Address: '',
        Tel_num: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('company.store'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Create Company</h2>}
        >
            <Head title="Create Company" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                <div>
                                    <label htmlFor="Comp_name" className="block text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        id="Comp_name"
                                        name="Comp_name"
                                        value={data.Comp_name}
                                        onChange={(e) => setData('Comp_name', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.Comp_name && <p className="text-red-500 text-xs">{errors.Comp_name}</p>}
                                </div>

                                
                                <div>
                                    <label htmlFor="Address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        id="Address"
                                        name="Address"
                                        value={data.Address}
                                        onChange={(e) => setData('Address', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.Address && <p className="text-red-500 text-xs">{errors.Address}</p>}
                                </div>

                                
                                <div>
                                    <label htmlFor="Tel_num" className="block text-sm font-medium text-gray-700">
                                        Telephone Number
                                    </label>
                                    <input
                                        type="text"
                                        id="Tel_num"
                                        name="Tel_num"
                                        value={data.Tel_num}
                                        onChange={(e) => setData('Tel_num', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.Tel_num && <p className="text-red-500 text-xs">{errors.Tel_num}</p>}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
                                    >
                                        Create Company
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
