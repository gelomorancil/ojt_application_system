import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Stellar.Path - Career Development Centre" />
            <div className="bg-white text-gray-900">
                {/* Header */}
                <header className="fixed w-full bg-white shadow-md z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-2">
                                <img src="/StellarPathLogo.png" alt="Stellar.Path Logo" className="h-12 w-auto" />
                                <span className="text-xl font-bold">
                                    <span>Stellar.</span><span className="text-[#087830]">Path</span>
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link href={route('login')} className="text-[#087830] border border-[#087830] px-4 py-2 rounded hover:bg-[#087830] hover:text-white transition">
                                    Login
                                </Link>
                                <Link href={route('register')} className="bg-[#087830] text-white px-4 py-2 rounded hover:bg-[#065d26] transition">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section
                    className="pt-20 pb-16 bg-cover bg-center relative min-h-screen"
                    style={{ backgroundImage: "url('/USLS3.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center min-h-[80vh]">
                        <div className="flex flex-col items-center lg:items-start lg:w-1/2">
                            <h1 className="text-5xl font-bold leading-tight mb-6 text-white text-center lg:text-left">
                                Sync Your Path,<br />
                                Elevate Your <span className="text-[#4ADE80]">Career</span>
                            </h1>
                            <p className="text-gray-200 text-lg mb-8 text-center lg:text-left">
                                Where your journey is streamlined, and every step is a leap toward transformation.
                                Sync your path, track your progress, and achieve more with every move.
                            </p>
                            <div className="flex space-x-4">
                                <Link href={route('register')} className="px-6 py-3 rounded-md bg-[#087830] text-white font-medium hover:bg-[#065d26] transition">
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="py-12 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">System Features</h2>
                        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                                <div className="text-4xl mb-4">🗓️</div>
                                <h3 className="text-xl font-semibold mb-2">DTR Upload</h3>
                                <p className="text-gray-600">Submit and manage your Daily Time Records with ease.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                                <div className="text-4xl mb-4">📈</div>
                                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                                <p className="text-gray-600">Monitor milestones throughout your deployment journey.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
                                <div className="text-4xl mb-4">📂</div>
                                <h3 className="text-xl font-semibold mb-2">Centralized File Storage</h3>
                                <p className="text-gray-600">Access and organize all internship-related documents by company.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white pt-10 pb-6">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-700 pb-6">
                            {/* About / Logo */}
                            <div>
                                 <div className="flex items-center space-x-3">
                                <img src="/GMS.png" alt="GMS Logo" className="h-10 w-auto" />
                                <span className="text-lg font-semibold">Green Module Systems</span>
                            </div>
                                <p className="text-sm text-gray-400">
                                    A project of the Career Development Centre, University of St. La Salle — empowering students to take charge of their internship journey.
                                </p>
                            </div>

                            {/* Dev Credits */}
                            <div>
                                <p className="font-medium mb-2 text-sm">Developed by</p>
                                <ul className="text-gray-400 text-sm space-y-1">
                                    <li>Agapito, Carl Justin</li>
                                    <li>De Paula, Lowelyn Ann B.</li>
                                    <li>Jimenea, Jia Michelle F.</li>
                                </ul>
                            </div>

                            {/* Contact / Placeholder */}
                            <div>
                                <p className="font-medium mb-2 text-sm">Contact</p>
                                <p className="text-gray-400 text-sm">
                                    Email: <a href="mailto:cdc@usls.edu.ph" className="underline">cdc@usls.edu.ph</a><br />
                                    Phone: (034) 434-6100 loc 213
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-xs text-gray-500">
                            © {new Date().getFullYear()} Stellar.Path. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
