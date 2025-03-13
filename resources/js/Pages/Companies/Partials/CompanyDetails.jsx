    import React from 'react';

export default function CompanyDetails({ company }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg w-full max-w-md mx-4">
            <h1 className="text-base font-semibold">{company.Comp_name}</h1>
            <h1 className="text-sm text-gray-600">{company.Address}</h1>
        </div>
    );
}
