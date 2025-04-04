import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CompanyDetails from './Partials/CompanyDetails';
import ContactList from './Partials/ContactList';
import ContactForm from './Partials/ContactForm';
import { useState } from 'react';

export default function View({ company, contact_list, course_list, intern_list }) {
    const [editingContact, setEditingContact] = useState(null);
    const { data, setData, post, put, reset, delete: destroy, errors } = useForm({
        name: "",
        position: "",
        Course_id: [],
        email: "",
        contact_number:"",
        Capacity: "",
        mode: "",
        Comp_ID: company.id,
    });
    
    const handleSubmit = (e) => {
        // console.log(data)
        e.preventDefault();
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
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this contact person?')) {
            destroy(route('compcourse.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Companies" />
            <div className="py-12">
                <div className="w-11/12 mx-auto grid grid-cols-3">
                    <div className="col-span-1">
                        <CompanyDetails company={company} />
                        <ContactForm Comp_ID={company.id} data={data} setData={setData} handleSubmit={handleSubmit} editingContact={editingContact} resetForm={resetForm} errors={errors}
                        course_list={course_list}/>
                    </div>
                    <div className="col-span-2">
                        <ContactList contacts={company.contacts} contact_list={contact_list} intern_list={intern_list} handleEdit={handleEdit} handleDelete={handleDelete}/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
