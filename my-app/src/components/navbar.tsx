import { useState } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  window.addEventListener('scroll', () => {
    setScrolled(window.scrollY > 20);
  });

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/generate', label: 'Generate' },
    { path: '/about', label: 'About' },
    { path: '/support', label: 'Support' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'glass py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-purple-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <FileText className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            PDFree
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`text-sm font-medium transition-colors ${
                isActive(path)
                  ? 'text-purple-600 font-semibold'
                  : 'text-slate-600 hover:text-purple-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/generate"
            className="px-5 py-2.5 glass bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-700 text-sm font-semibold rounded-full hover:from-purple-600/30 hover:to-pink-600/30 transition-all active:scale-95 shadow-lg shadow-purple-200/20"
          >
            Start Free
          </Link>
        </div>

        <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass mt-4 mx-4 rounded-xl">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm font-medium text-slate-600 hover:text-purple-600"
              >
                {label}
              </Link>
            ))}
            <Link to="/login" className="block text-sm font-medium text-slate-600">
              Log in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
