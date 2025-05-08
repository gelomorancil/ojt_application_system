import React, { useState, useCallback } from "react";
import { Head, usePage, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CompanyForm from "./CompanyForm";
import UploadFiles from "./UploadFiles";

function StudentDetails({ company_list, student_company, preDeployment, deployment, final, dtr }) {
    const { student, auth } = usePage().props;
    const [studentCompanyList, setStudentCompanyList] = useState(student_company);
    const [extraCompanies, setExtraCompanies] = useState([]);
    
    // Setup Inertia form for handling the remarks update
    const { data, setData, post, processing, errors } = useForm({
        remarks: student.Remarks || "",
    });

    // Determine if the current user is a coordinator (not a student)
    const isCoordinator = auth?.user?.role !== 'student';

    const addCompanyBox = useCallback(() => {
        setExtraCompanies(prev => [...prev, { id: Date.now(), saved: false }]);
    }, []);

    const handleDelete = useCallback((id) => {
        setExtraCompanies(prev => prev.filter(company => company.id !== id));
    }, []);

    const handleSave = (newCompany) => {
        setStudentCompanyList((prev) => [...prev, newCompany]);
    };

    // Handle form submission for remarks
    const submitRemarks = (e) => {
        e.preventDefault();
        post(`/student/${student.id}/remarks`);
    };
    

    // Format the timestamp for display
    const formatDate = (dateString) => {
        if (!dateString || dateString === '0000-00-00 00:00:00') return 'Student has not read the remarks yet.';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch (e) {
            return 'Invalid Date';
        }
    };

    // Safely access the last student company data
    const lastStudentCompany = studentCompanyList && studentCompanyList.length > 0
        ? studentCompanyList[studentCompanyList.length - 1]
        : null;

        function formatReadableDate(dateString) {
            if (!dateString || dateString === '0000-00-00 00:00:00') {
              return '';
            }
            
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            });
          }

    return (
        <AuthenticatedLayout>
            <Head title="Student Details" />

            <div className="grid grid-cols-4 gap-5">
                <div className="col-span-2 space-y-6">
                    {/* Left side content */}
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
                                <p><strong>Semester:</strong> {lastStudentCompany?.Sem ?? "Not Available"}</p>
                                <p><strong>Year:</strong> {lastStudentCompany?.AY ?? "Not Available"}</p>
                                <p><strong>Company:</strong> {lastStudentCompany?.company?.Comp_name ?? "Not Available"}</p>
                                <p><strong>Status:</strong> {lastStudentCompany?.Status ?? "Not Available"}</p>
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

                        {/* Only show add company button for coordinators */}
                        {isCoordinator && (
                            <div className="rounded-lg mb-4 flex flex-col items-center">
                                <button
                                    onClick={addCompanyBox}
                                    className="px-4 h-8 bg-gray-500 text-white rounded-lg hover:bg-uslsgreen"
                                >
                                    Add Company Profile
                                </button>
                                {extraCompanies.map((company) => (
                                    <CompanyForm 
                                        key={company.id} 
                                        company_list={company_list} 
                                        onDelete={() => handleDelete(company.id)} 
                                        student={student} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-span-2 space-y-6">
                <UploadFiles 
                id={student.id} 
                preDeployment={preDeployment} 
                deployment={deployment} 
                final={final} 
                dtr={dtr}
                student_company={studentCompanyList} // ✅ pass this
                isCoordinator={isCoordinator}
                />
                    
                    {/* Student Remarks Section with read/unread status */}
                    <div className="bg-white p-6 shadow rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Remarks</h2>
                        {isCoordinator && (
                        <div className="text-sm">
                            {student.remarks_read_at && student.remarks_read_at !== '0000-00-00 00:00:00' ? (
                            <span className="text-green-600">
                                Read on {formatReadableDate(student.remarks_read_at)}
                            </span>
                            ) : (
                            <span className="text-red-600">Unread</span>
                            )}
                        </div>
                        )}
                    </div>

                        {isCoordinator ? (
                            // Coordinator view with edit functionality
                            <div>
                                <form onSubmit={submitRemarks}>
                                    <textarea
                                        value={data.remarks}
                                        onChange={e => setData('remarks', e.target.value)}
                                        className="w-full h-40 p-3 border border-gray-300 rounded-md"
                                        placeholder="Add remarks for this student..."
                                    />
                                    {errors.remarks && <div className="text-red-500 text-sm mt-1">{errors.remarks}</div>}
                                    <div className="mt-3 text-right">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-uslsgreen text-white rounded-lg disabled:opacity-75"
                                        >
                                            {processing ? 'Updating...' : 'Update Remarks'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            // Student view (read-only)
                            <div className="p-3 border border-gray-200 rounded-md min-h-[10rem] bg-gray-50">
                                {student.Remarks ? (
                                    <p className="whitespace-pre-wrap">{student.Remarks}</p>
                                ) : (
                                    <p className="text-gray-400 italic">No remarks yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default StudentDetails;