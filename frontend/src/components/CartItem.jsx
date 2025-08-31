import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuantityBackend } from "../redux/cartSlice";

const CartItem = ({ item, onRemove }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);
    dispatch(
      updateQuantityBackend({
        productId: item.product._id,
        quantity: newQuantity,
      })
    );
  };

  return (
    <div className="flex items-center bg-white rounded-lg border p-4 mb-4 shadow-sm flex-wrap">
      {/* Product Image */}
      <div className="mr-4 flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={item.product.images?.[0]?.image || "https://via.placeholder.com/80x80?text=Product"}
          alt={item.product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-gray-800 text-sm mb-1 min-h-[2em]">
          {item.product.name}
        </h4>
        <p className="text-gray-500 text-sm mb-2">
          SKU: {item.product._id.slice(-8)}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                className="mr-1 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-1">(4.5)</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center">
            <svg
              width="14"
              height="14"
              className="mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Free Shipping
          </span>
          <span className="flex items-center">
            <svg
              width="14"
              height="14"
              className="mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            In Stock
          </span>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 ml-4">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          <svg
            width="16"
            height="16"
            className="text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
        <span className="w-8 text-center font-medium text-gray-800">
          {quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
        >
          <svg
            width="16"
            height="16"
            className="text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Price */}
      <div className="text-right ml-4">
        <div className="font-bold text-gray-800 text-xl">
          ${(item.product.price * quantity).toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">${item.product.price} each</div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.product._id)}
        className="text-red-500 p-2 ml-3 hover:text-red-700 transition-colors"
        title="Remove item"
      >
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
