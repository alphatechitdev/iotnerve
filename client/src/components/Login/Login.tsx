"use client";

import axios, { AxiosError } from "axios";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../Context/Auth.Context";
import ConnectingWindow from "../LoadingWindows/ConnectingWindow";
import { LoginData, LoginError, BackendResponse } from "@/types/loginData.types";

const Login: React.FC = () => {
  const { setIsAuthenticated } = useAuth();
  const router = useRouter();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginError>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setSuccessMessage("Logging You In...");
      setErrors({});

      const response = await axios.post<BackendResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/auth/login`,
        loginData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const data = response.data;

      if (data.success) {
        setSuccessMessage("Login Successful");
        setIsAuthenticated(true);
        router.push("/Devices");
        return;
      }

      if (!data.account) {
        setErrors({ Login: "Account Not Found" });
      } else {
        setErrors({ Login: "Invalid Password" });
      }
    } catch (err) {
      setSuccessMessage("");

      const error = err as AxiosError<{ message?: string }>;

      if (error.response) {
        setErrors({
          Login: error.response.data?.message || "Unknown Error From Server",
        });
      } else if (error.request) {
        setErrors({ Login: "No Response From Server" });
      } else {
        setErrors({ Login: "Unexpected Error While Logging In" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-md bg-white backdrop-blur-lg rounded-xl p-8 shadow-xl border border-slate-200">

        <h1 className="text-2xl font-semibold text-black text-center mb-6">
          Login to Alpha Connect Hub
        </h1>

        <Link href="/" className="flex justify-center mb-4">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
            Visit Main Page
          </button>
        </Link>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              value={loginData.email}
              onChange={handleChange}
              placeholder="Enter Email..."
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-gray-300">Password</label>
            <input
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter Password..."
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {successMessage && (
            <p className="text-green-400 text-sm text-center">{successMessage}</p>
          )}

          {errors.Login && (
            <p className="text-red-400 text-sm text-center">{errors.Login}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg text-white font-semibold transition"
          >
            {isLoading ? "Logging In..." : "Login"}
          </button>

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <ConnectingWindow />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
