"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/assets/IoTNerve.png";
import ATLogo from "../../../public/assets/NoTextLogo.png";
import DeviceShowcase from "../DeviceShowcase/DeviceShowcase";

export default function Intro() {
  return (
    <main className="w-full min-h-screen bg-[#F8FAFC] text-slate-700 flex flex-col items-center">

      {/* HERO */}
      <header className="w-full max-w-6xl mx-auto flex flex-col items-center pt-28 pb-24 px-6">

        {/* Soft Background Gradient */}
        <div className="absolute top-0 inset-x-0 h-[550px] bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

        {/* Logo */}
        <Image
          src={Logo}
          alt="IoT Nerve Logo"
          priority
          className="w-48 opacity-95 rounded-full drop-shadow-sm"
        />

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mt-8 tracking-tight text-slate-900 text-center">
          IoT Nerve
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg md:text-xl max-w-2xl text-slate-500 leading-relaxed text-center">
          A unified IoT operations suite for developers and businesses.  
          Connect, visualize, and control your devices with clarity and precision.
        </p>

        {/* Device Showcase */}
        <div className="w-full max-w-4xl mt-16 rounded-3xl bg-white shadow-xl border border-slate-200 p-6">
          <DeviceShowcase />
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col md:flex-row gap-4">
          <Link href="/Auth/Login">
            <button className="px-10 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-semibold shadow hover:shadow-md">
              Login
            </button>
          </Link>

          <Link href="/Auth/Register">
            <button className="px-10 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 transition-all font-semibold">
              Register for Alpha Connect
            </button>
          </Link>
        </div>
      </header>



      {/* REAL-TIME SECTION */}
      <section className="w-full max-w-5xl mt-24 text-center px-6">
        <h2 className="text-4xl font-bold text-slate-900">
          Real-Time Intelligence
        </h2>

        <p className="mt-4 text-slate-500 max-w-3xl mx-auto text-lg">
          Alpha Connect Hub transforms raw IoT signals into actionable live insights — 
          whether you're managing smart homes or industrial infrastructure.
        </p>

        <p className="mt-2 text-slate-400">
          Observe, analyze & act instantly.  
          <span className="text-blue-600 font-semibold">Every second matters.</span>
        </p>
      </section>

    </main>
  );
}
