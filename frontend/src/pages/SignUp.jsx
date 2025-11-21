import React, { useState } from "react";
import { signup } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup({ name, email, password });
      setMsg("Account created successfully! Redirecting to Sign In...");
      setTimeout(() => nav("/signin"), 1200);
    } catch (error) {
      setErr(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-teal-500 to-cyan-500 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account ✨
        </h2>
        <p className="text-center text-white/80 mb-6">
          Join us and start using your dashboard
        </p>

        <form onSubmit={handle} className="space-y-5">
          <div>
            <label className="text-white font-medium ml-1">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 
                focus:ring-2 focus:ring-white outline-none border border-white/30"
              required
            />
          </div>

          <div>
            <label className="text-white font-medium ml-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 
                focus:ring-2 focus:ring-white outline-none border border-white/30"
              required
            />
          </div>

          <div>
            <label className="text-white font-medium ml-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 
                focus:ring-2 focus:ring-white outline-none border border-white/30"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-teal-700 font-semibold rounded-lg 
            hover:bg-gray-100 transition shadow-md"
          >
            Sign Up
          </button>
        </form>

        {msg && (
          <p className="text-green-200 text-center mt-4 font-medium">{msg}</p>
        )}
        {err && (
          <p className="text-red-300 text-center mt-4 font-medium">{err}</p>
        )}

        <p className="text-white/90 text-center mt-5">
          Already have an account?{" "}
          <Link to="/signin" className="underline text-white font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
