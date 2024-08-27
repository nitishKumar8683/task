"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import ClipLoader from "react-spinners/ClipLoader";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/users/login", values);
        if (response.data.success) {
          toast.success(response.data.message);
          setTimeout(() => router.push("/dashboard"), 1000);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Network Issue");
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <ClipLoader color="#4f46e5" size={50} />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  formik.errors.email && formik.touched.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className={`mt-1 p-2 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                  formik.errors.password && formik.touched.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {formik.isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;

