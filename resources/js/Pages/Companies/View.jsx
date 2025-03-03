import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import CompanyDetails from './Partials/CompanyDetails';
import ContactList from './Partials/ContactList';

export default function View({ company }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Companies</h2>}>
            <Head title="Companies" />
            <div className="py-12">
                <div className="w-11/12 mx-auto grid grid-cols-3 gap-6">
                    <div className="col-span-1">
                        <CompanyDetails company={company}/>
                    </div>

                    {/* DIRI MO IPA GWA IMO TALES AND ALL */}
                    <div className="col-span-2">
                        <ContactList />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}