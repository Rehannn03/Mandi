import { Loader } from "../components/Loader";
import { useState } from "react";
import { authService } from "../services/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router";
function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmailHovered, setIsEmailHovered] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);
  const navigate = useNavigate();
  const { login} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/admin");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="bg-white p-8 rounded-xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-3xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-8 font-inter">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-[#111827] block mb-2 font-roboto">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-[#111827] block mb-2 font-roboto">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
              required
            />
          </div>
          {error && (
            <p className="text-[#DC2626] text-sm font-roboto">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-[#F97316] text-white py-2 px-4 rounded-md hover:bg-[#EA580C] transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg font-inter font-semibold"
          >
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-[#1E3A8A] hover:underline font-roboto">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
