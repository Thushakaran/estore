import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getLoginUrl, register } from "../redux/userSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUrl, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // Form state for traditional registration
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    country: "Sri Lanka",
  });
  const [terms, setTerms] = useState(false);
  const [registrationMethod, setRegistrationMethod] = useState("oidc"); // "oidc" or "traditional"

  // Get redirect path from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the intended page or home
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleOidcSignup = async () => {
    try {
      // Use the same OIDC login flow for signup
      // Auth0 will handle the registration process
      await dispatch(getLoginUrl({ screen_hint: 'signup' })).unwrap();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleTraditionalSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!terms) {
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contactNumber: formData.contactNumber,
        country: formData.country,
      };

      const result = await dispatch(register(userData)).unwrap();

      // Store credentials in localStorage
      localStorage.setItem("accessToken", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      // Redirect to the intended page
      navigate(redirectPath);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-500 w-12 h-12">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600 text-sm">
              Join us and start shopping today
            </p>
          </div>

          {/* Registration Method Toggle */}
          <div className="mb-6">
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                type="button"
                onClick={() => setRegistrationMethod("oidc")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  registrationMethod === "oidc"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Quick Sign Up
              </button>
              <button
                type="button"
                onClick={() => setRegistrationMethod("traditional")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  registrationMethod === "traditional"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Email & Password
              </button>
            </div>
          </div>

          {registrationMethod === "oidc" ? (
            // OIDC Registration
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-blue-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Secure Registration
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        We use Auth0 for secure authentication. You can register
                        with your email, Google, Facebook, or other social
                        accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOidcSignup}
                disabled={loading}
                className="w-full bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Redirecting...
                  </div>
                ) : (
                  "Sign Up with Auth0"
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleOidcSignup}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="ml-2">Continue with Google</span>
                </button>
              </div>
            </div>
          ) : (
            // Traditional Registration Form
            <form onSubmit={handleTraditionalSignup} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <div className="mt-2 text-red-500 text-sm">
                      Passwords do not match
                    </div>
                  )}
              </div>

              <div>
                <label
                  htmlFor="contactNumber"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Contact Number (Optional)
                </label>
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                />
                <label
                  className="ml-2 block text-sm text-gray-700"
                  htmlFor="terms"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Terms & Conditions
                  </a>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {typeof error === 'string' ? error : error.message || 'An error occurred'}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading ||
                  !terms ||
                  formData.password !== formData.confirmPassword
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
            </span>
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="font-semibold text-yellow-600 hover:text-yellow-700 text-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
