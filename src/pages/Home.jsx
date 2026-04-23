import { useContext } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const categories = [
  { name: "Electrician", icon: "⚡" },
  { name: "Plumber", icon: "🔧" },
  { name: "Carpenter", icon: "🪚" },
  { name: "Painter", icon: "🎨" },
  { name: "Delivery", icon: "📦" },
  { name: "Cleaner", icon: "🧹" },
  { name: "AC Repair", icon: "❄️" },
];

const stats = [
  { value: "50,000+", label: "Verified Workers" },
  { value: "200,000+", label: "Jobs Completed" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "15min", label: "Avg Response Time" },
];

const features = [
  { icon: "✓", label: "Verified Workers" },
  { icon: "⚡", label: "Fast Response" },
  { icon: "💬", label: "In-App Chat" },
  { icon: "📞", label: "Masked Calling" },
];

const floatingWorkers = [
  { name: "Rajesh K.", skill: "Electrician", rating: "4.9", match: 98 },
  { name: "Priya S.", skill: "Plumber", rating: "4.7", match: 92 },
  { name: "Amit D.", skill: "Painter", rating: "4.8", match: 87 },
];

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If logged in, redirect to dashboard
  if (user?.token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-dark-bg">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-bg border border-orange-border rounded-full mb-6">
              <span className="text-orange-primary text-sm font-medium">⚡ India's #1 On-Demand Worker Platform</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Find Skilled Workers<br />
              <span className="text-orange-primary">Instantly.</span>
            </h1>

            {/* Subtext */}
            <p className="text-txt-secondary text-lg mb-8 max-w-lg">
              Post a job, get AI-matched with verified workers by skill score, hire instantly and track in real-time.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="What service do you need?"
                className="flex-1 px-4 py-3 bg-dark-input border border-dark-input-border rounded-md text-white text-sm placeholder:text-txt-muted outline-none focus:border-orange-primary"
              />
              <input
                type="text"
                placeholder="Location"
                className="sm:w-40 px-4 py-3 bg-dark-input border border-dark-input-border rounded-md text-white text-sm placeholder:text-txt-muted outline-none focus:border-orange-primary"
              />
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-orange-primary text-white font-semibold rounded-md hover:bg-orange-hover transition-all text-sm"
              >
                Search
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 5).map((cat) => (
                <span key={cat.name} className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-full text-xs text-txt-secondary hover:text-orange-primary hover:border-orange-primary/50 cursor-pointer transition-all">
                  {cat.name} →
                </span>
              ))}
            </div>
          </div>

          {/* Right - Floating worker cards */}
          <div className="hidden lg:block relative h-[400px]">
            {floatingWorkers.map((worker, idx) => (
              <div
                key={worker.name}
                className={`absolute bg-dark-card border border-dark-border rounded-md p-4 w-64 ${
                  idx === 0 ? 'top-0 right-0 animate-float' :
                  idx === 1 ? 'top-32 right-24 animate-float-delayed' :
                  'top-64 right-4 animate-float'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-primary">{worker.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{worker.name}</p>
                    <p className="text-txt-muted text-xs">{worker.skill}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-sm">⭐ {worker.rating}</span>
                  <span className="text-orange-primary text-sm font-bold">{worker.match}% Match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-orange-primary mb-1">{stat.value}</p>
                <p className="text-txt-secondary text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-dark-card border border-dark-border rounded-md p-4 text-center hover:border-orange-primary/50 hover:-translate-y-1 transition-all cursor-pointer group"
              onClick={() => navigate('/register')}
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <p className="text-sm text-txt-secondary group-hover:text-white transition-colors">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-card border border-dark-border rounded-md p-8 hover:border-orange-primary/30 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Post a Job</h3>
            <p className="text-txt-secondary text-sm mb-6">Need something done? Post a job and get matched with the best workers in your area instantly.</p>
            <Link to="/register" className="inline-block px-6 py-3 bg-orange-primary text-white font-semibold rounded-md hover:bg-orange-hover transition-all text-sm no-underline">
              Get Started →
            </Link>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-md p-8 hover:border-orange-primary/30 transition-all">
            <h3 className="text-xl font-bold text-white mb-2">Join as Worker</h3>
            <p className="text-txt-secondary text-sm mb-6">Got skills? Join 50,000+ workers earning on the platform. Build your reputation, get more jobs.</p>
            <Link to="/register" className="inline-block px-6 py-3 bg-dark-border text-white font-semibold rounded-md hover:bg-dark-lighter transition-all text-sm no-underline">
              Sign Up Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-t border-dark-border bg-dark-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feat) => (
              <div key={feat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-bg border border-orange-border flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-primary">{feat.icon}</span>
                </div>
                <span className="text-white text-sm font-medium">{feat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo + desc */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-primary rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Workly</span>
              </div>
              <p className="text-txt-secondary text-sm leading-relaxed">
                India's #1 on-demand worker marketplace. Connect with verified professionals instantly.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
              <div className="space-y-2">
                <p className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">How It Works</p>
                <p className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">Browse Jobs</p>
                <p className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">Post a Job</p>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
              <div className="space-y-2">
                {categories.slice(0, 4).map((cat) => (
                  <p key={cat.name} className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">{cat.name}</p>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <div className="space-y-2">
                <p className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">About Us</p>
                <p className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">Contact</p>
                <p className="text-txt-secondary text-sm hover:text-white cursor-pointer transition-colors">Privacy Policy</p>
              </div>
            </div>
          </div>

          <div className="border-t border-dark-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-txt-muted text-xs">© 2026 Workly. All rights reserved.</p>
            <div className="flex gap-4">
              <span className="text-txt-muted text-xs hover:text-white cursor-pointer">Terms</span>
              <span className="text-txt-muted text-xs hover:text-white cursor-pointer">Privacy</span>
              <span className="text-txt-muted text-xs hover:text-white cursor-pointer">Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
