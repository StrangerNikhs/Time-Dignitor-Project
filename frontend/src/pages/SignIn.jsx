import React, { useState } from "react";
import { signin } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signin({ email, password });
      localStorage.setItem("token", data.token);
      nav("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h2>
        <p className="text-center text-white/80 mb-6">
          Sign in to continue to your dashboard
        </p>

        <form onSubmit={handle} className="space-y-5">
          <div>
            <label className="text-white font-medium ml-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              className="w-full mt-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 
              focus:ring-2 focus:ring-white outline-none border border-white/30"
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
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-white text-purple-700 font-semibold rounded-lg 
            hover:bg-gray-100 transition shadow-md"
          >
            Sign In
          </button>
        </form>

        {err && (
          <p className="text-red-300 text-center mt-3 font-medium">{err}</p>
        )}

        <p className="text-white/90 text-center mt-5">
          Don’t have an account?{" "}
          <Link to="/signup" className="underline text-white font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
