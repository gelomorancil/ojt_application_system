import React from 'react';

export default function CompanyCreate({ data, setData, handleSubmit, editingCompany, resetForm, errors }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">
                {editingCompany ? 'Edit Company' : 'Add Company'}
            </h3>

            {/* Error Messages */}
            <div className="text-red-500 text-sm mb-2">
                {errors?.Comp_name && <p>{errors.Comp_name}</p>}
                {errors?.Address && <p>{errors.Address}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company Name */}
                <div>
                    <input
                        type="text"
                        placeholder="Company Name"
                        className="w-full p-2 border rounded"
                        value={data.Comp_name}
                        onChange={(e) => setData('Comp_name', e.target.value)}
                    />
                </div>

                {/* Address */}
                <div>
                    <input
                        type="text"
                        placeholder="Address"
                        className="w-full p-2 border rounded"
                        value={data.Address}
                        onChange={(e) => setData('Address', e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    {editingCompany ? 'Update Company' : 'Add Company'}
                </button>

                {/* Cancel Edit Button */}
                {editingCompany && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="w-full bg-gray-500 text-white py-2 rounded mt-2"
                    >
                        Cancel Edit
                    </button>
                )}
            </form>
        </div>
    );
}
