import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CompanyDetails from './Partials/CompanyDetails';
import ContactList from './Partials/ContactList';
import ContactForm from './Partials/ContactForm';
import MoaForm from './Partials/MoaForm';
import MoaList from './Partials/MoaList';
import Tabs from './Partials/Tabs';
import InternList from './Partials/InternList';

export default function View({ company, contact_list, moa_list, course_list, intern_list }) {

    const [activeTab, setActiveTab] = useState('contacts');
    const [editingContact, setEditingContact] = useState(null);
    const [editingMoa, setEditingMoa] = useState(null);

    const { data, setData, post, put, reset, delete: destroy, errors } = useForm({
        name: "",
        position: "",
        Course_id: [],
        email: "",
        contact_number: "",
        Capacity: "",
        mode: "",
        Comp_ID: company.id,

    });
    const handleSubmit = (e) => {
        // console.log(data)
        e.preventDefault();
        if (activeTab === "contacts") {
            if (editingContact) {
                put(route('compcourse.update', editingContact.id), { onSuccess: () => resetForm() });
            } else {
                post(route('compcourse.store'), { onSuccess: () => reset() });
            }
        } else if (activeTab === "moa") {
            if (editingMoa) {
                put(route('moa.update', editingMoa.id), { onSuccess: () => resetForm() });
            } else {
                post(route('moa.store'), { onSuccess: () => reset() });
            }
        }
        if (editingContact) {
            put(route('contact.update', editingContact.id), { onSuccess: () => resetForm() });
        } else {
            post(route('contact.store'), { onSuccess: () => reset() });
        }
        reset();
    };

    const handleEdit = (contact) => {
        // console.log(contact);
        setEditingContact(contact);
        setData({
            name: contact?.name || "",
            position: contact?.position || "",
            Course_id: contact?.Course_id || [],
            email: contact?.email || "",
            contact_number: contact?.contact_number || "",
            Capacity: contact?.Capacity || "",
            mode: contact?.mode || "",
            Comp_ID: company.id,
        });
    };
    const resetForm = () => {
        reset();
        setEditingContact(null);
        setEditingMoa(null);
    };

    const handleDeleteMoa = (id, filePath) => {
        if (confirm("Are you sure you want to delete this item?")) {
            destroy(`/moa/${id}`, {
                onSuccess: () => {
                    if (previewFile === `/storage/${filePath}`) {
                        setPreviewFile(null); // Reset preview if the deleted file was open
                    }
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this contact person?')) {
            destroy(route('compcourse.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="w-11/12 mx-auto grid grid-cols-3">
                    <div className="col-span-1">
                        <CompanyDetails company={company} />
                        {activeTab === 'contacts' && (
                            <ContactForm
                                Comp_ID={company.id}
                                data={data}
                                setData={setData}
                                handleSubmit={handleSubmit}
                                editingContact={editingContact}
                                resetForm={resetForm}
                                errors={errors}
                                course_list={course_list}
                            />
                        )}
                    {activeTab === 'moa' && (
                        <MoaForm
                            compId={company.id} // Ensure Comp_ID is passed
                            data={data}
                            setData={setData}
                            handleSubmit={handleSubmit}
                            editingMoa={editingMoa}
                            resetForm={resetForm}
                            errors={errors}
                            moaList={moa_list} // Pass moa_list if needed
                        />
                    )}

                    </div>
                    <div className="col-span-2">
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        {activeTab === "contacts" && (
                            <ContactList
                                contacts={company.contacts}
                                contact_list={contact_list}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                        {activeTab === "moa" && (
                            <MoaList
                                moa_list={moa_list}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                        {activeTab === "interns" && (
                            <InternList
                                intern_list={intern_list}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
