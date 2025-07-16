import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaUserMd, FaBell, FaChartLine, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import '../styles/modern.css';

const features = [
  {
    icon: <FaRobot size={36} className="text-primary" />,
    title: 'AI Health Chatbot',
    desc: 'Get instant answers to your health questions and personalized advice 24/7.'
  },
  {
    icon: <FaUserMd size={36} className="text-accent" />,
    title: 'Find Doctors Easily',
    desc: 'Search and connect with top-rated doctors and specialists near you.'
  },
  {
    icon: <FaBell size={36} className="text-secondary" />,
    title: 'Medicine Reminders',
    desc: 'Never miss a dose with smart reminders and scheduling tools.'
  },
  {
    icon: <FaChartLine size={36} className="text-primary-dark" />,
    title: 'Track Your Progress',
    desc: 'Monitor your health stats, set goals, and see your improvements over time.'
  }
];

const sectionPad = "px-4 sm:px-6 md:px-10 lg:px-16";

const LandingPage = () => (
  <div className="relative min-h-screen w-full font-poppins bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 overflow-x-hidden">
    {/* Fixed Header */}
    <header className={`fixed top-0 left-0 w-full z-30 bg-white shadow-md border-b border-blue-100 ${sectionPad}`} style={{height: 70}}>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-full">
        <span className="text-2xl font-extrabold text-primary tracking-tight">Smart Health</span>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="btn btn-outline text-primary font-semibold rounded-full px-5 py-2 text-base shadow-sm hover:scale-105 transition-transform">Login</Link>
          <Link to="/register" className="btn btn-primary font-semibold rounded-full px-5 py-2 text-base shadow-md hover:scale-105 transition-transform">Get Started</Link>
        </div>
      </div>
    </header>
    {/* Main Content with top padding for header */}
    <main className={`flex-1 flex flex-col items-center w-full pt-28 pb-10 ${sectionPad}`}>
      {/* Hero */}
      <section className={`w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 bg-white/90 rounded-3xl shadow-xl py-14 md:py-20 mb-16 mt-2 ${sectionPad}`}>
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-neutral-900 leading-tight drop-shadow-xl">Your Personal Health Companion</h1>
          <p className="text-lg md:text-2xl text-neutral-700 mb-8">AI-powered tools, reminders, and analytics to help you live healthier every day.</p>
          <div className="w-full flex justify-center md:justify-start">
            <Link to="/register" className="btn btn-primary text-lg px-10 py-4 rounded-full shadow-xl transition-transform hover:scale-105">Join Now</Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0">
          <img src="https://images.unsplash.com/photo-1519494080410-f9aa8f52f274?auto=format&fit=crop&w=700&q=80" alt="Health technology illustration" className="rounded-2xl shadow-2xl w-full max-w-xs md:max-w-md object-cover border-4 border-white/80" style={{minHeight: 220}} />
        </div>
      </section>
      {/* About Section */}
      <section className={`w-full max-w-3xl mx-auto mb-16 ${sectionPad}`}>
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 px-6 md:px-10 py-8 md:py-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-primary">About Smart Health</h2>
          <p className="text-base md:text-lg text-neutral-700">Smart Health is your all-in-one platform for managing your health, connecting with doctors, tracking your progress, and getting instant answers to your health questions. Designed for everyone who wants to take control of their well-being with the help of modern technology.</p>
        </div>
      </section>
      {/* Features Section */}
      <section className={`w-full max-w-6xl mx-auto mb-16 ${sectionPad}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center p-7 bg-white rounded-2xl shadow-lg border border-blue-100 group hover:shadow-2xl hover:-translate-y-2 transition-all duration-200 animate-fadeIn" style={{ minHeight: 220 }}>
              <div className="mb-4 group-hover:scale-110 transition-transform duration-200">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">{f.title}</h3>
              <p className="text-neutral-600 text-base">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Screenshots/Preview (Device Mockup) */}
      <section className={`w-full max-w-3xl mx-auto mb-16 ${sectionPad}`}>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-primary">See Smart Health in Action</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-neutral-200 bg-white w-full max-w-md min-h-[200px] flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1512070679279-c2f999098c01?auto=format&fit=crop&w=520&q=80" alt="App preview" className="w-full h-full object-cover opacity-70 blur-sm" />
            <span className="absolute inset-0 flex items-center justify-center text-neutral-500 text-lg font-semibold">[ UI Preview Coming Soon ]</span>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className={`w-full max-w-2xl mx-auto mb-12 ${sectionPad}`}>
        <div className="bg-gradient-to-r from-primary/90 to-accent/80 rounded-2xl shadow-2xl px-8 py-10 md:py-14 flex flex-col md:flex-row items-center gap-8 w-full animate-fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-0 flex-1 text-center md:text-left">Ready to get started?</h2>
          <div className="flex flex-col md:flex-row gap-4 flex-1 justify-center">
            <Link to="/register" className="btn btn-primary text-lg px-8 py-3 shadow-lg transition-transform hover:scale-105 rounded-full bg-white text-primary border-2 border-primary font-bold">Create Account</Link>
            <Link to="/login" className="btn btn-outline text-white text-lg px-8 py-3 font-semibold rounded-full border-2 border-white hover:bg-white hover:text-primary transition-colors">Login</Link>
          </div>
        </div>
      </section>
    </main>
    {/* Footer */}
    <footer className={`w-full py-8 bg-white border-t border-neutral-200 text-center text-neutral-500 text-sm flex flex-col items-center gap-2 animate-fadeIn ${sectionPad}`}>
      <div className="flex gap-4 justify-center mb-2">
        <a href="#" aria-label="Facebook" className="hover:text-primary transition-colors"><FaFacebook size={20} /></a>
        <a href="#" aria-label="Twitter" className="hover:text-primary transition-colors"><FaTwitter size={20} /></a>
        <a href="#" aria-label="LinkedIn" className="hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
      </div>
      <span>&copy; {new Date().getFullYear()} Smart Health. All rights reserved.</span>
    </footer>
  </div>
);

export default LandingPage; 