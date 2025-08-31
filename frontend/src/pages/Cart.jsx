import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CartItem from "../components/CartItem";
import { removeFromCartBackend, clearCartBackend } from "../redux/cartSlice";
import { createOrder, clearError } from "../redux/orderSlice";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, success } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent("/cart")}`);
    }
  }, [isAuthenticated, navigate]);

  // Don't render anything if user is not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Handle successful order creation
  useEffect(() => {
    if (success && isCheckingOut) {
      setIsCheckingOut(false);
      dispatch(clearCartBackend());
      alert("Order created successfully! Redirecting to orders page...");
      navigate("/orders");
    }
  }, [success, isCheckingOut, dispatch, navigate]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to checkout ${
        items.length
      } item(s) for a total of $${calculateTotal().toFixed(2)}?`
    );

    if (!confirmed) {
      return;
    }

    setIsCheckingOut(true);

    try {
      // Create orders for each cart item one by one to handle individual failures
      for (const item of items) {
        const orderData = {
          purchaseDate: new Date().toISOString(), // Full ISO date
          deliveryTime: "10 AM", // Default delivery time
          deliveryLocation: "Colombo", // Default location
          productName: item.product.name,
          quantity: item.quantity,
          message: `Order from cart - ${item.product.name}`,
        };

        try {
          await dispatch(createOrder(orderData)).unwrap();
        } catch (orderError) {
          console.error(
            `Failed to create order for ${item.product.name}:`,
            orderError
          );
          throw new Error(
            `Failed to create order for ${item.product.name}: ${
              orderError.message || "Unknown error"
            }`
          );
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      setIsCheckingOut(false);
      // Show more specific error message
      if (error.message) {
        alert(`Checkout failed: ${error.message}`);
      } else {
        alert("Checkout failed. Please try again.");
      }
    }
  };

  const calculateSubtotal = () =>
    items.reduce(
      (acc, item) =>
        acc +
        (item.product && item.product.price
          ? item.product.price * item.quantity
          : 0),
      0
    );
  const calculateTotal = () => calculateSubtotal();

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-6">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/"
            className="bg-yellow-500 text-white px-6 py-3 font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-white via-gray-50 to-blue-50 min-h-screen py-12"
      style={{
        background: "linear-gradient(120deg, #f8fafc 0%, #f3f6fd 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span>
                {typeof error === "string"
                  ? error
                  : error.message || error.error || "An error occurred"}
              </span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-700 hover:text-red-900 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 border-0 shadow-lg rounded-2xl backdrop-blur-sm border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mb-6">
                You have {items.length} item{items.length !== 1 ? "s" : ""} in
                your cart
              </p>
              <div className="space-y-4">
                {items
                  .filter((item) => item.product && item.product._id)
                  .map((item) => (
                    <CartItem
                      key={item.product._id}
                      item={item}
                      onRemove={() =>
                        dispatch(removeFromCartBackend(item.product._id))
                      }
                    />
                  ))}
              </div>
              <button
                className="text-red-500 mt-6 font-semibold text-lg hover:text-red-700 transition-colors"
                onClick={() => dispatch(clearCartBackend())}
              >
                Clear Cart
              </button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border-0 shadow-lg rounded-2xl sticky top-24 backdrop-blur-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">
                  ${calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-3">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between mb-6">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || loading}
                className="bg-yellow-500 text-white w-full font-semibold mb-3 rounded-full py-3 text-lg shadow-sm hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut || loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Checkout"
                )}
              </button>
              <Link
                to="/"
                className="border-2 border-gray-300 text-gray-700 w-full rounded-full py-3 text-lg shadow-sm hover:bg-gray-50 transition-colors block text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
