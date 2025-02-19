import React from 'react';
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

export default function Admin() {
  const stats = [
    { title: 'Total Users', value: '203', icon: Users, color: 'bg-gradient-to-r from-blue-500 to-blue-600', growth: '+12.5%' },
    { title: 'Total Commission', value: '$2,000', icon: DollarSign, color: 'bg-gradient-to-r from-green-500 to-green-600', growth: '+8.2%' },
    { title: 'Total MT5 Account', value: '105', icon: BarChart2, color: 'bg-gradient-to-r from-purple-500 to-purple-600', growth: '+15.3%' },
    { title: 'Running Robot', value: '40', icon: Bot, color: 'bg-gradient-to-r from-orange-500 to-orange-600', growth: '+5.7%' }
  ];

  const users = [
    { id: 1, email: 'Paradorn657@gmail.com', username: 'Paradorn657', createDate: '24/01/2025', role: 'user', status: 'active' },
    { id: 2, email: 'Paradorn657@gmail.com', username: 'Paradorn657', createDate: '24/01/2025', role: 'user', status: 'inactive' },
    { id: 3, email: 'Paradorn657@gmail.com', username: 'Paradorn657', createDate: '24/01/2025', role: 'user', status: 'active' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-8">
      {/* Page Header */}
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
                Admin Paradorn657
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
        {stats.map((stat, index) => (
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.createDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
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
                        <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-100">
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