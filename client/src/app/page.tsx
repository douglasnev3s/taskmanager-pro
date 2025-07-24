import { CheckCircle, Users, Calendar, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            TaskManager Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional task management application built with Next.js 15, Express, and MongoDB
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Management</h3>
            <p className="text-gray-600">Create, organize, and track your tasks efficiently</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Work together seamlessly with your team</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Planning</h3>
            <p className="text-gray-600">Plan and schedule your projects effectively</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <BarChart3 className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-gray-600">Track progress with detailed analytics</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                1
              </div>
              <span className="text-gray-700">MongoDB is running on localhost:27017</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                2
              </div>
              <span className="text-gray-700">Client is running on localhost:3000</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                3
              </div>
              <span className="text-gray-700">Server will run on localhost:5000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}