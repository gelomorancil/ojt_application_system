import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

export default function CompanyDetails() {
    const { company } = usePage().props;

    return (
        <AuthenticatedLayout>
            <div className="p-6 bg-white rounded-lg shadow border border-gray-300">
                <h1 className="text-lg font-semibold text-gray-700 mb-4">{company.Comp_name}</h1>
                <p><strong>Address:</strong> {company.address || 'N/A'}</p>
                <p><strong>Contact:</strong> {company.contact || 'N/A'}</p>
                <p><strong>Email:</strong> {company.email || 'N/A'}</p>
                {/* Add more details if needed */}
            </div>
        </AuthenticatedLayout>
    );
}
