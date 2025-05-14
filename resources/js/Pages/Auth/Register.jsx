import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
        <Head title="Stellar.Path - Career Development Centre" />
        <div className="flex min-h-screen bg-white">
            {/* Left column with image and testimonial */}
            <div className="relative hidden w-2/5 bg-gray-700 lg:block">
                <div className="absolute inset-0">
                    <img
                        src="/USLS1.jpg"
                        alt="Background"
                        className="h-full w-full object-cover opacity-40"
                    />
                </div>
                <div className="absolute bottom-20 left-8 right-8 text-white">
                    <div className="mb-2 text-2xl font-bold">
                        "Confidence comes not from always being right, but from not fearing to be wrong."
                    </div>
                    <div className="text-lg font-medium">— Peter T. McIntyre</div>
                    {/* <div className="text-sm text-gray-200">Position</div> */}
                </div>
                <div className="absolute left-8 top-8">
                    <div className="flex items-center">
                        <img src="/StellarPathLogo.png" alt="Stellar.Path Logo" className="h-12 w-auto" />
                        <span className="text-xl font-bold">
                            <span className="text-white">Stellar.</span>
                            <span className="text-[#087830]">Path</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Right column with registration form */}
            <div className="flex w-full items-center justify-center px-8 lg:w-3/5">
                <div className="w-full max-w-md">
                    {/* Logo for mobile view */}
                    <div className="mb-8 block lg:hidden">
                        <div className="flex items-center">
                            <img src="/StellarPathLogo.png" alt="Stellar.Path Logo" className="h-12 w-auto" />
                            <span className="text-xl font-bold">
                                <span className="text-gray-900">Stellar.</span>
                                <span className="text-[#087830]">Path</span>
                            </span>
                        </div>
                    </div>

                    <h1 className="mb-2 text-3xl font-bold text-gray-900">Create an account</h1>
                    <p className="mb-8 text-gray-600">Join Stellar.Path and start your educational journey today.</p>

                    <div>
                        <div className="mb-4">
                            <p className="mb-1 text-sm text-gray-700">Full Name</p>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="block w-full border border-gray-300 rounded-md"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        <div className="mb-4">
                            <p className="mb-1 text-sm text-gray-700">Email</p>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full border border-gray-300 rounded-md"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div className="mb-4">
                            <p className="mb-1 text-sm text-gray-700">Password</p>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full border border-gray-300 rounded-md"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="mb-6">
                            <p className="mb-1 text-sm text-gray-700">Confirm Password</p>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full border border-gray-300 rounded-md"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-1" />
                        </div>

                        <div className="mb-4">
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="w-full rounded-md bg-[#087830] py-3 text-white hover:bg-[#065a25] focus:outline-none focus:ring-2 focus:ring-[#087830] focus:ring-offset-2"
                            >
                                Register
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-600">
                            Already have an account? <Link href={route('login')} className="text-[#087830] hover:text-[#065a25]">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}
