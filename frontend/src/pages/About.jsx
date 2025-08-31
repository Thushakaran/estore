import React, { useEffect, useState } from "react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ paddingTop: 0, marginTop: 0 }}>
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div
          className="py-20 text-white hero-animated-bg"
          style={{
            background:
              "linear-gradient(270deg, #ff9800, #ff5858, #42a5f5, #ab47bc)",
            marginTop: 0,
            borderRadius: 0,
            width: "100vw",
            position: "relative",
            left: "50%",
            right: "50%",
            marginLeft: "-50vw",
            marginRight: "-50vw",
            paddingTop: 0,
            marginBottom: 50,
          }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center relative">
              {/* Floating Icon/Emoji */}
              <div className="floating-hero-icon mx-auto mb-2">
                <span
                  style={{ fontSize: 56 }}
                  role="img"
                  aria-label="About E-Store"
                >
                  🛒
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-3 animate-hero-title">
                About E-Store
              </h1>
              <p className="text-xl mb-8 opacity-75 animate-hero-subtitle">
                Your trusted destination for quality products and exceptional
                shopping experience
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="rounded-2xl p-8 shadow-lg border-0 transform-hover bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="mb-8 lg:mb-0">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-blue-500 rounded-full inline-flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-0 left-full transform -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 mb-4 text-base">
                  At E-Store, we believe in making quality products accessible
                  to everyone. Our mission is to provide a seamless shopping
                  experience with a wide range of carefully curated products
                  that meet the highest standards of quality and value.
                </p>
                <p className="text-gray-600 text-base">
                  We are committed to customer satisfaction, offering
                  competitive prices, fast shipping, and exceptional customer
                  service to ensure your shopping journey is nothing short of
                  amazing.
                </p>
              </div>
              <div className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-green-500 rounded-full inline-flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute top-0 left-full transform -translate-x-1/2 w-5 h-5 bg-green-500 rounded-full animate-bounce"></div>
                </div>
                <h4 className="font-bold text-gray-800 text-xl">
                  Quality Assured
                </h4>
                <p className="text-gray-600">
                  Every product meets our strict quality standards
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="bg-white border-0 shadow-lg h-full transform-hover rounded-2xl"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="text-center p-8">
                <div className="relative mb-6">
                  <div className="bg-red-500 rounded-full inline-flex items-center justify-center w-16 h-16">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="absolute top-0 left-full transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <h5 className="font-bold text-gray-800 text-lg mb-3">
                  Customer First
                </h5>
                <p className="text-gray-600">
                  Your satisfaction is our top priority. We go above and beyond
                  to ensure you have the best shopping experience possible.
                </p>
              </div>
            </div>
            <div
              className="bg-white border-0 shadow-lg h-full transform-hover rounded-2xl"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="text-center p-8">
                <div className="relative mb-6">
                  <div className="bg-green-500 rounded-full inline-flex items-center justify-center w-16 h-16">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    className="absolute top-0 left-full transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
                <h5 className="font-bold text-gray-800 text-lg mb-3">
                  Quality & Trust
                </h5>
                <p className="text-gray-600">
                  We partner with trusted brands and suppliers to bring you only
                  the highest quality products you can rely on.
                </p>
              </div>
            </div>
            <div
              className="bg-white border-0 shadow-lg h-full transform-hover rounded-2xl"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="text-center p-8">
                <div className="relative mb-6">
                  <div className="bg-yellow-500 rounded-full inline-flex items-center justify-center w-16 h-16">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    className="absolute top-0 left-full transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                </div>
                <h5 className="font-bold text-gray-800 text-lg mb-3">
                  Fast & Reliable
                </h5>
                <p className="text-gray-600">
                  Quick delivery and reliable service are what we're known for.
                  Your orders reach you when you need them.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div
          className={`mb-20 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className="text-center transform-hover"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full inline-flex items-center justify-center mb-6 shadow-lg relative w-32 h-32">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="absolute top-0 left-full transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
              </div>
              <h5 className="font-bold text-gray-800 text-lg">John Smith</h5>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div
              className="text-center transform-hover"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-full inline-flex items-center justify-center mb-6 shadow-lg relative w-32 h-32">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div
                  className="absolute top-0 left-full transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
              <h5 className="font-bold text-gray-800 text-lg">Sarah Johnson</h5>
              <p className="text-gray-600">Head of Operations</p>
            </div>
            <div
              className="text-center transform-hover"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-full inline-flex items-center justify-center mb-6 shadow-lg relative w-32 h-32">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div
                  className="absolute top-0 left-full transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
              <h5 className="font-bold text-gray-800 text-lg">Mike Davis</h5>
              <p className="text-gray-600">Customer Success</p>
            </div>
            <div
              className="text-center transform-hover"
              style={{ transition: "all 0.3s ease" }}
            >
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full inline-flex items-center justify-center mb-6 shadow-lg relative w-32 h-32">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <div
                  className="absolute top-0 left-full transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                ></div>
              </div>
              <h5 className="font-bold text-gray-800 text-lg">Lisa Wilson</h5>
              <p className="text-gray-600">Product Manager</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className={`bg-white rounded-2xl p-8 mb-20 shadow-lg border-0 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative">
                <h3 className="font-bold text-blue-600 text-4xl mb-2">10K+</h3>
                <p className="text-gray-600">Happy Customers</p>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="relative">
                <h3 className="font-bold text-blue-600 text-4xl mb-2">500+</h3>
                <p className="text-gray-600">Products</p>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="relative">
                <h3 className="font-bold text-blue-600 text-4xl mb-2">50+</h3>
                <p className="text-gray-600">Brands</p>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="relative">
                <h3 className="font-bold text-blue-600 text-4xl mb-2">24/7</h3>
                <p className="text-gray-600">Support</p>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div
          className={`transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  background:
                    "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
                }}
              ></div>
              <div className="relative">
                <h3 className="font-bold mb-6 text-4xl">
                  Ready to Start Shopping?
                </h3>
                <p className="mb-8 text-xl opacity-90">
                  Join thousands of satisfied customers and discover amazing
                  products today!
                </p>
                <a
                  href="/"
                  className="bg-white text-gray-800 px-8 py-4 font-bold rounded-full shadow-lg transform-hover inline-flex items-center"
                  style={{ transition: "all 0.3s ease" }}
                >
                  Start Shopping Now
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .transform-hover:hover {
          transform: translateY(-10px);
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .bg-gradient-to-br {
          background: linear-gradient(to bottom right, #3b82f6, #9333ea);
        }

        .bg-gradient-to-r {
          background: linear-gradient(to right, #2563eb, #9333ea);
        }

        .from-blue-500 {
          background-color: #3b82f6;
        }

        .to-purple-600 {
          background-color: #9333ea;
        }

        .from-pink-500 {
          background-color: #ec4899;
        }

        .to-red-500 {
          background-color: #ef4444;
        }

        .from-green-500 {
          background-color: #10b981;
        }

        .to-teal-500 {
          background-color: #14b8a6;
        }

        .from-yellow-500 {
          background-color: #eab308;
        }

        .to-orange-500 {
          background-color: #f97316;
        }

        .from-blue-600 {
          background-color: #2563eb;
        }

        .rounded-2xl {
          border-radius: 1rem !important;
        }

        .text-4xl {
          font-size: 2.5rem;
          font-weight: 300;
          line-height: 1.2;
        }
        /* Home hero styles */
        .hero-animated-bg {
          background-size: 400% 400%;
          animation: heroGradientMove 10s ease-in-out infinite alternate;
        }
        @keyframes heroGradientMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .floating-hero-icon {
          animation: floatingIcon 2.8s ease-in-out infinite alternate;
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes floatingIcon {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-18px);
          }
        }
        .animate-hero-title {
          animation: heroTitleIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
        }
        .animate-hero-subtitle {
          animation: heroSubtitleIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.7s both;
        }
        @keyframes heroTitleIn {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroSubtitleIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default About;
