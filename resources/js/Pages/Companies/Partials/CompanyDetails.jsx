import React from 'react';

export default function CompanyDetails({ company }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg ">
            <h1>{company.Comp_name}</h1>
            <h1>{company.Address}</h1>
        </div>
    );
}