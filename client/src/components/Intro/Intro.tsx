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



      {/* ALPHA TECH BLOCK */}
      <section className="w-full max-w-6xl mt-28 mb-24 px-6">

        {/* Logo & Title */}
        <div className="text-center mb-14">
          <Image src={ATLogo} alt="Alpha Tech" className="w-20 mx-auto opacity-95" />
          <h3 className="text-3xl md:text-4xl font-bold mt-6 text-slate-900">
            Powered by <span className="text-blue-600">Alpha Tech</span>
          </h3>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto text-slate-600 text-lg leading-relaxed text-center">
          <p>
            <strong className="text-blue-600">Alpha Tech</strong> builds scalable, human-centered systems engineered for reliability, security and global connectivity.
          </p>

          <p className="mt-6">
            The <strong className="text-blue-600">Alpha Connect Hub</strong> uses secure MQTT pipelines, device credentials, and real-time synchronization for seamless IoT management.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-14">
          {[
            { icon: "🧠", label: "AI-Optimized Infrastructure" },
            { icon: "⚙️", label: "Protocol-Flexible Systems" },
            { icon: "📡", label: "Industrial & Home IoT" },
            { icon: "🔍", label: "Transparent Analytics" },
          ].map((feat, i) => (
            <div
              key={i}
              className="p-6 text-center rounded-xl bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow transition-all"
            >
              <div className="text-3xl mb-3">{feat.icon}</div>
              <div className="font-semibold text-slate-700">{feat.label}</div>
            </div>
          ))}
        </div>

        {/* Final Note */}
        <p className="text-center text-slate-500 mt-12 text-lg">
          Total visibility. Total control.
          <br />
          <em className="text-slate-400">You’re building the future — we power it.</em>
        </p>

        {/* External Link */}
        <div className="text-center mt-10">
          <Link
            href="https://alphatechit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-500 font-semibold text-lg hover:underline"
          >
            🚀 Visit Alpha Tech →
          </Link>
        </div>

      </section>

    </main>
  );
}
