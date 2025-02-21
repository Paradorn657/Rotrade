"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Users,
  DollarSign,
  BarChart2,
  Bot,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Search,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSession } from 'next-auth/react';

import { toast, Toaster } from 'react-hot-toast';

const LoadingHeader = () => (
  <div className="mb-10">
    <div className="flex items-center space-x-4 mb-8">
      <div className="h-14 w-1.5 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
      <div className="space-y-2 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-4 w-64 bg-gray-100 rounded-lg" />
      </div>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-lg bg-opacity-90">
      <div className="flex items-center justify-between">
        <div className="space-y-2 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>
        <div className="w-64 h-10 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

const LoadingStatsCard = () => (
  <Card className="hover:shadow-xl transition-all duration-300 backdrop-blur-lg bg-white bg-opacity-90">
    <CardContent className="p-6">
      <div className="flex items-center justify-between animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gray-200 h-12 w-12" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </div>
    </CardContent>
  </Card>
);

const LoadingTable = () => (
  <Card className="overflow-hidden shadow-xl backdrop-blur-lg bg-white bg-opacity-90">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="p-2 bg-gray-200 rounded-lg h-10 w-10" />
          <div className="h-6 w-48 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            {['ID', 'Email', 'Username', 'Create Date', 'Role', 'Actions'].map((header) => (
              <th key={header} className="px-6 py-4 text-left">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <td key={j} className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);



export default function Admin() {
  const { data: session  } = useSession();
  console.log("session at admin", session);
  const [stats, setStats] = useState<any>([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/getinfoForAdmin");
      const data = await response.json();
      
      if (response.ok) {
        // เปลี่ยนการตั้งค่าของ stats และ users ให้ตรงกับข้อมูลที่ได้รับจาก API
        setStats([
          { title: 'Total Users', value: data.totalUsers, icon: Users, color: 'bg-gradient-to-r from-blue-500 to-blue-600', growth: `+${data.userGrowth.toFixed(1)}%` },
          { title: 'Total Commission', value: data.totalCommission._sum.Balance?.toFixed(1), icon: DollarSign, color: 'bg-gradient-to-r from-green-500 to-green-600', growth: `+${data.commissionGrowth.toFixed(1)}%` },
          { title: 'Total MT5 Account', value: data.totalMT5Accounts, icon: BarChart2, color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
          { title: 'Running Robot', value: data.runningRobots, icon: Bot, color: 'bg-gradient-to-r from-orange-500 to-orange-600' }
        ]);
        console.log("data",data.usersDB)
        setUsers(data.usersDB);
      } else {
        console.error("Failed to fetch data", data.error);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }finally {
      setIsLoading(false);
    }

  };

  

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8">
        <Toaster position="top-center" />
        <LoadingHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <LoadingStatsCard key={i} />
          ))}
        </div>
        <LoadingTable />
      </div>
    );
  }
  

 
  const deleteUser = async (userid: Number) => {
      try{
        const response = await fetch("/api/DeleteUser",{
          method:"DELETE",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({userid})
        });

        const data = await response.json()
        console.log("data respone",data)


        if(response.ok){
          console.log("User deleted successfully:")
          toast.success(`User ${data.user.name} deleted successfully`)
          fetchData();
        }else{
          toast.error(`Cannot Delete User ${data.user.name} , Something went wrong`)
        }

      }catch(error){

      }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8">
      {/* Page Header */}

      <Toaster position="top-center" />
      <div className="mb-10">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-14 w-1.5 bg-gradient-to-b from-blue-600 to-blue-400 rounded-full" />
          <div>
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Admin page</h1>
            <p className="text-gray-600 mt-1">Monitor and manage your system</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 backdrop-blur-lg bg-opacity-90">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Welcome back,</p>
              <h2 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin {session?.user.name}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat:any, index:any) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg bg-white bg-opacity-90">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
                <div className="text-green-500 text-sm font-semibold">
                  {stat.growth}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden shadow-xl backdrop-blur-lg bg-white bg-opacity-90">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Users Management</h3>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add User</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Create Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user:any) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(user.create_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className ={`px-3 py-1 text-xs font-semibold rounded-full ${user.role === 'BAN' ? 'bg-red-100 text-red-800':'bg-blue-100 text-blue-600'}  ` }>
                      {user.role}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:outline-none">
                        <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100">
                          <Eye className="w-4 h-4 text-blue-600" />
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100">
                          <Edit className="w-4 h-4 text-green-600" />
                          <span>Edit User</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100" onClick={() => deleteUser(user.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Delete User</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}