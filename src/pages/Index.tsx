
import { RegistrationForm } from "@/components/RegistrationForm";
import { Code, BookOpen, Users, MapPin } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">Code Kids</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary font-medium">Programs</a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium">About Us</a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium">Resources</a>
            <a href="#" className="text-gray-600 hover:text-primary font-medium">Contact</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Coding Lessons for Curious Minds
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Register your child for programming classes that make learning fun, creative, and engaging.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center text-gray-700">
              <BookOpen className="h-5 w-5 text-primary mr-2" />
              <span>Project-based curriculum</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Users className="h-5 w-5 text-primary mr-2" />
              <span>Small class sizes</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span>In-person & virtual options</span>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Learn to Code</h3>
            <p className="text-gray-600">
              From Scratch to Python, our curriculum scales with your child's growth and interests.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Build Projects</h3>
            <p className="text-gray-600">
              Students create games, animations, and interactive stories they can share.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grow Skills</h3>
            <p className="text-gray-600">
              Develop problem-solving and computational thinking alongside coding skills.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div id="registration" className="scroll-mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Register for Classes</h2>
          <RegistrationForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold">Code Kids</h2>
              </div>
              <p className="text-gray-400 max-w-md">
                Inspiring the next generation of innovators through coding education.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Programs</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">After School</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Weekend Camps</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Summer Intensives</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Our Team</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Code Kids. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
