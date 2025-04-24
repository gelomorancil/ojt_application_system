import React, { useState, useCallback } from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CompanyForm from "./CompanyForm";
import UploadFiles from "./UploadFiles";
import StudentRemarks from "./Partials/StudentRemarks";

function StudentDetails({ company_list, student_company, preDeployment, deployment, final }) {
    console.log("final time",final);
    const [studentCompanyList, setStudentCompanyList] = useState(student_company);

    const { student } = usePage().props;
    const [extraCompanies, setExtraCompanies] = useState([]);

    const addCompanyBox = useCallback(() => {
        setExtraCompanies(prev => [...prev, { id: Date.now(), saved: false }]);
    }, []);

    const handleDelete = useCallback((id) => {
        setExtraCompanies(prev => prev.filter(company => company.id !== id));
    }, []);

    const handleSave = (newCompany) => {
        setStudentCompanyList((prev) => [...prev, newCompany]);
    };
    

    return (
        <AuthenticatedLayout>
            <Head title="Student Details" />

            <div className="grid grid-cols-4 gap-5">
                <div className="col-span-2 space-y-6">
                    {/* Left side content remains the same */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                                <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Photo</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{student?.Fname} {student?.Lname}</h1>
                                    <p><strong>Student Number:</strong> {student?.Student_Num ?? "N/A"}</p>
                                    <p><strong>College:</strong> {student?.College_Name ?? "Not Provided"}</p>
                                    <p><strong>Course:</strong> {student?.Course_Name ?? "Not Provided"}</p>
                                    <p><strong>OJT Hours:</strong> {student?.Ojt_Hours ?? "Not Provided"}</p>
                                </div>
                            </div>
                            <div className="text-right">
                            <p><strong>Semester:</strong> {studentCompanyList.at(-1)?.Sem ?? "Not Available"}</p>
                            <p><strong>Year:</strong> {studentCompanyList.at(-1)?.AY ?? "Not Available"}</p>
                            <p><strong>Company:</strong> {studentCompanyList.at(-1)?.company?.Comp_name ?? "Not Available"}</p>
                            <p><strong>Status:</strong> {studentCompanyList.at(-1)?.Status ?? "Not Available"}</p>
                            </div>
                        </div>
                        <div className="col-span-1 bg-white p-6 shadow-xl rounded-lg mb-4 mt-4">
                            {student_company.length > 0 ? (
                                student_company.map((item, index) => (
                                    <div key={index} className='bg-white rounded mb-2 p-2'>
                                        <p><strong>Company:</strong> {item.company?.Comp_name ?? "Not Available"}</p>
                                        <p><strong>Semester:</strong> {item.Sem ?? "Not Available"}</p>
                                        <p><strong>School Year:</strong> {item.AY ?? "Not Available"}</p>
                                        <p><strong>Status:</strong> {item.Status ?? "No Status"}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No company assigned.</p>
                            )}
                        </div>
                        <div className="rounded-lg mb-4 flex flex-col items-center">
                            <button
                                onClick={addCompanyBox}
                                className="px-4 h-8 bg-gray-500 text-white rounded-lg hover:bg-uslsgreen"
                            >
                                Add Company Profile
                            </button>
                            {extraCompanies.map((company) => (
                                <CompanyForm key={company.id} company_list={company_list} onDelete={() => handleDelete(company.id)} student={student} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-span-2 space-y-6">
                    <UploadFiles id={student.id} preDeployment={preDeployment} deployment={deployment} final={final}/>
                    <StudentRemarks studentId={student.id} initialRemarks={student.Remarks} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default StudentDetails;