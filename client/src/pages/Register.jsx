import { useState } from "react";

function Register() {

  const [formData, setFormData] = useState({
    name: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setMessage("Registration successful!");
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 sm:py-16">

      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 sm:p-8 shadow-md">

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Create Account
        </h1>

        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Register to start exploring events.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5
                         text-slate-900 outline-none transition
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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
            Register
          </button>

          {message && (
            <p className="mt-4 text-center font-semibold text-indigo-600 text-sm">
              {message}
            </p>
          )}

        </form>

      </div>

    </div>
  );
}

export default Register;