import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({ dashboardData }) {
    const {
        totalCompanies = 0,
        totalStudents = 0,
        totalCourses = 0,
        expiryCount = 0,
    } = dashboardData;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">Total Companies</h3>
                            <p className="text-3xl font-bold">{totalCompanies}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">Total Students</h3>
                            <p className="text-3xl font-bold">{totalStudents}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">Total Courses</h3>
                            <p className="text-3xl font-bold">{totalCourses}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">MOA Expiry Set</h3>
                            <p className="text-3xl font-bold text-blue-500">{expiryCount}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
