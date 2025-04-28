import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CompanyCreate from './Partials/CompanyCreate';
import CompanyList from './Partials/CompanyList';

export default function Index({ company_list }) {
    console.log(company_list);
    const { data, setData, post, put, reset, delete: destroy, errors } = useForm({
        Comp_name: '',
        Address: '',
        Courses: '',
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
        setData({
            Comp_name: company.Comp_name || '',
            Street_Address: company.Street_Address || '',
            Barangay: company.Barangay || '',
            City: company.City || '',
            Province: company.Province || '',
            Postal_Code: company.Postal_Code || '',
            Country: company.Country || '',
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this company?')) {
            destroy(route('companies.destroy', id));
        }
    };

    const resetForm = () => {
        reset();
        setEditingCompany(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Companies" />
            <div className="py-12">
                <div className="w-11/12 mx-auto grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <CompanyCreate
                            data={data}
                            setData={setData}
                            handleSubmit={handleSubmit}
                            editingCompany={editingCompany}
                            resetForm={resetForm}
                            errors={errors}
                        />
                    </div>
                    <div className="col-span-2">
                        <CompanyList
                            company_list={company_list}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
