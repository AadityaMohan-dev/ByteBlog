import {  SignInButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <> 
    <main className="space-y-5">

      {/* HERO SECTION */}
      <section className="relative flex flex-col md:flex-row  justify-between gap-10">
        {/* Left Side */}
        <div className="bg-green-950 text-white mt-10 p-8 rounded-lg flex flex-col gap-4 md:w-[100%]">
          <h1 className="text-5xl font-semibold">Byte Blog</h1>
          <h2 className="text-3xl font-light">
            Where ideas become digital sparks.
          </h2>

          <p className="text-gray-200 md:max-w-4xl">
            A space crafted for builders, creators, and curious minds—breaking down complex tech into bite-sized insights.
            From code to creativity, we capture the bytes that shape tomorrow.
          </p>

          <SignInButton mode="modal">
            <div id="btn" className="bg-green-100 text-green-950 w-fit px-5 py-2 cursor-pointer rounded-lg text-xl font-semibold">Star your Journey</div>
          </SignInButton>
        </div>

        {/* Right Image */}
        <div className="absolute  top-5 right-0  hidden md:block">
          <Image
            src="/img4.png"
            alt="blog-illustration"
            width={450}
            height={350}
            className="drop-shadow-xl"
          />
        </div>
      </section>


      {/* COMMUNITY SECTION */}
      <section className="bg-blue-950 rounded-lg text-white px-8 md:px-14 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Image */}
        <div className="hidden md:block">
          <Image
            src="/img3.png"
            alt="blog-community"
            width={300}
            height={300}
            className="border rounded-lg bg-white shadow-lg"
          />
        </div>

        {/* Right Text */}
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6">
            Join Our Blogging Community
          </h2>
          <p className="md:text-xl text-gray-200 leading-relaxed">
            Dive into a world where your voice matters. Share your stories, insights, and expertise with a
            vibrant community of readers and fellow bloggers. Whether you're a seasoned writer or just
            starting out, Byte Blog offers the perfect platform to connect, inspire, and grow together.
          </p>
        </div>
      </section>

    </main>
    </>
  );
}
