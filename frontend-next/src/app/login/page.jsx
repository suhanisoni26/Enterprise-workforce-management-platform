"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import authService from "@/services/auth.service";
import ReCAPTCHA from "react-google-recaptcha";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { login, register: registerUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [isLoginView, setIsLoginView] = useState(true);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    setValue: setLoginValue,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data.email, data.password, recaptchaToken);
      toast.success("Successfully logged in");
      
      const role = response.data.user.role;
      if (['SUPER_ADMIN', 'ORG_ADMIN', 'HR_MANAGER'].includes(role)) {
        router.push("/admin/dashboard");
      } else if (['MANAGER', 'TEAM_LEAD'].includes(role)) {
        router.push("/manager/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const onSignupSubmit = async (data) => {
    if (!recaptchaToken) {
      toast.error("Please verify you are human");
      return;
    }
    setLoading(true);
    try {
      await registerUser({ ...data, role: "EMPLOYEE" });
      toast.success("Account created successfully!");
      router.push("/employee/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const fillSandbox = (email) => {
    setIsLoginView(true);
    setLoginValue('email', email);
    setLoginValue('password', 'DemoPass@123');
    setShowSandbox(false);
    toast.success(`Sandbox loaded: ${email}`);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0a0a0b]">
      {/* Left Panel - Dark */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between relative p-12 overflow-hidden border-r border-white/5">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem'
          }}
        />

        {/* Top Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shadow-sm">
            <span className="text-black font-bold text-lg leading-none">N</span>
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">Nexora</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl mt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-indigo-500/50" />
            <span className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">
              The operating system for your workforce
            </span>
          </div>
          
          <h1 className="text-[3.5rem] leading-[1.1] font-semibold text-white tracking-tight mb-6">
            People operations,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300">
              beautifully intelligent.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 font-light leading-relaxed max-w-xl">
            Bring your people, workflows, insights, and AI into one calm, connected workspace.
          </p>

          {/* Avatars */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {['bg-indigo-500', 'bg-orange-500', 'bg-emerald-500', 'bg-gray-800'].map((color, i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0a0a0b] flex items-center justify-center text-xs font-medium text-white ${color}`}>
                  {['AM', 'SK', 'LP', '+2k'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-white">Trusted by modern teams</p>
              <p className="text-sm text-gray-500">Built for clarity. Designed to scale.</p>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="relative z-10 mt-20 pt-8 border-t border-white/10">
          <svg className="w-6 h-6 text-indigo-500 mb-4 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-gray-400 text-lg italic mb-4">
            "Nexora gave our team back the one thing every growing company needs—focus."
          </p>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">Maya Chen</span>
            <span className="text-gray-500 text-sm">VP People, Loomis</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Light */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col relative">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
          <div className="max-w-[400px] w-full mx-auto">
            
            {/* Toggle switch */}
            <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl mb-8 border border-gray-200/60 w-fit">
              <button 
                onClick={() => setIsLoginView(true)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${isLoginView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setIsLoginView(false)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${!isLoginView ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-8">
              <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3 block">
                {isLoginView ? 'Welcome back' : 'Join Nexora'}
              </span>
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
                {isLoginView ? 'Sign in to your workspace' : 'Create a new ID'}
              </h2>
              <p className="text-gray-500 text-sm">
                {isLoginView ? 'Enter your details to continue to Nexora.' : 'Fill in your details to create an employee account.'}
              </p>
            </div>

            {isLoginView ? (
              // LOGIN FORM
              <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Work email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...registerLogin("email")}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-gray-400"
                      placeholder="you@company.com"
                      suppressHydrationWarning
                    />
                  </div>
                  {loginErrors.email && <p className="text-red-500 text-xs mt-1.5">{loginErrors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...registerLogin("password")}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-gray-400"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {loginErrors.password && <p className="text-red-500 text-xs mt-1.5">{loginErrors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="keep-signed-in" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                    <label htmlFor="keep-signed-in" className="text-xs text-gray-600 cursor-pointer">
                      Keep me signed in
                    </label>
                  </div>
                  <button type="button" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                    Forgot password?
                  </button>
                </div>

                <div className="flex justify-center mt-2 mb-2">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={(val) => setRecaptchaToken(val)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || (!recaptchaToken && !showSandbox)} 
                  className="w-full bg-[#0a0a0b] hover:bg-black text-white rounded-lg py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
                >
                  {loading ? "Signing in..." : "Continue to Nexora"}
                  {!loading && <span>→</span>}
                </button>
              </form>
            ) : (
              // SIGN UP FORM
              <form onSubmit={handleSignupSubmit(onSignupSubmit)} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                    <input
                      type="text"
                      {...registerSignup("firstName")}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Jane"
                    />
                    {signupErrors.firstName && <p className="text-red-500 text-xs mt-1">{signupErrors.firstName.message}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      {...registerSignup("lastName")}
                      className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                      placeholder="Doe"
                    />
                    {signupErrors.lastName && <p className="text-red-500 text-xs mt-1">{signupErrors.lastName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Work email</label>
                  <input
                    type="email"
                    {...registerSignup("email")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="you@company.com"
                    suppressHydrationWarning
                  />
                  {signupErrors.email && <p className="text-red-500 text-xs mt-1">{signupErrors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    {...registerSignup("password")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Create a strong password"
                  />
                  {signupErrors.password && <p className="text-red-500 text-xs mt-1">{signupErrors.password.message}</p>}
                </div>

                <div className="flex justify-center mt-2 mb-2">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={(val) => setRecaptchaToken(val)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !recaptchaToken} 
                  className="w-full bg-[#0a0a0b] hover:bg-black text-white rounded-lg py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 mt-2"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <span>→</span>}
                </button>
              </form>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400">or</span>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSandbox(!showSandbox)}
                className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 rounded-lg py-3 text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Preview the workspace (Sandbox)
              </button>

              {/* Developer Sandbox Dropdown */}
              {showSandbox && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Select a Role to Preview</p>
                  <div className="flex flex-col gap-1">
                    {[
                      { label: 'Super Admin', email: 'superadmin@ewm.edu' },
                      { label: 'HR Manager', email: 'hr@ewm.edu' },
                      { label: 'Team Lead', email: 'teamlead@ewm.edu' },
                      { label: 'Employee', email: 'employee@ewm.edu' },
                    ].map((role) => (
                      <button
                        key={role.label}
                        onClick={() => fillSandbox(role.email)}
                        className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-md transition-colors flex justify-between group"
                      >
                        {role.label}
                        <span className="text-xs text-gray-400 group-hover:text-indigo-400 font-mono">{role.email}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
              By continuing, you agree to our <a href="#" className="underline hover:text-gray-800">Terms</a> and <a href="#" className="underline hover:text-gray-800">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Right Footer */}
        <div className="p-8 flex justify-between items-center w-full">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-gray-400">© 2026 Nexora, Inc.</p>
            <p className="text-[10px] font-bold tracking-widest text-indigo-400/80 uppercase">MADE BY SUHANI SONI & MOHIT YADAV</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
