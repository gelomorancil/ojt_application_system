import React from 'react';

const provinces = {
    I: ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
    II: ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino"],
    III: ["Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales"],
    IVA: ["Batangas", "Cavite", "Laguna", "Quezon", "Rizal"],
    MIMAROPA: ["Marinduque", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Romblon"],
    V: ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon"],
    VI: ["Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental"],
    VII: ["Bohol", "Cebu", "Negros Oriental", "Siquijor"],
    VIII: ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte"],
    IX: ["Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
    X: ["Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
    XI: ["Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental"],
    XII: ["Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat"],
    XIII: ["Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
    BARMM: ["Basilan", "Lanao del Sur", "Maguindanao del Norte", "Maguindanao del Sur", "Sulu", "Tawi-Tawi"],
    NCR: ["Metro Manila"],
    CAR: ["Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"]
  };  

export default function CompanyCreate({ data, setData, handleSubmit, editingCompany, resetForm, errors }) {
    return (
        <div className="bg-white p-6 shadow-sm sm:rounded-lg">
            <h3 className="mb-4 text-lg font-semibold">
                {editingCompany ? 'Edit Company' : 'Add Company'}
            </h3>

            {/* Error Messages */}
            <div className="text-red-500 text-sm mb-2">
                {errors?.Comp_name && <p>{errors.Comp_name}</p>}
                {errors?.Street_Address && <p>{errors.Street_Address}</p>}
                {errors?.Barangay && <p>{errors.Barangay}</p>}
                {errors?.City && <p>{errors.City}</p>}
                {errors?.Province && <p>{errors.Province}</p>}
                {errors?.Postal_Code && <p>{errors.Postal_Code}</p>}
                {errors?.Country && <p>{errors.Country}</p>}
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

                {/* Street Address */}
                <div>
                    <input
                        type="text"
                        placeholder="Street Address"
                        className="w-full p-2 border rounded"
                        value={data.Street_Address || ''}
                        onChange={(e) => setData('Street_Address', e.target.value)}
                    />
                </div>

                {/* Barangay/Subdivision */}
                <div>
                    <input
                        type="text"
                        placeholder="Barangay/Subdivision"
                        className="w-full p-2 border rounded"
                        value={data.Barangay || ''}
                        onChange={(e) => setData('Barangay', e.target.value)}
                    />
                </div>

                {/* City/Municipality */}
                <div>
                    <input
                        type="text"
                        placeholder="City/Municipality"
                        className="w-full p-2 border rounded"
                        value={data.City || ''}
                        onChange={(e) => setData('City', e.target.value)}
                    />
                </div>

                {/* Province - Dropdown */}
                <div>
                    <select
                        className="w-full p-2 border rounded"
                        value={data.Province || ''}
                        onChange={(e) => setData('Province', e.target.value)}
                    >
                        <option value="">Select Province</option>
                        {Object.entries(provinces).map(([region, provinces]) => (
                            <optgroup label={region} key={region}>
                                {provinces.map((Province) => (
                                    <option key={Province} value={Province}>{Province}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>


                {/* Postal Code */}
                <div>
                    <input
                        type="text"
                        placeholder="Postal Code"
                        className="w-full p-2 border rounded"
                        value={data.Postal_Code || ''}
                        onChange={(e) => setData('Postal_Code', e.target.value)}
                    />
                </div>

                {/* Country */}
                <div>
                    <input
                        type="text"
                        placeholder="Country"
                        className="w-full p-2 border rounded"
                        value={data.Country || ''}
                        onChange={(e) => setData('Country', e.target.value)}
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
