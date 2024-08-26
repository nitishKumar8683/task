"use client";
import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTaskData,
  clearTaskData,
} from "../../../app/redux/task/taskSlice";
import { Dialog, Transition } from "@headlessui/react";
import { FaEdit } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import DefaultPage from "../../../components/DefaultPage/DefaultPage";

const Page = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();
  const { taskData, isLoading, error } = useSelector((state) => state.task);

  useEffect(() => {
    dispatch(fetchTaskData());
    return () => {
      dispatch(clearTaskData());
    };
  }, [dispatch]);

  const handleOpenUpdateModal = (task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedTask(null);
  };

  const validationSchema = Yup.object({
    time: Yup.string().required("Time is required"),
    status: Yup.string().required("Status is required"),
  });

  const handleUpdateSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const updatedValues = { ...values, id: selectedTask._id };
      const response = await axios.put(
        "/api/worktask/updateTaskByEmployee", // Ensure this matches your API endpoint
        updatedValues
      );
      toast.success(response.data.message);
      resetForm();
      handleCloseUpdateModal();
      dispatch(fetchTaskData()); // Refresh task data after update
    } catch (error) {
      toast.error("Failed to update task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = taskData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(taskData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DefaultPage>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-extrabold text-gray-800 border-b-4 border-indigo-600 pb-2 mb-4">
          Total Task Data
        </h1>
        {isLoading && (
          <div className="flex items-center justify-center">
            <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mt-4">Error: {error}</div>
        )}
        {!isLoading && !error && (
          <>
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
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.projectName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 break-words max-w-xs">
                        {item.task}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.time ? item.time : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-md text-center inline-block ${
                            item.status === "completed"
                              ? "bg-green-500 text-white w-32" 
                              : item.status === "wip"
                              ? "bg-yellow-500 text-black w-32" 
                              : item.status === "aborted"
                              ? "bg-red-500 text-white w-32" 
                              : item.status === ""
                              ? "bg-gray-200 text-gray-800 w-32" 
                              : "bg-gray-200 text-gray-800 w-32" 
                          }`}
                        >
                          {item.status === "wip"
                            ? "Work In Progress"
                            : item.status === "completed"
                            ? "Completed"
                            : item.status === "aborted"
                            ? "Aborted"
                            : item.status === ""
                            ? "Pending"
                            : item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <button
                          onClick={() => handleOpenUpdateModal(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <nav className="flex items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="mx-2 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </>
        )}
        <Transition appear show={isUpdateModalOpen} as={Fragment}>
          <Dialog
            as="div"
            open={isUpdateModalOpen}
            onClose={handleCloseUpdateModal}
            className="relative z-10"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-auto">
                <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
                  Update Task Work
                </Dialog.Title>
                <Formik
                  initialValues={{
                    time: selectedTask?.time || "",
                    status: selectedTask?.status || "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleUpdateSubmit}
                >
                  {({ values, errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                      <div className="mb-4">
                        <label
                          htmlFor="time"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Time
                        </label>
                        <Field
                          id="time"
                          name="time"
                          type="text"
                          className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                            touched.time && errors.time ? "border-red-500" : ""
                          }`}
                        />
                        <ErrorMessage
                          name="time"
                          component="div"
                          className="text-red-500 text-sm mt-1"
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
                          className={`mt-1 block w-full p-2 border border-gray-300 rounded-md ${
                            touched.status && errors.status
                              ? "border-red-500"
                              : ""
                          }`}
                        >
                          <option value="">Select Status</option>
                          <option value="completed">Completed</option>
                          <option value="wip">Work In Progress</option>
                          <option value="aborted">Aborted</option>
                        </Field>
                        <ErrorMessage
                          name="status"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={handleCloseUpdateModal}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gray-500 hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
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
        <ToastContainer />
      </div>
    </DefaultPage>
  );
};

export default Page;
