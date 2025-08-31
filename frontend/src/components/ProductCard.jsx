import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  // Generate random rating for demo
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 100) + 10; // 10-109 reviews

  return (
    <div className="h-full bg-white shadow-sm border-0 rounded-lg overflow-hidden">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative block">
        <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={
              product.images?.[0]?.image ||
              "https://via.placeholder.com/400x400?text=Product+Image"
            }
            alt={product.name}
            className="w-full h-full object-contain"
            loading="lazy"
            style={{ maxHeight: 180 }}
          />
        </div>

        {/* Discount Badge */}
        {Math.random() > 0.7 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.floor(Math.random() * 30) + 10}%
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center group-hover:bg-black group-hover:bg-opacity-20 transition-all duration-300">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium border">
              Quick View
            </div>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <Link to={`/product/${product._id}`} className="no-underline">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 min-h-[2.5em]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                className={`mr-1 ${
                  i < rating ? "text-yellow-500" : "text-gray-400"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-1">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-800">
              ${product.price}
            </span>
            {Math.random() > 0.6 && (
              <span className="text-gray-500 line-through text-sm">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="text-sm text-green-600 font-semibold">In Stock</div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-yellow-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          </svg>
          <span>Add to Cart</span>
        </button>

        {/* Additional Info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Free Shipping</span>
            <span>Express Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
