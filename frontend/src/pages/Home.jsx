import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setLoading, setError } from "../redux/productSlice";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import { addToCart, addToCartBackend } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, total, page, totalPages } = useSelector(
    (state) => state.products
  );
  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const categoriesRef = useRef(null);
  const productsRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(setLoading(true));
      try {
        let url = `/products?page=${currentPage}&limit=${productsPerPage}`;
        if (selectedCategory) {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (searchQuery) {
          url += `&search=${encodeURIComponent(searchQuery)}`;
        }
        const res = await api.get(url);
        dispatch(
          setProducts({
            items: res.data.products,
            total: res.data.total,
            page: res.data.page,
            totalPages: res.data.totalPages,
          })
        );
      } catch {
        dispatch(setError("Failed to load products"));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchProducts();
  }, [dispatch, currentPage, selectedCategory, searchQuery]);

  const handleAddToCart = (product) => {
    console.log("handleAddToCart called with product:", product);
    console.log("Current user state:", user);
    console.log("isAuthenticated from Redux:", isAuthenticated);

    if (user && isAuthenticated) {
      console.log("User is authenticated, adding to cart");
      dispatch(addToCartBackend({ productId: product._id, quantity: 1 }));
    } else {
      console.log("User not authenticated, navigating to login");
      navigate(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-3"></div>
          <p className="mt-3 text-gray-600">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-6xl text-red-500 mb-3">⚠️</div>
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <div
        className="py-20 text-white hero-animated-bg"
        style={{
          background:
            "linear-gradient(270deg, #ff9800, #ff5858, #42a5f5, #ab47bc)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center relative">
            {/* Floating Icon/Emoji */}
            <div className="floating-hero-icon mx-auto mb-2">
              <span style={{ fontSize: 56 }} role="img" aria-label="E-Store">
                🛒
              </span>
            </div>
            <h1 className="text-5xl font-bold mb-3 animate-hero-title">
              Welcome to E-Store
            </h1>
            <p className="text-xl mb-8 opacity-75 animate-hero-subtitle">
              Discover Amazing Products at Great Prices
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="bg-white text-yellow-600 font-semibold px-6 py-3 rounded-lg animate-hero-btn hero-btn-pulse hover:bg-gray-100 transition-colors"
                onClick={() => {
                  if (productsRef.current) {
                    productsRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Shop Now
              </button>
              <button
                className="border-2 border-white text-white font-semibold px-6 py-3 rounded-lg animate-hero-btn hover:bg-white hover:text-gray-800 transition-colors"
                onClick={() => {
                  if (categoriesRef.current) {
                    categoriesRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                }}
              >
                View Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div ref={categoriesRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-center">
            {[
              { name: "Electronics", icon: "📱" },
              { name: "Fashion", icon: "👕" },
              { name: "Home", icon: "🏠" },
              { name: "Sports", icon: "⚽" },
              { name: "Books", icon: "📚" },
              { name: "Beauty", icon: "💄" },
            ].map((category) => (
              <div key={category.name} className="col-span-1">
                <div
                  className={`bg-gray-100 rounded-lg text-center p-4 h-full border-2 cursor-pointer hover:shadow-lg transition-all ${
                    selectedCategory === category.name
                      ? "border-yellow-500 shadow-lg"
                      : "border-transparent hover:border-yellow-300"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentPage(1);
                  }}
                >
                  <div className="mx-auto mb-2 flex items-center justify-center rounded-full bg-yellow-100 w-12 h-12">
                    <span className="text-yellow-600 font-bold text-2xl">
                      {category.icon}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {selectedCategory && (
            <div className="text-center mt-6">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                onClick={() => setSelectedCategory(null)}
              >
                Clear Category Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="py-6 bg-white">
        <div className="container mx-auto px-4">
          <form
            className="mx-auto max-w-lg"
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentPage(1);
              setSearchQuery(searchInput);
            }}
          >
            <div className="flex shadow-lg bg-white p-1 rounded-lg transition-shadow">
              <input
                type="text"
                className="flex-1 border-0 bg-transparent px-4 py-2 text-base rounded-lg focus:outline-none"
                placeholder="Search for products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className="bg-yellow-500 text-white px-6 py-2 font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Product List Section */}
      <div ref={productsRef} className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Products
            </h2>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl text-gray-400 mb-6">📦</div>
              <p className="text-gray-600 text-xl">
                No products available at the moment.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {items.map((product) => (
                  <div key={product._id} className="h-full">
                    <div className="h-full">
                      <div className="h-full bg-white rounded-2xl shadow-sm overflow-hidden product-card-hover transition-all duration-200 min-h-[340px]">
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex justify-center mt-8">
                  <ul className="flex gap-2">
                    <li>
                      <button
                        className={`px-4 py-2 text-lg rounded-lg transition-colors ${
                          currentPage === 1
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        &laquo;
                      </button>
                    </li>
                    {(() => {
                      let start = Math.max(
                        1,
                        Math.min(currentPage - 1, totalPages - 3)
                      );
                      let end = Math.min(totalPages, start + 3);
                      let pages = [];
                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <li key={i}>
                            <button
                              className={`px-4 py-2 text-lg font-semibold rounded-lg transition-colors ${
                                currentPage === i
                                  ? "bg-yellow-500 text-gray-800"
                                  : "bg-white text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          </li>
                        );
                      }
                      return pages;
                    })()}
                    <li>
                      <button
                        className={`px-4 py-2 text-lg rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        &raquo;
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100 w-16 h-16">
                <span
                  style={{ fontSize: 32 }}
                  role="img"
                  aria-label="Free Shipping"
                >
                  📦
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Free Shipping
              </h3>
              <p className="text-gray-600">Free delivery on orders above $50</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100 w-16 h-16">
                <span
                  style={{ fontSize: 32 }}
                  role="img"
                  aria-label="Quality Guarantee"
                >
                  ✅
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">30-day money back guarantee</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100 w-16 h-16">
                <span
                  style={{ fontSize: 32 }}
                  role="img"
                  aria-label="24/7 Support"
                >
                  💬
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                24/7 Support
              </h3>
              <p className="text-gray-600">Round the clock customer support</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .product-card-hover:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  );
};

export default Home;
