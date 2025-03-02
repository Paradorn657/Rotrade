"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // ใช้ค่าใหม่ที่เพิ่งอัปเดต เพื่อลดปัญหา async
        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };
    
            validateForm(name, value, updatedFormData);
            return updatedFormData;
        });
    };

    const validateForm = (name: string, value: string, updatedFormData: { email: string; password: string; }) => {
        let updatedErrors = { ...errors };

        switch (name) {
            case 'email':
                updatedErrors.email = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
                    ? ''
                    : 'Please enter a valid email';
                break;
            case 'password':
                updatedErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
                break;
            default:
                break;
        }

        setErrors(updatedErrors);
        checkFormValidity(updatedErrors, updatedFormData);
    };

    const checkFormValidity = (errors: any, updatedFormData: any) => {
        const isValid = Object.values(errors).every((error) => error === '') && 
                       updatedFormData.email.length > 0 && updatedFormData.password.length >= 6;
        setIsFormValid(isValid);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            setIsLoading(true);
            setAuthError('');

            try {
                const signInData = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false
                });
                
                if (signInData?.error) {
                    setAuthError('Invalid email or password. Please try again.');
                    console.log(signInData.error);
                } else {
                    // revalidatePath('/Dashboard');
                    router.push('/Dashboard');
                }
            } catch (error) {
                setAuthError('An error occurred. Please try again later.');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-900 to-blue-900">
            {/* Floating animated shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-1/4 right-[120px] w-14 h-14 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                <div className="absolute top-2/3 right-2/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2500"></div>
                <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
            </div>
            
            <div className="flex flex-col md:flex-row bg-white/5 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl border border-white/10 relative z-10">
                {/* Left Section: Promotion */}
                <div className="md:w-1/2 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-indigo-800/90 flex flex-col items-center justify-center p-12 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Glass morphism elements */}
                        <div className="absolute w-40 h-40 rounded-full bg-white/10 backdrop-blur-sm top-10 left-10 border border-white/20"></div>
                        <div className="absolute w-28 h-28 rounded-full bg-white/5 backdrop-blur-sm bottom-20 right-10 border border-white/10"></div>
                        <div className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm top-40 right-20 border border-white/10"></div>
                        <div className="absolute w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
                    </div>
                    
                    <div className="text-center z-10 relative">
                        <div className="flex items-center justify-center mb-8">
                            <div className="h-20 w-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20 transform rotate-12">
                                <div className="h-16 w-16 bg-white/90 rounded-xl flex items-center justify-center shadow-inner transform -rotate-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">RoTrade Forex</h2>
                        <h3 className="text-xl font-medium text-blue-100 mb-6">Automated Trading System</h3>
                        <p className="text-blue-100 mb-10 max-w-sm mx-auto">Maximize your trading potential with our advanced algorithmic trading solution powered by cutting-edge technology.</p>
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 transform transition-all duration-300 hover:translate-y-[-5px] hover:bg-white/15">
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/80 flex items-center justify-center mr-4 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white font-medium text-lg">Advanced Trading Algorithms</span>
                            </div>
                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 rounded-xl bg-indigo-500/80 flex items-center justify-center mr-4 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white font-medium text-lg">Real-time Market Analysis</span>
                            </div>
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-xl bg-purple-500/80 flex items-center justify-center mr-4 shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-white font-medium text-lg">24/7 Automated Trading</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section: Login Form */}
                <div className="md:w-1/2 p-10 bg-white/5 backdrop-blur-md">
                    <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>
                    <p className="text-center text-gray-300 mb-8">Log in to your account to access your trading dashboard</p>
                    
                    <div className="space-y-6">
                        <div className="flex flex-col space-y-3">
                            <button 
                                onClick={() => signIn("google", { callbackUrl: '/Dashboard' })} 
                                className="w-full flex items-center justify-center px-4 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/15 transition-all duration-300 text-white group"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 mr-3">
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                </svg>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">Continue with Google</span>
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-500/30"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-transparent text-gray-300 backdrop-blur-sm">or continue with email</span>
                            </div>
                        </div>

                        {authError && (
                            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 text-red-200 px-4 py-3 rounded-xl flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {authError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3.5 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                                        placeholder="Your email address"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type={passwordVisible ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-12 py-3.5 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-300"
                                        placeholder="Your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                                    >
                                        {passwordVisible ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <input
                                            id="remember_me"
                                            name="remember_me"
                                            type="checkbox"
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-500/50 rounded bg-white/10 checked:bg-blue-600 transition-colors duration-200"
                                        />
                                    </div>
                                    <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-300">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div> */}

                            <button
                                type="submit"
                                disabled={!isFormValid || isLoading}
                                className={`w-full flex justify-center items-center py-3.5 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ${(!isFormValid || isLoading) ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-2px]'}`}
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Sign In'}
                                {!isLoading && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-300 mt-8">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors duration-300">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Add animated style */}
            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -30px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}