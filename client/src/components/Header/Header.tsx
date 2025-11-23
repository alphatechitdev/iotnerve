"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Menu, X, LogOut, Server, User, LayoutDashboard, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

import logo from "../../../public/assets/IoTNerve.png";
import { useAuth } from "../Context/Auth.Context";
import { useWork } from "../Context/Work.Context";

const Header = () => {
  const router = useRouter();

  const {
    setSelectedComponent,
    handleLogout,
    setSelectedProfile,
    setWorkSpaceState,
    selectedComponent,
    setLogoutFlag,
  } = useWork();

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeProfile, setActiveProfile] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<"App" | "Cloud">("App");

  // 🔥 Redirect on selected component change
  useEffect(() => {
    if (selectedComponent) router.push(`/${selectedComponent}`);
  }, [selectedComponent]);

  // 🔐 Check Authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/protected/protected-route`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setIsAuthenticated(true);
          setUserId(res.data.user_id);
        } else {
          setIsAuthenticated(false);
          setLogoutFlag(true);
          setSelectedComponent("");
          setUserId(null);
        }
      } catch (error) {
        console.error("Auth verification failed", error);
        setIsAuthenticated(false);
        setSelectedComponent("");
        setLogoutFlag(false);
        setUserId(null);
      }
    };

    checkAuth();
  }, []);

  // 👤 Fetch Profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_SERVER_URL}/profile/getProfiles`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setProfiles(res.data.profiles);
          setWorkSpaceState();

          if (res.data.profiles.length > 0) {
            const first = res.data.profiles[0];
            setSelectedProfile(first.profile_id);
            setActiveProfile(first.profile_id);
          }
        }
      } catch (error) {
        console.error("Error fetching profiles", error);
      }
    };

    fetchProfiles();
  }, [userId]);

  const handleProfileClick = (id: number) => {
    setSelectedProfile(id);
    setActiveProfile(id);
  };

  return (
    <div className="w-full flex flex-col">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center px-4 py-3 bg-gray-900 border-b border-gray-700 text-white">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-800 rounded-xl transition"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={logo} alt="IoT Nerve Logo" width={45} height={45} />
          <h2 className="text-xl font-semibold tracking-wide">IoT Nerve</h2>
        </div>

        {/* Right CTA */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg"
          >
            <LogOut size={18} /> Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1.5 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-950 text-white w-72 border-r border-gray-800 p-4 transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* PROFILES */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Your Profiles</h3>
          <div className="flex flex-col gap-2">
            {profiles.map((p) => (
              <button
                key={p.profile_id}
                onClick={() => handleProfileClick(p.profile_id)}
                className={`px-3 py-2 rounded-lg text-left transition ${
                  activeProfile === p.profile_id
                    ? "bg-blue-600"
                    : "bg-gray-800 hover:bg-gray-700"
                }`}
              >
                {p.profile_name}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR MODES */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setSidebarMode("App")}
            className={`px-3 py-1 rounded-lg ${
              sidebarMode === "App"
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            App
          </button>
          <button
            onClick={() => setSidebarMode("Cloud")}
            className={`px-3 py-1 rounded-lg ${
              sidebarMode === "Cloud"
                ? "bg-blue-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            Cloud
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-6">
          {sidebarMode === "App" ? (
            <ul className="space-y-2">
              <li
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Devices")}
              >
                <LayoutDashboard size={18} /> Devices
              </li>

              <li
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("AddDevice")}
              >
                <PlusCircle size={18} /> Add Device
              </li>

              <li
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Profiles")}
              >
                <User size={18} /> Manage Profiles
              </li>

              <li
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Server")}
              >
                <Server size={18} /> Server Access
              </li>
            </ul>
          ) : (
            <ul className="space-y-2">
              <li
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Cloud Server Address")}
              >
                Server Address
              </li>
              <li
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Cloud Credentials")}
              >
                Credentials
              </li>
              <li
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Cloud Storage")}
              >
                Storage & Backup
              </li>
              <li
                className="p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                onClick={() => setSelectedComponent("Cloud API Keys")}
              >
                API Keys
              </li>
            </ul>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default Header;
