
import React, { useState } from 'react';

interface Props {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; message?: string; needsVerification?: boolean }>;
  onSignup: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  onForgotPass: (email: string) => Promise<{ success: boolean; message?: string }>;
  onGoogleLogin: () => Promise<{ success: boolean; message?: string }>;
}

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT' | 'VERIFY_INFO';

const Auth: React.FC<Props> = ({ onLogin, onSignup, onForgotPass, onGoogleLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      let res: { success: boolean; message?: string; needsVerification?: boolean } = { success: false };

      switch (view) {
        case 'LOGIN':
          res = await onLogin(formData.email, formData.password);
          if (!res.success && res.needsVerification) {
            setView('VERIFY_INFO');
          }
          break;
        case 'SIGNUP':
          res = await onSignup(formData.name, formData.email, formData.password);
          if (res.success) {
            setView('VERIFY_INFO');
          }
          break;
        case 'FORGOT':
          res = await onForgotPass(formData.email);
          if (res.success) {
            setSuccess('Reset link sent to your email.');
          }
          break;
      }

      if (!res.success && res.message) setError(res.message);
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    const res = await onGoogleLogin();
    if (!res.success && res.message) setError(res.message);
    setIsLoading(false);
  };

  if (view === 'VERIFY_INFO') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-white text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">📧</div>
          <h2 className="text-2xl font-black text-gray-900">Verify Your Email</h2>
          <p className="text-gray-500 font-medium">We've sent a verification link to <span className="text-indigo-600 font-bold">{formData.email}</span>. Please click the link in your inbox to secure your account.</p>
          <div className="pt-4 space-y-3">
            <button onClick={() => setView('LOGIN')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black">Go to Login</button>
            <button onClick={() => setView('SIGNUP')} className="text-sm font-bold text-gray-400 hover:text-indigo-600">Didn't get an email? Try again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 p-10 border border-white animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4 shadow-xl shadow-indigo-100">₹</div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">RupeeFlow</h1>
          <p className="text-gray-400 font-medium text-sm mt-1">
            {view === 'LOGIN' ? 'Sign in to your account' : view === 'SIGNUP' ? 'Join RupeeFlow today' : 'Recover your account'}
          </p>
        </div>

        {(view === 'LOGIN' || view === 'SIGNUP') && (
          <div className="mb-6">
            <button 
              onClick={handleGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-5 h-5" alt="G" />
              <span>Continue with Google</span>
            </button>
            <div className="relative flex items-center justify-center my-6">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs font-black text-gray-300 uppercase tracking-widest bg-white">Or</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>
          </div>
        )}

        <form onSubmit={handleAction} className="space-y-4">
          {view === 'SIGNUP' && (
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
              <input 
                required
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              required
              type="email"
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl outline-none transition-all font-medium"
              placeholder="name@company.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {(view === 'LOGIN' || view === 'SIGNUP') && (
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                required
                type="password"
                className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-[11px] font-bold text-center bg-red-50 py-3 px-4 rounded-xl border border-red-100">{error}</p>}
          {success && <p className="text-emerald-600 text-[11px] font-bold text-center bg-emerald-50 py-3 px-4 rounded-xl border border-emerald-100">{success}</p>}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 flex items-center justify-center space-x-2"
          >
            {isLoading && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
            <span>{view === 'LOGIN' ? 'Sign In' : view === 'SIGNUP' ? 'Create Account' : 'Send Link'}</span>
          </button>
        </form>

        <div className="mt-8 space-y-3 text-center">
          {view === 'LOGIN' ? (
            <>
              <button onClick={() => setView('FORGOT')} className="block w-full text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors">Forgot password?</button>
              <button onClick={() => setView('SIGNUP')} className="text-sm font-bold text-indigo-600 hover:underline">Don't have an account? Sign up</button>
            </>
          ) : (
            <button onClick={() => setView('LOGIN')} className="text-sm font-bold text-indigo-600 hover:underline">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
