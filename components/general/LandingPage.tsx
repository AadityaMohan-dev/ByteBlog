import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { ArrowRight, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="space-y-16 md:space-y-20">
      {/* HERO SECTION */}
      <section className="relative flex flex-col md:flex-row justify-between gap-10 min-h-[400px] md:min-h-[500px]">
        {/* Left Side */}
        <div className="bg-green-950 text-white mt-10 p-8 md:p-10 rounded-lg flex flex-col gap-6 md:w-full lg:w-[65%] shadow-2xl hover:shadow-green-900/20 transition-shadow duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-green-400" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Byte Blog
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-light text-green-100">
            Where ideas become digital sparks.
          </h2>

          <p className="text-gray-200 text-base md:text-lg leading-relaxed max-w-2xl">
            A space crafted for builders, creators, and curious minds—breaking
            down complex tech into bite-sized insights. From code to creativity,
            we capture the bytes that shape tomorrow.
          </p>

          <SignInButton mode="modal">
            <button
              className="bg-green-100 text-green-950 w-fit px-6 py-3 rounded-lg text-lg md:text-xl font-semibold hover:bg-green-200 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg group"
              aria-label="Start your blogging journey"
            >
              Start your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignInButton>
        </div>

        {/* Right Image */}
        <div className="absolute top-5 right-0 hidden lg:block pointer-events-none">
          <Image
            src="/img4.png"
            alt="Creative blog illustration showing digital content creation"
            width={450}
            height={350}
            className="drop-shadow-2xl animate-float"
            priority
          />
        </div>
      </section>

      {/* FEATURES SECTION (Optional Addition) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-green-700" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Share Ideas</h3>
          <p className="text-gray-600">
            Express your thoughts and insights with a global community of
            tech enthusiasts.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-blue-700" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect & Grow</h3>
          <p className="text-gray-600">
            Network with fellow creators and learn from diverse perspectives.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <ArrowRight className="w-6 h-6 text-purple-700" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Publishing</h3>
          <p className="text-gray-600">
            Simple, intuitive tools to bring your stories to life in minutes.
          </p>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="bg-gradient-to-br from-blue-950 to-blue-900 rounded-lg text-white px-8 md:px-14 py-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
        {/* Left Image */}
        <div className="hidden md:block flex-shrink-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <Image
              src="/img3.png"
              alt="Engaged community of bloggers collaborating and sharing ideas"
              width={300}
              height={300}
              className="relative border-4 border-white/10 rounded-lg shadow-xl"
            />
          </div>
        </div>

        {/* Right Text */}
        <div className="max-w-3xl space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Join Our Blogging Community
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-blue-100 leading-relaxed">
            Dive into a world where your voice matters. Share your stories,
            insights, and expertise with a vibrant community of readers and
            fellow bloggers. Whether you're a seasoned writer or just starting
            out, Byte Blog offers the perfect platform to connect, inspire, and
            grow together.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-100">Active Community</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-100">Expert Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-blue-100">Growth Opportunities</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}