import React from "react";

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to Your Store Analytics
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Gain insights, track performance, and grow your business with powerful
          analytics tools.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded shadow hover:bg-blue-100 transition">
            Get Started
          </button>
          <button className="bg-transparent border border-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-blue-700 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
