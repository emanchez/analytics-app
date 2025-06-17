"use client";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import Hero from "@/components/store/Hero";
import Featured from "@/components/store/Featured";

export default function Store() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <Featured />

      {/* All Products Preview Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black  mb-4">
              Browse All Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our full collection of products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow trackable"
              id="electronics-category"
            >
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Electronics</h3>
              <p className="text-gray-600 mb-4">Latest gadgets and tech</p>
              <button className="text-blue-600 font-medium hover:underline trackable">
                View Electronics →
              </button>
            </div>

            <div
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow trackable"
              id="clothing-category"
            >
              <div className="text-4xl mb-4">👕</div>
              <h3 className="text-xl font-semibold mb-2">Clothing</h3>
              <p className="text-gray-600 mb-4">Fashion for every style</p>
              <button className="text-blue-600 font-medium hover:underline trackable">
                View Clothing →
              </button>
            </div>

            <div
              className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow trackable"
              id="accessories-category"
            >
              <div className="text-4xl mb-4">⌚</div>
              <h3 className="text-xl font-semibold mb-2">Accessories</h3>
              <p className="text-gray-600 mb-4">Complete your look</p>
              <button className="text-blue-600 font-medium hover:underline trackable">
                View Accessories →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Get notified about new products and exclusive deals
          </p>

          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 trackable"
              id="newsletter-email"
            />
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors trackable"
              id="newsletter-subscribe"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
