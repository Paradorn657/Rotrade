"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Signup() {
    // สร้าง state สำหรับเก็บค่าฟอร์มและข้อผิดพลาด

    const router = useRouter();
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
        const updatedErrors = { ...errors };

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            console.log('Form submitted:', formData);

            const checkResponse = await fetch('/api/checkEmailusername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                }),
            });

            if (!checkResponse.ok) {
                const { error } = await checkResponse.json();
                
                // แสดงข้อผิดพลาดในฟอร์ม
                if (error.includes('Email')) {
                    setErrors((prev) => ({ ...prev, email: error }));
                } else if (error.includes('Username')) {
                    setErrors((prev) => ({ ...prev, username: error }));
                }

                return; // หยุดการดำเนินการถ้าพบข้อมูลซ้ำ
            }

            const respone = await fetch('api/createuser',{
                method: 'POST',
                headers:{
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    email:formData.email,
                    username:formData.username,
                    password:formData.password
                })
            })
            if(respone.ok){
                
                router.push('/signin');
            }
            else{
                console.error("Cant createuser");
            }

        } else {
            console.log('Form has errors');
        }
    };

    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-900 to-blue-900 p-4">
          <div className="flex flex-col md:flex-row  shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl transform transition-all duration-500 ">
            {/* Left Section: Form */}
            <div className="md:w-1/2 p-8 sm:p-10 bg-white/5 backdrop-blur-md border border-white/10">
              <div className="animate-fadeIn">
                <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-white">
                  Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-lime-200">RoTrade</span>
                </h2>
                <p className="text-center text-gray-50 mb-8">Create your account and start trading</p>
                
                <div className="space-y-3 mb-6">
                  <button 
                    onClick={() => signIn("google",{callbackUrl:'http://localhost:3000/'})} 
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-md hover:-translate-y-1 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                    <span className="font-medium text-white">Continue with Google</span>
                  </button>
                </div>
                
                <div className="relative flex items-center justify-center mb-8">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-50 text-sm font-medium">or continue with email</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="transform transition duration-500 hover:translate-x-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-50 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
                </div>
                
                <div className="transform transition duration-500 hover:translate-x-1">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-50 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.username}</p>}
                </div>
                
                <div className="transform transition duration-500 hover:translate-x-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-50 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={passwordVisible ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                    >
                      {passwordVisible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password}</p>}
                </div>
      
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-3 px-4 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 ${!isFormValid && 'opacity-60 cursor-not-allowed'}`}
                >
                  <span className="flex items-center justify-center">
                    Create Account
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </form>
              
              <p className="mt-8 text-sm text-center text-gray-50">
                Already have an account?{' '}
                <a href="#" className="text-white font-medium hover:text-blue-600 transition-colors relative group">
                  Sign In
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-200 group-hover:w-full transition-all duration-300"></span>
                </a>
              </p>
            </div>
            
            {/* Right Section: Promotion */}
            <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center p-8 relative overflow-hidden">
              {/* Background animation elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute w-64 h-64 rounded-full bg-indigo-400 opacity-10 -top-10 -right-10 animate-pulse"></div>
                <div className="absolute w-96 h-96 rounded-full bg-blue-400 opacity-10 -bottom-20 -left-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute w-40 h-40 rounded-full bg-purple-400 opacity-20 bottom-40 right-20 animate-pulse" style={{animationDelay: '2s'}}></div>
              </div>
              
              <div className="relative z-10 text-center max-w-md transform transition-all duration-700 hover:scale-105">
                <div className="flex justify-center mb-6 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold mb-4 [text-shadow:_0_1px_3px_rgb(0_0_0_/_.3)]">
                  Start Your Trading Journey
                </h2>
                
                <p className="text-blue-100 mb-8 leading-relaxed">
                  {`Join thousands of successful traders who have already discovered the power of RoTrade's innovative platform.`}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center transform transition duration-300 hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Real-time trading analytics</span>
                  </div>
                  
                  <div className="flex items-center transform transition duration-300 hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">AI-powered market predictions</span>
                  </div>
                  
                  <div className="flex items-center transform transition duration-300 hover:translate-x-2">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="font-medium">Fair Commission</span>
                  </div>
                </div>
                
                <div className="mt-10 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center space-x-4">
                    
                    <div className="flex-1">
                      <p className="text-sm">{`Let's`} <strong>try</strong> our Forex Robot now!!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Need to add the CSS animation classes */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out forwards;
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.05); opacity: 0.8; }
            }
            
            .animate-pulse {
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            
            .animate-bounce {
              animation: bounce 2s infinite;
            }
          `}</style>
        </div>
      );
}
