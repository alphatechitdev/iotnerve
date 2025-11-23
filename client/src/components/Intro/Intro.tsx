

"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../../public/assets/IoTNerve.png";
import ATLogo from "../../../public/assets/NoTextLogo.png";
import DeviceShowcase from "../DeviceShowcase/DeviceShowcase";

export default function Intro() {
  return (
    <main className="w-full min-h-screen bg-[#0B0F19] text-white flex flex-col items-center">
      
      {/* HERO */}
      <header className="w-full max-w-6xl flex flex-col items-center text-center pt-20 pb-16 px-6">
        <Image
          src={Logo}
          alt="IoT Nerve Logo"
          priority
          className="w-40 opacity-90 hover:opacity-100 transition-all"
        />

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.4em] mt-6 text-blue-400 drop-shadow-xl">
          I O T - N E R V E
        </h1>

        {/* Device Showcase */}
        <div className="w-full mt-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-lg shadow-blue-500/10">
          <DeviceShowcase />
        </div>

        <p className="mt-8 max-w-3xl text-lg text-white/70 leading-relaxed">
          One platform. Unlimited connections. IoT Nerve is a unified web system 
          designed for developers, businesses and enthusiasts who demand clarity, speed, 
          and maximum control.
        </p>

        <p className="mt-4 max-w-3xl text-lg text-white/60">
          From smart homes to industrial automation, this hub bridges the gap between 
          <span className="text-blue-400 font-semibold"> raw data </span> 
          and 
          <span className="text-blue-400 font-semibold"> real decisions</span>.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col md:flex-row gap-5">
          <Link href="/Login">
            <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30">
              Login
            </button>
          </Link>

          <Link href="/Register">
            <button className="px-8 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all font-semibold">
              Register for Alpha Connect
            </button>
          </Link>
        </div>
      </header>


      {/* REAL-TIME MONITORING */}
      <section className="w-full max-w-5xl mt-20 text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-300">
          Real-Time Insights. Smarter Decisions.
        </h2>
        <p className="mt-4 text-white/70 max-w-3xl mx-auto">
          Alpha Connect Hub empowers you to visualize, track and analyze live IoT device data —
          from a single ESP32 to an entire industrial network.
        </p>
        <p className="mt-2 text-white/50 max-w-3xl mx-auto">
          More than a dashboard — it’s the heartbeat of your IoT environment.
        </p>
      </section>


      {/* ALPHATECH SECTION */}
      <section className="w-full max-w-6xl mt-24 mb-20 px-6">
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <Image src={ATLogo} alt="AlphaTech Logo" className="w-20 opacity-90" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mt-4">
            Powered by <span className="text-blue-400 drop-shadow">Alpha Tech</span>
          </h3>
        </div>

        <div className="max-w-4xl mx-auto text-white/70 text-lg leading-relaxed">
          <p>
            At <strong className="text-blue-300">Alpha Tech</strong>, we engineer ecosystems — 
            not just software. Our mission is to elevate global connectivity with reliable, 
            responsive and human-centered technology.
          </p>

          <p className="mt-4">
            <strong className="text-blue-300">Alpha Connect Hub</strong> uses cutting-edge protocols 
            like <strong>MQTT</strong> and live data synchronization to deliver powerful,
            secure, real-time device management.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {[
            "🧠 AI-Ready Infrastructure",
            "⚙️ Protocol-Flexible",
            "🛰️ Industry & Domestic Support",
            "🔍 Transparent Data at Scale",
          ].map((feat, idx) => (
            <div
              key={idx}
              className="p-4 text-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all shadow-md"
            >
              {feat}
            </div>
          ))}
        </div>

        <p className="text-center text-white/50 mt-10">
          Whether you manage one device or a thousand —  
          <strong className="text-blue-300"> Alpha Connect </strong>  
          gives you complete visibility.
          <br />
          <em className="text-white/40">This is only the beginning.</em>
        </p>

        <div className="text-center mt-10">
          <Link
            href="https://alphatechit.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-all text-lg font-semibold"
          >
            🚀 Explore Innovation at Alpha Tech ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
