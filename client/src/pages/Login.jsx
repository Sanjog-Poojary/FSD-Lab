import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setMessage("Please fill in all fields.");
      return;
    }

    login(formData.email);
    setMessage("Login successful!");
    setTimeout(() => {
      navigate("/");
    }, 800);
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">

      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 sm:p-8 shadow-md">

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Login
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Login to manage your event registrations.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                         text-slate-900 outline-none transition
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                         text-slate-900 outline-none transition
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600
                       px-4 py-3 font-semibold text-white
                       transition hover:bg-indigo-700 shadow-sm"
          >
            Login
          </button>

          {message && (
            <p className="text-center font-semibold text-indigo-600 text-sm">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}

export default Login;