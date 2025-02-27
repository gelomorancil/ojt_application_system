import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { FaTachometerAlt, FaUserGraduate, FaFileContract, FaBook, FaSearch, FaRegBuilding, FaBars } from 'react-icons/fa';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
            {/* Top Navigation */}
            <nav className="border-b border-gray-100 bg-white p-4 flex justify-between items-center shadow-md">
                {/* Left Side - Logo & Navigation Links */}
                <div className="flex items-center gap-6">
                    <ApplicationLogo className="h-10 w-auto fill-current text-gray-900" />

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
                        <FaBars className="text-2xl" />
                    </button>

                    {/* Navigation Links */}
                    <div className={`lg:flex items-center gap-6 ${menuOpen ? 'block' : 'hidden'} lg:block`}>
                        <NavLink href={route('dashboard')} active={route().current('dashboard')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <FaTachometerAlt /> Dashboard
                        </NavLink>
                        <NavLink href={route('companies.index')} active={route().current('companies.index')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <FaRegBuilding /> Companies
                        </NavLink>
                        <NavLink href={route('student')} active={route().current('student')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <FaUserGraduate /> Student
                        </NavLink>
                        <NavLink href={route('moa')} active={route().current('moa')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <FaFileContract /> Moa
                        </NavLink>
                        <NavLink href={route('course.index')} active={route().current('course.index')} className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                            <FaBook /> Course
                        </NavLink>
                    </div>
                </div>

                {/* Right Side - Search & User Dropdown */}
                <div className="flex items-center gap-6">
                    {/* Search Bar */}
                    <div className="relative flex items-center">
                        <FaSearch className="absolute left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>

                    {/* User Dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-lg font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                >
                                    {user.name}
                                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
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
