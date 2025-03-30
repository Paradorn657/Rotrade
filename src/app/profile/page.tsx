"use client";
import { Pocket, Save } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { MouseEvent, useEffect, useState } from 'react';

import { toast, Toaster } from 'react-hot-toast';


export default function Profile() {
    const { data: session,status ,update} = useSession()
    const isGoogleLogin = session?.user.provider === "google";

    const [username, setUsername] = useState(status == "loading" ? "loading" :session?.user.name);

    useEffect(() => {
        if (session?.user?.name) {
          setUsername(session.user.name); // ตั้งค่าชื่อผู้ใช้เมื่อ session โหลดเสร็จ
        }
      }, [session]);

    // สำหรับการเปลี่ยนรหัสผ่าน
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    console.log("isGoogleLogin", isGoogleLogin)


    const handleSave = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) =>{
        e.preventDefault();
        if(session?.user.name == username){ //ไม่ได้เปลี่ยน
            toast.success("Updated Information !", { duration: 5000 });
        }
        else{
            console.log(username)
            try{
            const response = await fetch('/api/updateuser',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    userId:session?.user.id,
                    newUsername:username,
                })
            })
            await response.json();
            if (response.ok) {
                toast.success("Updated Information !", { duration: 3000 });
                // toast.success("You need to rel!", { duration: 5000 });
                await update();
            }   
            else {
                toast.error("Error updating user information from Api!", { duration: 5000 });
            }
        }
        catch(error){
            console.error(error);
            toast.error("Error updating user information!", { duration: 5000 });

        }
        }
        
    }

    const handleChangePassword = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) =>{
        e.preventDefault();
        if(newPassword != confirmPassword){ //ไม่ได้เปลี่ยน
            toast.error("Confirm Password Not Match!", { duration: 5000 });
        }
        else{
            try{
            const response = await fetch('/api/updateuser',{
                method:'PATCH',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({
                    userId:session?.user.id,
                    newPassword:newPassword,
                    password:currentPassword,
                })
            })
            const data = await response.json();
            if (response.ok) {
                toast.success("Updated Password !", { duration: 3000 });
                await update();
            }   
            else if(data.error){
                toast.error(data.error, { duration: 5000 });
            }
        }
        catch(error){
            console.error(error);
            toast.error("Error updating user Password information!", { duration: 5000 });

        }
        }
        
    }

 

    return (
        <section className="bg-white dark:bg-gray-900">
            <Toaster position="top-center" reverseOrder={true} />
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                <h2 className={`mb-4 text-xl font-bold ${session?.user.role === 'user' ? 'text-blue-500' : 'text-green-500'} dark:text-white`}>
                    Personal Information {session?.user.role === 'user' ? '(User)' : '(Admin)'}
                </h2>
                <form>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">

                        {/* Email (Read-Only) */}
                        <div className="sm:col-span-2">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input
                                disabled
                                type="text"
                                name="email"
                                id="email"
                                className="bg-gray-50 border border-gray-300 text-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={status === "loading" ? "loading" : session?.user.email}
                                readOnly
                            />
                        </div>

                        {/* Username (Half Width) */}
                        <div className="w-full sm:col-span-1">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                            />
                        </div>

                        {/* Account Creation Date (Read-Only) */}
                        <div className="w-full sm:col-span-1">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Created</label>
                            <input
                                type="text"
                                name="createdAt"
                                id="createdAt"
                                className="bg-gray-50 border border-gray-300 text-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                value={new Date(session?.user.createDate || new Date())
                                    .toLocaleDateString('th-TH')
                                    .replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, (match, day, month, year) => {
                                        const gregorianYear = parseInt(year) - 543; // แปลงปีพุทธศักราชเป็นคริสต์ศักราช
                                        return `${day}/${month}/${gregorianYear}`;
                                    }) + ' ' + new Date(session?.user.createDate || new Date()).toLocaleTimeString('th-TH')}
                                readOnly
                            />
                        </div>

                        <div className="flex items-center space-x-4 mt-6">
                            <button onClick={(e) => handleSave(e)} type="submit" className="h-10 flex items-center text-white bg-blue-700 hover:bg-blue-400  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5">
                                <Save />
                                <span className="ml-2">Save</span>
                            </button>
                        </div>





                        {/* Change Password Section */}
                        {!isGoogleLogin &&
                            (
                                < div className="sm:col-span-2 mt-2">
                                    <hr className="h-px my-6 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Change Password</h3>

                                    {/* Current Password */}
                                    <div className="w-full">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            id="currentPassword"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter your current password"
                                        />
                                    </div>

                                    {/* New Password */}
                                    <div className="w-full mt-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            id="newPassword"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password"
                                        />
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="w-full mt-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                        />
                                    </div>
                                </div>
                            )}

                    </div>

                    {/* Save Button */}
                    {!isGoogleLogin && (
                    <div className="flex items-center space-x-4 mt-6">
                        <button onClick={handleChangePassword} className="h-10 flex items-center text-white bg-blue-700 hover:bg-blue-400 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5">
                            <Pocket />
                            <span className="ml-2">Change</span>
                        </button>
                    </div>
                    )}
                </form>
            </div >
        </section >
    );
}




