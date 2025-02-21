import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { router } from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        College: "",
        Course: "",
        Hrs: "",
        Sem: "",
        Year: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("course.store"));
    };

    const handleCancel = () => {
        router.visit(route("course.index"));
    };    

    return (
        <AuthenticatedLayout>
            <Head title="Add Course" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto bg-white p-6 shadow rounded">
                    <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
                    <form onSubmit={handleSubmit}>
                        {/* College */}
                        <div>
                            <label className="block text-gray-700">College:</label>
                            <input
                                type="text"
                                value={data.College}
                                onChange={(e) => setData("College", e.target.value)}
                                className="border p-2 w-full"
                            />
                            {errors.College && <p className="text-red-500">{errors.College}</p>}
                        </div>

                        {/* Course */}
                        <div className="mt-4">
                            <label className="block text-gray-700">Course:</label>
                            <input
                                type="text"
                                value={data.Course}
                                onChange={(e) => setData("Course", e.target.value)}
                                className="border p-2 w-full"
                            />
                            {errors.Course && <p className="text-red-500">{errors.Course}</p>}
                        </div>

                        {/* OJT Hours */}
                        <div className="mt-4">
                            <label className="block text-gray-700">OJT Hours:</label>
                            <input
                                type="number"
                                min="0"
                                step="10"
                                value={data.Hrs}
                                onChange={(e) => setData("Hrs", e.target.value ? parseInt(e.target.value) : 0)}
                                className="border p-2 w-full"
                            />
                            {errors.Hrs && <p className="text-red-500">{errors.Hrs}</p>}
                        </div>

                        {/* Semester */}
                        <div className="mt-4">
                            <label className="block text-gray-700">Semester:</label>
                            <select
                                value={data.Sem}
                                onChange={(e) => setData("Sem", e.target.value)}
                                className="border p-2 w-full"
                            >
                                <option value="">Select Semester</option>
                                <option value="First">First Semester</option>
                                <option value="Second">Second Semester</option>
                                <option value="Summer">Summer</option>
                            </select>
                            {errors.Sem && <p className="text-red-500">{errors.Sem}</p>}
                        </div>

                        {/* Year */}
                        <div className="mt-4">
                            <label className="block text-gray-700">School Year:</label>
                            <select
                                value={data.Year}
                                onChange={(e) => setData("Year", e.target.value)}
                                className="border p-2 w-full"
                            >
                                <option value="">Select S.Y</option>
                                <option value="2025-2026">2025-2026</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2022-2023">2022-2023</option>
                            </select>
                            {errors.Year && <p className="text-red-500">{errors.Year}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Save Course
                            </button>
                        </div>

                        {/* Cancel Button */}
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
