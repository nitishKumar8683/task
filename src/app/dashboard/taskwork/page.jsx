"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientData,
  clearUserData,
} from "../../../app/redux/client/clientSlice";
import { fetchProjectData } from "../../../app/redux/project/projectSlice";
import { fetchApiUsers } from "../../../app/redux/slice";
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
import Select from "react-select";

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
  const { clientAllAPIData, isLoading, error } = useSelector(
    (state) => state.clientAll
  );

  const { projectAllAPIData } = useSelector(
    (state) => state.projectAll
  );

  const {
    userAPIData = [],
  } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(fetchClientData());
  }, [dispatch]);

    useEffect(() => {
      dispatch(fetchProjectData());
    }, [dispatch]);

    useEffect(() => {
      dispatch(fetchApiUsers());
    }, [dispatch]);

    console.log("Me Data:", userAPIData);

  const clientOptions = clientAllAPIData
    ? clientAllAPIData.map((client) => ({
        value: client.name,
        label: client.name,
      }))
    : [];

    const projectOptions = projectAllAPIData
      ? projectAllAPIData.map((project) => ({
          value: project.name,
          label: project.name,
        }))
      : [];

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
    client: Yup.string().required("Client Name is required"),
    project: Yup.string().required("Project Name is required"),
    task: Yup.string().required("Task is required"),
    time: Yup.string().required("Time is required"),
    status: Yup.string().required("Status is required"),
  });

const parseTime = (input) => {
  const [hours, minutes] = input.split(".").map(Number);
  const totalHours = hours || 0;
  const totalMinutes = (minutes || 0) * 60; 
  const totalMinutesValue = totalHours * 60 + totalMinutes;
  const formattedHours = Math.floor(totalMinutesValue / 60);
  const formattedMinutes = totalMinutesValue % 60;
  return `${formattedHours}:${formattedMinutes.toString().padStart(2, "0")}`;
};


 const handleAddSubmit = async (values, { resetForm }) => {
   setIsSubmitting(true);
   try {
     const userId = userAPIData._id; 
     console.log(userId);
    if (!userId) {
      throw new Error("User ID not found");
    }
    const formattedTime = parseTime(values.time);
    const updatedValues = { ...values, userId, time: formattedTime };
     const response = await axios.post(
       "/api/worktask/createWorkTask",
       updatedValues
     );
     console.log(response);
     toast.success(response.data.message)
     resetForm();
     handleCloseAddModal();
    // dispatch(fetchUserData());
   } catch (error) {
     console.error("Error submitting form:", error);
     toast.error("Failed to add task.");
   } finally {
     setIsSubmitting(false);
   }
 };


  const handleEditSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(
        `/api/users/updateUser/${editItemData._id}`,
        values
      );
      console.log(response);
      if (response.data.status === 201) {
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
      const response = await axios.delete(`/api/users/deleteUser/${itemId}`);
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

  const filteredData = clientAllAPIData
    ? clientAllAPIData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            Task Work Data
          </h1>

          <div className="flex justify-end">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaPlus size={16} className="mr-2" />
              Add Task Work
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
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Project Name
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
          <Dialog
            as="div"
            open={isAddModalOpen}
            onClose={handleCloseAddModal}
            className="relative z-10"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-auto">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Add Task Work
                </Dialog.Title>
                <Formik
                  initialValues={{
                    client: "",
                    project: "",
                    task: "",
                    time: "",
                    status: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleAddSubmit}
                >
                  {({
                    values,
                    errors,
                    touched,
                    setFieldValue,
                    setFieldTouched,
                    isSubmitting,
                  }) => (
                    <Form className="space-y-4">
                      <div>
                        <label htmlFor="client">Client</label>
                        <Select
                          name="client"
                          options={clientOptions}
                          value={
                            clientOptions.find(
                              (option) => option.value === values.client
                            ) || null
                          }
                          onChange={(option) =>
                            setFieldValue("client", option ? option.value : "")
                          }
                          onBlur={() => setFieldTouched("client", true)}
                        />
                        <ErrorMessage
                          name="client"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="project"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Project Name
                        </label>
                        <Select
                          name="project"
                          options={projectOptions}
                          value={
                            projectOptions.find(
                              (option) => option.value === values.project
                            ) || null
                          }
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "project",
                              selectedOption ? selectedOption.value : ""
                            )
                          }
                          onBlur={() => setFieldTouched("project", true)}
                          placeholder="Select a project"
                        />
                        <ErrorMessage
                          name="project"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="task"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Task
                        </label>
                        <Field
                          as="textarea"
                          id="task"
                          name="task"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="3" 
                        />
                        <ErrorMessage
                          name="task"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Time
                        </label>
                        <Field
                          type="text"
                          id="time"
                          name="time"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <ErrorMessage
                          name="time"
                          component="div"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Status
                        </label>
                        <Field
                          as="select"
                          id="status"
                          name="status"
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select a status</option>
                          <option value="completed">Completed</option>
                          <option value="wip">Work In Progress</option>
                          <option value="aborted">Aborted</option>
                        </Field>
                        <ErrorMessage
                          name="status"
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
