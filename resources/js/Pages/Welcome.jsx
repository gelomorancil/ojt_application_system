import { Head, Link } from '@inertiajs/react';


export default function Welcome() {
    return (
        <>
            <Head title="Stellar Path" />

            <div className="bg-white text-gray-900">
                {/* Header */}
                <header className="fixed w-full bg-white shadow-md z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <svg className="h-8 w-auto text-[#087830]" viewBox="0 0 24 24" fill="none">
                                    <path d="M20.27 9.87L16.83 4.92A1.5 1.5 0 0015.5 4H8.5a1.5 1.5 0 00-1.33.92L3.73 9.87a1.5 1.5 0 000 1.82l3.44 4.95a1.5 1.5 0 001.33.74h7a1.5 1.5 0 001.33-.74l3.44-4.95a1.5 1.5 0 000-1.82z" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="ml-2 font-bold text-xl">Stellar <span className="text-[#087830]">Path</span></span>
                            </div>
                            <div className="space-x-4">
                                <Link href={route('login')} className="px-4 py-2 border-2 border-[#087830] text-[#087830] rounded hover:bg-[#087830] hover:text-white transition">Login</Link>
                                <Link href={route('register')} className="px-4 py-2 bg-[#087830] text-white rounded hover:bg-[#065d26] transition">Register</Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero */}
                <section className="pt-24 pb-16 bg-cover bg-center min-h-screen relative" style={{ backgroundImage: "url('/USLS3.jpg')" }}>
                    <div className="absolute inset-0 bg-black bg-opacity-60" />
                    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Welcome to Your Internship Journey</h1>
                        <p className="text-lg mb-8">Track your documents, monitor your DTRs, and stay updated with your coordinator — all in one place.</p>
                        <Link href={route('register')} className="px-6 py-3 bg-[#087830] rounded-md font-medium hover:bg-[#065d26] transition">Get Started</Link>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold">Built for Interns and Coordinators</h2>
                            <p className="text-gray-600">Simple tools to make internship management seamless.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold mb-2 text-[#087830]">Document Uploads</h3>
                                <p className="text-gray-600">Upload your Pre-Deployment, DTR, and Final Requirements by category and company.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold mb-2 text-[#087830]">Progress Tracking</h3>
                                <p className="text-gray-600">Check your submission status and stay on top of deadlines.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-semibold mb-2 text-[#087830]">Coordinator Sync</h3>
                                <p className="text-gray-600">Coordinators can monitor student progress and download submissions easily.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 bg-[#087830] text-white text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-4">Start Your Internship Right</h2>
                        <p className="mb-6">Everything you need to submit your requirements and succeed in your OJT — right here.</p>
                        <Link href={route('register')} className="px-6 py-3 bg-white text-[#087830] font-semibold rounded-md hover:bg-gray-100 transition">Register Now</Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-400 py-10 text-center">
                    <p className="text-sm">© {new Date().getFullYear()} University of St. La Salle - Career Development Centre</p>
                </footer>
            </div>
        </>
    );
}
