"use client"
import React, { useState } from 'react';

export default function Signup() {
    // สร้าง state สำหรับเก็บค่าฟอร์มและข้อผิดพลาด

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const [errors, setErrors] = useState({
        email: '',
        username: '',
        password: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);

    // ฟังก์ชันสำหรับการจัดการการเปลี่ยนแปลงของ input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // ตรวจสอบข้อผิดพลาด
        validateForm(name, value);
    };

    // ฟังก์ชันตรวจสอบข้อผิดพลาดแบบ realtime
    const validateForm = (name: string, value: string) => {
        let updatedErrors = { ...errors };

        switch (name) {
            case 'email':
                updatedErrors.email = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
                    ? ''
                    : 'Please enter a valid email';
                break;
            case 'username':
                updatedErrors.username = value.length >= 3 ? '' : 'Username must be at least 3 characters';
                break;
            case 'password':
                updatedErrors.password = value.length >= 6 ? '' : 'Password must be at least 6 characters';
                break;
            default:
                break;
        }

        // ตรวจสอบฟอร์มทั้งหมดว่าผ่านการตรวจสอบหรือไม่
        setErrors(updatedErrors);
        checkFormValidity(updatedErrors);
    };

    // ตรวจสอบสถานะความถูกต้องของฟอร์ม
    const checkFormValidity = (errors: any) => {
        const isValid = Object.values(errors).every((error) => error === '');
        setIsFormValid(isValid);
    };

    // ฟังก์ชันสำหรับการ submit ฟอร์ม
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('Form submitted:', formData);
        } else {
            console.log('Form has errors');
        }
    };

    const handleContinuewithGoogle =() =>{
        console.log("google")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
                {/* Left Section: Form */}
                <div className="md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create account</h2>
                    <div className="flex items-center justify-center mb-2">
                        <button onClick={handleContinuewithGoogle} className="h-8 flex items-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 mr-2 ">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                <path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                    <p className="text-center text-gray-500 mb-4">or use your email for registration</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}  // เปลี่ยน type จาก password เป็น text หรือกลับกัน
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-2.5 text-gray-500"
                                >
                                    {passwordVisible ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${!isFormValid && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Create account
                        </button>
                    </form>
                    <p className="mt-4 text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                            Sign In
                        </a>
                    </p>
                </div>
                {/* Right Section: Promotion */}
                <div className="md:w-1/2 bg-blue-100 flex items-center justify-center p-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started with RoTrade</h2>
                        <p className="text-gray-600">Join us and start your journey today!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
