import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CompanyDetails from './Partials/CompanyDetails';
import ContactList from './Partials/ContactList';
import ContactForm from './Partials/ContactForm';
import MoaForm from './Partials/MoaForm';
import { useState } from 'react';

export default function View({ company, contact_list, course_list, intern_list, moa_list }) {
    const [editingContact, setEditingContact] = useState(null);
    const [activeTab, setActiveTab] = useState('contacts');

    // Contact Form
    const {
        data: contactData,
        setData: setContactData,
        post: postContact,
        put: putContact,
        reset: resetContact,
        delete: destroyContact,
        errors: contactErrors
    } = useForm({
        name: "",
        position: "",
        Course_id: [],
        email: "",
        contact_number: "",
        Capacity: "",
        mode: "",
        Comp_ID: company.id,
    });

    // MOA Form
    const {
        data: moaData,
        setData: setMoaData,
        post: postMoa,
        reset: resetMoa,
        errors: moaErrors,
        processing: moaProcessing
    } = useForm({
        file: null,
        start: "",
        end: "",
        Comp_ID: company.id,
    });

    const handleContactSubmit = (e) => {
        e.preventDefault();
        if (editingContact) {
            putContact(route('contact.update', editingContact.id), {
                onSuccess: () => resetContact()
            });
        } else {
            postContact(route('contact.store'), {
                onSuccess: () => resetContact()
            });
        }
        setEditingContact(null);
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setContactData({
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

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this contact person?')) {
            destroyContact(route('compcourse.destroy', id));
        }
    };

    const handleMoaSubmit = (e) => {
        e.preventDefault();
        postMoa(route('moa.store'), {
            forceFormData: true,
            onSuccess: () => resetMoa()
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Companies" />
            <div className="py-12">
                <div className="w-11/12 mx-auto grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <CompanyDetails company={company} />

                        {activeTab === 'moa' ? (
                            <MoaForm
                                compId={company.id}
                                data={moaData}
                                setData={setMoaData}
                                handleSubmit={handleMoaSubmit}
                                errors={moaErrors}
                                processing={moaProcessing}
                            />
                        ) : (
                            <ContactForm
                                Comp_ID={company.id}
                                data={contactData}
                                setData={setContactData}
                                handleSubmit={handleContactSubmit}
                                editingContact={editingContact}
                                resetForm={() => {
                                    resetContact();
                                    setEditingContact(null);
                                }}
                                errors={contactErrors}
                                course_list={course_list}
                            />
                        )}
                    </div>

                    <div className="col-span-2 space-y-6">
                        <ContactList
                            contacts={company.contacts}
                            contact_list={contact_list}
                            intern_list={intern_list}
                            moa_list={moa_list}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            companyId={company.id}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
