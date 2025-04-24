import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function InternAuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F8F6F0] flex flex-col">
            {/* Top Navigation Bar */}
            <nav className="border-b border-gray-100 bg-green-950 flex justify-between items-center text-white">
                {/* Logo and Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    <button className="lg:hidden text-black" onClick={() => setMenuOpen(!menuOpen)}>
                        <FaBars className="text-2xl" />
                    </button>
                    <ApplicationLogo className="h-10 w-auto fill-current text-black" />
                </div>

                {/* Navigation Links */}
                <div className={`lg:flex gap-6 ${menuOpen ? 'flex flex-col absolute top-16 left-0 w-full bg-gray-900 p-4' : 'hidden'}`}>
                    <NavLink
                        href={route('intern.dashboard')}
                        active={route().current('intern.dashboard')}
                        className="flex items-center gap-2 text-lg font-medium text-white"
                    >
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink
                        href={route('intern.companylist')}
                        active={route().current('intern.companylist')}
                        className="flex items-center gap-2 text-lg font-medium text-white"
                    >
                        <span>Companies</span>
                    </NavLink>
                </div>

                {/* Right - User Dropdown */}
                <div className="flex items-center gap-6">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center bg-white px-3 py-2 text-lg font-medium text-black rounded-md hover:text-gray-700 transition">
                                {user.name}
                                <svg
                                    className="ml-2 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content className="bg-white shadow-lg border border-gray-300">
                            <Dropdown.Link
                                href={route("intern.logout")}
                                method="post"
                                as="button"
                                className="text-black hover:bg-gray-100"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </nav>

            {/* Page Header */}
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
