import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FaTachometerAlt, FaUserGraduate, FaFileContract, FaBook, FaRegBuilding, FaBars } from 'react-icons/fa';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="border-b border-gray-200 bg-white p-4 flex justify-between items-center text-black shadow-md">

                {/* Left - Logo & Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden text-black focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <FaBars className="text-2xl" />
                    </button>
                    <ApplicationLogo className="h-10 w-auto fill-current text-black" />
                </div>

                {/* Center - Navigation Links */}
                <div className={`lg:flex gap-6 ${menuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-white p-4 border-t border-gray-200' : 'hidden lg:flex'}`}>
                    <NavLink href={route('dashboard')} active={route().current('dashboard')} className="nav-item text-black hover:text-gray-700">
                        {/* <FaTachometerAlt className="w-5 h-5" /> */}
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink href={route('companies.index')} active={route().current('companies.index')} className="nav-item text-black hover:text-gray-700">
                        {/* <FaRegBuilding className="w-5 h-5" /> */}
                        <span>Company</span>
                    </NavLink>
                    <NavLink href={route('student')} active={route().current('student')} className="nav-item text-black hover:text-gray-700">
                        {/* <FaUserGraduate className="w-5 h-5" /> */}
                        <span>Student Management</span>
                    </NavLink>
                    <NavLink href={route('moa')} active={route().current('moa')} className="nav-item text-black hover:text-gray-700">
                        {/* <FaFileContract className="w-5 h-5" /> */}
                        <span>MOA</span>
                    </NavLink>
                    {/* <NavLink href={route('course.index')} active={route().current('course.index')} className="nav-item text-black hover:text-gray-700">
                        <FaBook className="w-5 h-5" />
                        <span>Course</span>
                    </NavLink> */}
                    <NavLink href={route('moaprocess.index')} active={route().current('moaprocess.index')} className="nav-item text-black hover:text-gray-700">
                        {/* <FaFileContract className="w-5 h-5" /> */}
                        <span>Moa Processing</span>
                    </NavLink>
                </div>

                {/* Right - User Dropdown */}
                <div className="flex items-center gap-6">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center bg-white px-3 py-2 text-lg font-medium text-black rounded-md hover:text-gray-700 transition">
                                {user.name}
                                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content className="bg-white shadow-lg border border-gray-300">
                            <Dropdown.Link href={route('profile.edit')} className="text-black hover:bg-gray-100">Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-black hover:bg-gray-100">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Main Content */}
            <main className="p-6 flex-1">{children}</main>
        </div>
    );
}
