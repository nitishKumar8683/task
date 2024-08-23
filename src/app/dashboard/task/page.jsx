"use client";
import React, { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientData,
  clearUserData,
} from "../../../app/redux/client/clientSlice";
import { fetchProjectData } from "../../../app/redux/project/projectSlice";
import { fetchApiUsers } from "../../../app/redux/slice";
import {
  fetchTaskWorkData,
  clearTaskWorkData,
} from "../../../app/redux/taskwork/taskworkSlice";
import {fetchUserData} from '../../../app/redux/user/userSlice'
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
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dispatch = useDispatch();
  const { clientAllAPIData } = useSelector((state) => state.clientAll);

  const { projectAllAPIData } = useSelector((state) => state.projectAll);

  const userAllAPIData = useSelector(
    (state) => state.userAll?.userAllAPIData || []
  );


  const { taskworkAllAPIData, isLoading, error } = useSelector(
    (state) => state.taskworkAll
  );

  useEffect(() => {
    dispatch(fetchTaskWorkData());
    return () => {
      dispatch(clearTaskWorkData());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchClientData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProjectData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const clientOptions = clientAllAPIData
    ? clientAllAPIData.map((client) => ({
        value: client.name,
        label: client.name,
      }))
    : [];

 const userOptions = Array.isArray(userAllAPIData)
   ? userAllAPIData.map((user) => ({
       value: user.email,
       label: user.email,
     }))
   : [];

    console.log("your data", userOptions);

const handleClientSelect = (option) => {
  setSelectedClient(option ? option.value : null);
  setSearchTerm(""); // Clear search term
  setIsClientDropdownOpen(false);
};

 const handleClientSearch = (e) => {
   setSearchTerm(e.target.value);
 };

 const handleStatusSearch = (e) => {
   setSelectedStatus(e.target.value);
 };

  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "wip", label: "Work In Progress" },
    { value: "aborted", label: "Aborted" },
  ];

  const projectOptions = projectAllAPIData
    ? projectAllAPIData.map((project) => ({
        value: project.name,
        label: project.name,
      }))
    : [];

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => setIsAddModalOpen(false);

  const validationSchema = Yup.object({
    client: Yup.string().required("Client Name is required"),
    project: Yup.string().required("Project Name is required"),
    task: Yup.string().required("Task is required"),
    assigned: Yup.string().required("Assigned To is required"),
  });

  const handleAddSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/worktask/createWorkTask", values);
      toast.success(response.data.message);
      resetForm();
      handleCloseAddModal();
      dispatch(fetchTaskWorkData());
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add task.");
    } finally {
      setIsSubmitting(false);
    }
  };

   const filteredClients = clientOptions.filter((option) =>
     option.label.toLowerCase().includes((searchTerm || "").toLowerCase())
   );

   const filteredStatuses = statusOptions.filter((option) =>
     option.label.toLowerCase().includes((selectedStatus || "").toLowerCase())
   );

  const filteredData =
    taskworkAllAPIData?.filter((item) => {
      const isClientMatch = selectedClient
        ? item.client.toLowerCase() === selectedClient.toLowerCase()
        : true;
      const isStatusMatch = selectedStatus
        ? item.status.toLowerCase() === selectedStatus.toLowerCase()
        : true;
      return isClientMatch && isStatusMatch;
    }) || [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > Math.ceil((taskworkAllAPIData?.length || 0) / itemsPerPage)
    )
      return;
    setCurrentPage(page);
  };

  const handleStatusSelect = (option) => {
    setSelectedStatus(option ? option.value : null);
    setIsStatusDropdownOpen(false);
  };
  const handleProjectSelect = (option) => {
    setSelectedProject(option ? option.value : null);
    setIsProjectDropdownOpen(false);
  };

const sumTime = (timeArray) => {
  let totalMinutes = 0;

  timeArray.forEach((time) => {
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      totalMinutes += (hours || 0) * 60 + (minutes || 0);
    }
  });

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${totalHours}h ${remainingMinutes}m`;
};

const timeArray = paginatedData.map((item) => item.time);
const totalTime = sumTime(timeArray);


  return (
    <DefaultPage>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 border-b-4 border-indigo-600 pb-2 mb-4">
            Task Data
          </h1>

          <div className="flex justify-end">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaPlus size={16} className="mr-2" />
              Add New Task
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {/* Client Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsClientDropdownOpen(!isClientDropdownOpen)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Client <FaUserCircle className="ml-2" />
            </button>
            {isClientDropdownOpen && (
              <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                <input
                  type="text"
                  placeholder="Search Clients"
                  className="px-4 py-2 w-full border-b border-gray-300"
                  onChange={handleClientSearch}
                  value={searchTerm}
                />
                <div className="max-h-60 overflow-y-auto">
                  {filteredClients.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleClientSelect(option)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Status <FaArrowRight className="ml-2" />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                <input
                  type="text"
                  placeholder="Search Status"
                  className="px-4 py-2 w-full border-b border-gray-300"
                  onChange={handleStatusSearch}
                  value={selectedStatus}
                />
                <div className="max-h-60 overflow-y-auto">
                  {filteredStatuses.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusSelect(option)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative overflow-x-auto bg-white shadow-lg rounded-lg">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
            </div>
          )}
          {error && (
            <div className="text-red-500 text-center mt-4">Error: {error}</div>
          )}
          {!isLoading && !error && (
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
                        {item.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.project}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 break-words max-w-xs">
                        {item.task}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {item.time ? item.time : "N/A"} hrs
                      </td>
                      <td
                        className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-md ${
                          item.status === "completed"
                            ? "bg-green-500 text-white"
                            : item.status === "wip"
                            ? "bg-yellow-500 text-black"
                            : item.status === "aborted"
                            ? "bg-red-500 text-white"
                            : item.status === ""
                            ? "bg-gray-200 text-gray-800"
                            : "bg-gray-200 text-gray-800"
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
          )}
          <div className="px-6 py-4 text-right text-lg font-medium text-gray-700">
            <h1>Total Time: {totalTime}</h1>
          </div>
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
              disabled={
                currentPage ===
                Math.ceil((taskworkAllAPIData?.length || 0) / itemsPerPage)
              }
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
                  Add New Task
                </Dialog.Title>
                <Formik
                  initialValues={{
                    client: "",
                    project: "",
                    task: "",
                    assigned: "",
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

                      <div>
                        <label htmlFor="assigned">Assigned To</label>
                        <Select
                          name="assigned"
                          options={userOptions}
                          value={
                            userOptions.find(
                              (option) => option.value === values.assigned
                            ) || null
                          }
                          onChange={(option) =>
                            setFieldValue(
                              "assigned",
                              option ? option.value : ""
                            )
                          }
                          onBlur={() => setFieldTouched("assigned", true)}
                        />
                        <ErrorMessage
                          name="assigned"
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
      </div>
      <ToastContainer />
    </DefaultPage>
  );
};

export default Page;
