"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData, clearUserData } from "../../../app/redux/user/userSlice";
import DefaultPage from "../../../components/DefaultPage/DefaultPage";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { userAllAPIData, isLoading, error } = useSelector(
    (state) => state.userAll
  );

  useEffect(() => {
    dispatch(fetchUserData());

    return () => {
      dispatch(clearUserData());
    };
  }, [dispatch]);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phonenumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    role: Yup.string().required("Role is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/register", values);
      toast.success("User added successfully!");
      resetForm();
      handleCloseModal();
      dispatch(fetchUserData()); // Refresh the data
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredData = userAllAPIData
    ? userAllAPIData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.role.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <DefaultPage>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Add User Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleOpenModal}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaPlus size={16} className="mr-2" />
            Add User
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative overflow-x-auto bg-white shadow-lg rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.phonenumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900 transition duration-150">
                        <FaEdit size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition duration-150">
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        <Transition
          appear
          show={isOpen}
          as={Fragment}
          className="fixed inset-0 z-10"
        >
          <Dialog as="div" open={isOpen} onClose={handleCloseModal}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-auto">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Add User
                </Dialog.Title>
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    phonenumber: "",
                    role: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phonenumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Phone Number
                        </label>
                        <Field
                          type="text"
                          id="phonenumber"
                          name="phonenumber"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage
                          name="phonenumber"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Role
                        </label>
                        <Field
                          as="select"
                          id="role"
                          name="role"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select a role</option>
                          <option value="teamlead">Team Lead</option>
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </Field>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <ClipLoader size={20} color={"#ffffff"} />
                          ) : (
                            "Submit"
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </Dialog.Panel>
            </div>
          </Dialog>
        </Transition>
      </div>
      <ToastContainer />
    </DefaultPage>
  );
};

export default Page;
