import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreateStudent({ courses = [], colleges = [] }) {
    console.log("Colleges:", colleges);
    console.log("Courses:", courses);

    const { data, setData, post, processing, errors } = useForm({
        College: '',
        Course_ID: '',
        Fname: '',
        Lname: '',
        Student_Num: ''
    });

    // Ensure courses are properly filtered based on the selected college
    const filteredCourses = data.College 
    ? courses.filter(course => course.College === data.College) 
    : [];

    // Handle form submission
    const submit = (e) => {
        e.preventDefault();
        post(route('student.store'));
    };

    // Handle cancel action
    const handleCancel = () => {
        router.visit(route('student.index'));
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Add Student</h2>}
        >
            <Head title="Add Student" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            {/* College Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">College</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={data.College}
                                    onChange={(e) => {
                                        setData('College', e.target.value);
                                        setData('Course_ID', ''); 
                                    }}
                                >
                                    <option value="">Select a College</option>
                                    {colleges.map((college, index) => (
                                        <option key={index} value={college}>
                                            {college}
                                        </option>
                                    ))}
                                </select>
                                {errors.College && <p className="text-red-500">{errors.College}</p>}
                            </div>

                            {/* Course Dropdown */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Course</label>
                                <select
                                    className="w-full border rounded-lg p-2"
                                    value={data.Course_ID}
                                    onChange={(e) => setData('Course_ID', e.target.value)}
                                    disabled={!data.College} // Disable until College is selected
                                >
                                    <option value="">Select a Course</option>
                                    {filteredCourses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.Course}
                                        </option>
                                    ))}
                                </select>
                                {errors.Course_ID && <p className="text-red-500">{errors.Course_ID}</p>}
                            </div>

                            {/* First Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Fname}
                                    onChange={(e) => setData('Fname', e.target.value)}
                                />
                                {errors.Fname && <p className="text-red-500">{errors.Fname}</p>}
                            </div>

                            {/* Last Name */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Lname}
                                    onChange={(e) => setData('Lname', e.target.value)}
                                />
                                {errors.Lname && <p className="text-red-500">{errors.Lname}</p>}
                            </div>

                            {/* Student Number */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Student Number</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-lg p-2"
                                    value={data.Student_Num}
                                    onChange={(e) => setData('Student_Num', e.target.value)}
                                />
                                {errors.Student_Num && <p className="text-red-500">{errors.Student_Num}</p>}
                            </div>

                            {/* Button Group */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                    disabled={processing}
                                >
                                    Add Student
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
