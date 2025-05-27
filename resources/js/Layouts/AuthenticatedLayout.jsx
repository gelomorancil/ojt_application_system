import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function AuthenticatedLayout({ header, children }) {
    const { user } = usePage().props.auth;
    const [menuOpen, setMenuOpen] = useState(false);
    const isStudent = user.role === "student";

    if (!user) {
        return (
            <div className="min-h-screen bg-green-950 flex justify-center items-center">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
            {/* Navbar */}
            <nav className="border-b border-gray-200 bg-green-950">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Left Side: Logo + Menu Button */}
                        <div className="flex items-center gap-4">
                            <button className="lg:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
                                <FaBars className="text-2xl" />
                            </button>
                            <ApplicationLogo className="h-10 w-auto fill-current text-black" />
                        </div>

                        {/* Desktop Nav Links */}
                        <div className="hidden lg:flex gap-6 items-center">
                            {!isStudent ? (
                                <>
                                    <NavLink href={route("dashboard")} active={route().current("dashboard")}>Dashboard</NavLink>
                                    <NavLink href={route("companies.index")} active={route().current("companies.index")}>Companies</NavLink>
                                    <NavLink href={route("student")} active={route().current("student")}>Student Management</NavLink>
                                    <NavLink href={route("course.index")} active={route().current("course.index")}>Program</NavLink>
                                    <NavLink href={route("moaprocess.index")} active={route().current("moaprocess.index")}>MOA Status</NavLink>
                                    <NavLink href={route("studentuploading.index")} active={route().current("studentuploading.index")}>Class List</NavLink>
                                    <NavLink href={route("forms.index")} active={route().current("forms.index")}>Downloadable Forms</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink href={route("companies.index")} active={route().current("companies.index")}>Companies</NavLink>
                                    <NavLink href={route("student.studentdetails", { student: user.student_id })} active={route().current("student.studentdetails")}>Student Management</NavLink>
                                    <NavLink href={route("forms.index", { student: user.student_id })} active={route().current("forms.index")}>Downloadable Forms</NavLink>
                                </>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <div className="hidden lg:flex items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center bg-white px-3 py-2 text-sm font-medium text-gray-700 rounded hover:text-gray-900">
                                        {user.name}
                                        <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content className="bg-white">
                                    <Dropdown.Link href={route("profile.edit")} className="text-black hover:bg-gray-100">Profile</Dropdown.Link>
                                    <Dropdown.Link method="post" href={route("logout")} as="button" className="text-black hover:bg-gray-100">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="lg:hidden bg-gray-50 border-t border-gray-200 px-4 py-4 space-y-2">
                        {!isStudent ? (
                            <>
                                <NavLink href={route("dashboard")} active={route().current("dashboard")}>Dashboard</NavLink>
                                <NavLink href={route("companies.index")} active={route().current("companies.index")}>Companies</NavLink>
                                <NavLink href={route("student")} active={route().current("student")}>Student Management</NavLink>
                                <NavLink href={route("course.index")} active={route().current("course.index")}>Program</NavLink>
                                <NavLink href={route("moaprocess.index")} active={route().current("moaprocess.index")}>MOA Status</NavLink>
                                <NavLink href={route("studentuploading.index")} active={route().current("studentuploading.index")}>Class List</NavLink>
                                <NavLink href={route("forms.index")} active={route().current("forms.index")}>Downloadable Forms</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink href={route("companies.index")} active={route().current("companies.index")}>Companies</NavLink>
                                <NavLink href={route("student.studentdetails", { student: user.student_id })} active={route().current("student.studentdetails")}>Student Management</NavLink>
                                <NavLink href={route("forms.index", { student: user.student_id })} active={route().current("forms.index")}>Downloadable Forms</NavLink>
                            </>
                        )}
                        <div className="border-t border-gray-300 pt-3">
                            <NavLink href={route("profile.edit")}>Profile</NavLink>
                            <NavLink method="post" href={route("logout")} as="button">Log Out</NavLink>
                        </div>
                    </div>
                )}
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className="p-6 flex-1">{children}</main>
        </div>
    );
}
