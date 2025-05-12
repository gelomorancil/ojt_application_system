import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Stellar.Path - Sync Your Path, Elevate Your Career" />
            <div className="bg-white text-gray-900">
                {/* Header */}
                <header className="fixed w-full bg-white shadow-md z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-8 w-auto text-gray-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.2739 9.86883L16.8325 4.9188C16.5299 4.45342 16.0374 4.18234 15.5016 4.18234H8.49867C7.96282 4.18234 7.47022 4.45342 7.16756 4.9188L3.72619 9.86883C3.3419 10.4223 3.3419 11.1389 3.72619 11.6924L7.16756 16.6424C7.47027 17.1077 7.96287 17.3788 8.49867 17.3788H15.5016C16.0374 17.3788 16.53 17.1077 16.8326 16.6424L20.274 11.6924C20.6583 11.1389 20.6583 10.4223 20.2739 9.86883Z" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9 9L11 7L13 9L15 7" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9 15L11 13L13 15L15 13" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="ml-2 font-bold text-xl">
                                    Stellar.<span className="text-[#087830]">Path</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <Link href={route('login')} className="px-4 py-2 rounded-md border-2 border-[#087830] text-[#087830] font-medium hover:bg-[#087830] hover:text-white transition-colors duration-300">
                                    Login
                                </Link>
                                <Link href={route('register')} className="px-4 py-2 rounded-md bg-[#087830] text-white font-medium hover:bg-[#065d26] transition-colors duration-300">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section
                className="pt-24 pb-16 bg-cover bg-center relative min-h-screen"
                style={{
                    backgroundImage: "url('/USLS3.jpg')",
                    backgroundPosition: "center"
                }}
                >
                {/* Dark overlay for better text visibility */}
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
                        <Link
                        href="#"
                        className="px-6 py-3 rounded-md bg-[#087830] text-white font-medium hover:bg-[#065d26] transition-colors duration-300"
                        >
                        Get Started
                        </Link>
                        <Link
                        href="#"
                        className="px-6 py-3 rounded-md border-2 border-white text-white font-medium hover:bg-white hover:text-[#087830] transition-colors duration-300"
                        >
                        View Demo
                        </Link>
                    </div>
                    </div>
                </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Designed For Your Journey</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Our platform combines cutting-edge technology with personalized training to help you achieve your goals.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-[#087830]/10 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-[#087830]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
                                <p className="text-gray-600">
                                    Track your records, monitor your progress, and see real-time improvements in your journey.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-[#087830]/10 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-[#087830]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Add Something</h3>
                                <p className="text-gray-600">
                                    Customize
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="w-12 h-12 bg-[#087830]/10 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-6 h-6 text-[#087830]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Add Something</h3>
                                <p className="text-gray-600">
                                    Customize
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Eco-Building Section */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-12">
                            <div className="lg:w-1/2">
                                <div className="rounded-xl overflow-hidden shadow-xl">
                                    <img src="/USLS3.jpg" alt="Eco-friendly modern building" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl font-bold mb-6">Our Sustainable Approach</h2>
                                <p className="text-gray-600 mb-6">
                                    Inspired by modern eco-friendly architecture, our facilities are designed to harmonize with nature while providing
                                    the ultimate experience. Our commitment to sustainability extends to every aspect of our operations.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg className="w-5 h-5 text-[#087830]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="ml-3 text-gray-600">Solar-powered facilities that reduce our carbon footprint</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg className="w-5 h-5 text-[#087830]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="ml-3 text-gray-600">Eco-friendly materials used throughout our infrastructure</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg className="w-5 h-5 text-[#087830]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                            </svg>
                                        </div>
                                        <p className="ml-3 text-gray-600">Natural light integration to reduce energy consumption</p>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <Link href="#" className="px-6 py-3 rounded-md bg-[#087830] text-white font-medium hover:bg-[#065d26] transition-colors duration-300">
                                        Explore Our Facilities
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-16 bg-[#087830]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Journey?</h2>
                        <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
                            Join who have elevated their workout experience with Stellar Path.
                            Start your journey today and see the difference.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="#" className="px-6 py-3 rounded-md bg-white text-[#087830] font-medium hover:bg-gray-100 transition-colors duration-300">
                                Get Started Free
                            </Link>
                            <Link href="#" className="px-6 py-3 rounded-md border-2 border-white text-white font-medium hover:bg-white/10 transition-colors duration-300">
                                Schedule a Demo
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
                            <div>
                                <div className="flex items-center mb-2">
                                    <svg className="h-6 w-auto text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.2739 9.86883L16.8325 4.9188C16.5299 4.45342 16.0374 4.18234 15.5016 4.18234H8.49867C7.96282 4.18234 7.47022 4.45342 7.16756 4.9188L3.72619 9.86883C3.3419 10.4223 3.3419 11.1389 3.72619 11.6924L7.16756 16.6424C7.47027 17.1077 7.96287 17.3788 8.49867 17.3788H15.5016C16.0374 17.3788 16.53 17.1077 16.8326 16.6424L20.274 11.6924C20.6583 11.1389 20.6583 10.4223 20.2739 9.86883Z" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9 9L11 7L13 9L15 7" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M9 15L11 13L13 15L15 13" stroke="#087830" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <div className="ml-2 font-bold text-lg">
                                        Stellar.<span className="text-[#087830]">Path</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-xs">
                                    Elevating journeys through technology and personalized experiences.
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center mb-2">
                                    <img src="/GMS.png" alt="GMS Logo" className="h-6 w-auto" />
                                    <div className="ml-2 font-bold text-lg">Green Module Systems</div>
                                </div>
                                <div className="text-gray-400 text-xs">
                                    <p className="mb-1 font-medium">Developers</p>
                                    <ul className="list-disc list-inside">
                                        <li>Agapito, Carl Justin</li>
                                        <li>De Paula, Lowelyn Ann</li>
                                        <li>Jimenea, Jia Michelle F.</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold mb-2">Connect</h3>
                                <ul className="space-y-1 text-xs">
                                    <li><Link href="#" className="text-gray-400 hover:text-white">Contact</Link></li>
                                    <li><Link href="#" className="text-gray-400 hover:text-white">Support</Link></li>
                                    <li><Link href="#" className="text-gray-400 hover:text-white">Partners</Link></li>
                                    <li><Link href="#" className="text-gray-400 hover:text-white">Developers</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-xs">
                            <p className="text-gray-400">&copy; 2025 Stellar.Path. All rights reserved.</p>
                            <div className="flex space-x-4 mt-2 md:mt-0">
                                {/* Social icons remain unchanged */}
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
