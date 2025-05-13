import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
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
                        "We are all winners."
                    </div>
                    <div className="text-lg font-medium">Add something</div>
                    <div className="text-sm text-gray-200">Position</div>
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

            {/* Right column with login form */}
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

                    <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome back to Stellar.Path</h1>
                    <p className="mb-8 text-gray-600">Access your account to continue your educational journey.</p>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <div>
                        <div className="mb-4">
                            <p className="mb-1 text-sm text-gray-700">Email</p>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full border border-gray-300 rounded-md"
                                placeholder="alex.jordan@gmail.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-1" />
                        </div>

                        <div className="mb-2">
                            <p className="mb-1 text-sm text-gray-700">Password</p>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full border border-gray-300 rounded-md"
                                placeholder="••••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-1" />
                        </div>

                        <div className="mb-6 flex items-center justify-between">
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-[#087830] hover:text-[#065a25]"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="mb-4 flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-sm text-gray-600">
                                Remember sign in details
                            </span>
                        </div>

                        <div className="mb-4">
                            <button
                                onClick={submit}
                                disabled={processing}
                                className="w-full rounded-md bg-[#087830] py-3 text-white hover:bg-[#065a25] focus:outline-none focus:ring-2 focus:ring-[#087830] focus:ring-offset-2"
                            >
                                Log in
                            </button>
                        </div>
                        <div className="text-center text-sm text-gray-600">
                            Don't have an account? <Link href={route('register')} className="text-[#087830] hover:text-[#065a25]">Sign up</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
