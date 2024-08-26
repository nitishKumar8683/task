"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserData,
  clearUserData,
} from "../../../app/redux/user/userSlice";
import DefaultPage from "../../../components/DefaultPage/DefaultPage";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { PuffLoader } from "react-spinners";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [editItemData, setEditItemData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const handleOpenEditModal = (item) => {
    setEditItemData(item);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  const handleOpenDeleteModal = (id) => {
    setItemId(id);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

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

  const handleAddSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/users/register", values);
      toast.success("User added successfully!");
      resetForm();
      handleCloseAddModal();
      dispatch(fetchUserData());
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add user.");
    } finally {
      setIsSubmitting(false);
    }
  };

 const handleEditSubmit = async (values) => {
   setIsSubmitting(true);
   try {
     const response = await axios.put(
       `/api/users/updateUser?id=${editItemData._id}`, 
       values
     );

     console.log(response);
     if (response.data.status === 200) {
       toast.success(response.data.message);
       handleCloseEditModal();
       dispatch(fetchUserData());
     } else {
       toast.error(response.data.message);
     }
   } catch (error) {
     console.error("Error updating user:", error);
     toast.error("Failed to update user.");
   } finally {
     setIsSubmitting(false);
   }
 };


const handleConfirmDelete = async () => {
  setIsDeleting(true);
  try {
    const response = await axios.delete(`/api/users/deleteUser?id=${itemId}`); 
    if (response.data.status === 200) {
      toast.success(response.data.message);
      handleCloseDeleteModal();
      dispatch(fetchUserData());
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    toast.error("Failed to delete user.");
  } finally {
    setIsDeleting(false);
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

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate the data to display based on the current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <DefaultPage>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 border-b-4 border-indigo-600 pb-2 mb-4">
            User Data
          </h1>

          <div className="flex justify-end">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaPlus size={16} className="mr-2" />
              Add New Employee
            </button>
          </div>
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
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
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="text-indigo-600 hover:text-indigo-900 transition duration-150"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(item._id)}
                        className="text-red-600 hover:text-red-900 transition duration-150"
                      >
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

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600 focus:outline-none disabled:opacity-50"
              aria-label="Previous Page"
            >
              <FaArrowLeft size={20} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600 focus:outline-none disabled:opacity-50"
              aria-label="Next Page"
            >
              <FaArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Add User Modal */}
        <Transition appear show={isAddModalOpen} as={Fragment}>
          <Dialog as="div" open={isAddModalOpen} onClose={handleCloseAddModal}>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-auto">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Employees
                </Dialog.Title>
                <Formik
                  initialValues={{
                    name: "",
                    email: "",
                    phonenumber: "",
                    role: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleAddSubmit}
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
                          {/* <option value="manager">Manager</option> */}
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
                          onClick={handleCloseAddModal}
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

        {/* Edit User Modal */}
        <Transition appear show={isEditModalOpen} as={Fragment}>
          <Dialog
            as="div"
            open={isEditModalOpen}
            onClose={handleCloseEditModal}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-auto">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Edit User
                </Dialog.Title>
                <Formik
                  initialValues={
                    editItemData || {
                      name: "",
                      email: "",
                      phonenumber: "",
                      role: "",
                    }
                  }
                  validationSchema={validationSchema}
                  onSubmit={handleEditSubmit}
                  enableReinitialize
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
                          {/* <option value="manager">Manager</option> */}
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
                          onClick={handleCloseEditModal}
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
                            "Update"
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

        {/* Confirm Delete Modal */}
        <Transition appear show={isDeleteModalOpen} as={Fragment}>
          <Dialog
            as="div"
            open={isDeleteModalOpen}
            onClose={handleCloseDeleteModal}
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full overflow-auto relative">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Delete
                </Dialog.Title>
                <p className="mb-4 text-gray-600">
                  Are you sure you want to delete this user?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCloseDeleteModal}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
                {isDeleting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                    <PuffLoader
                      size={60}
                      color="#3b82f6"
                      loading={isDeleting}
                    />
                  </div>
                )}
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
