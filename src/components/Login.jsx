import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useUser();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const navigate = useNavigate();

  useEffect(() => {
    // Add auth-page class to root element
    document.getElementById('root').classList.add('auth-page');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.getElementById('root').classList.remove('auth-page');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      // Sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      // Redirect based on email
      if (formData.email === 'admin@health.com') {
        navigate('/admin', { replace: true });
      } else {
      navigate(from, { replace: true });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-modern px-4 py-8 login-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%' }}>
      <div className="w-full max-w-2xl mx-auto login-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}> {/* Changed max-w-md to max-w-2xl for laptop view */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-full bg-primary shadow-neumorph text-white text-3xl font-bold mb-4 backdrop-blur-md">
            <span role="img" aria-label="logo">🧺</span>
          </div>
          <h2 className="text-3xl font-extrabold text-neutral-900 drop-shadow-lg">
            Sign in to <span className="text-primary">Smart Health</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary-dark underline"
            >
              create a new account
            </Link>
          </p>
        </div>
        <div className="card card-modern p-12 shadow-neumorph-lg"> {/* Increased padding to p-12 for desktop look */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="alert alert-error animate-shake">
                {errors.general}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email address
                </label>
                <span className="absolute left-3 top-9 text-neutral-400">
                  <FaEnvelope />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input input-dark w-full pl-10 rounded-xl shadow-neumorph focus:ring-2 focus:ring-primary/60 focus:outline-none transition-all duration-200 ${errors.email ? 'border-error ring-error' : ''}`}
                  placeholder="Enter your email"
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-error font-semibold animate-shake">{errors.email}</p>
                )}
              </div>
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <span className="absolute left-3 top-9 text-neutral-400">
                  <FaLock />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-dark w-full pl-10 rounded-xl shadow-neumorph focus:ring-2 focus:ring-primary/60 focus:outline-none transition-all duration-200 ${errors.password ? 'border-error ring-error' : ''}`}
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-error font-semibold animate-shake">{errors.password}</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded shadow-neumorph-sm"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary-dark underline">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full rounded-xl shadow-neumorph-lg hover:scale-[1.02] transition-transform duration-150"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-neutral-600">
                Demo credentials: Any email and password (min 6 chars)
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-primary/30 via-white/40 to-secondary/30 backdrop-blur-2xl"></div>
    </div>
  );
};

export default Login;