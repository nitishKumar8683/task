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
import { fetchUserData } from "../../../app/redux/user/userSlice";
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
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import Select from "react-select";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [selectedProject, setSelectedProject] = useState(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const currentDate = new Date();

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
    dispatch(fetchProjectData());
    dispatch(fetchUserData());
  }, [dispatch]);

  const clientOptions = clientAllAPIData
    ? clientAllAPIData.map((client) => ({
        value: client._id,
        label: client.name,
      }))
    : [];

  const userOptions = Array.isArray(userAllAPIData)
    ? userAllAPIData.map((user) => ({
        value: user._id,
        label: user.email,
      }))
    : [];

  const handleClientSelect = (option) => {
    setSelectedClient(option ? option.value : null);
    setSearchTerm("");
    setIsClientDropdownOpen(false);
  };

  const handleProjectSelect = (option) => {
    setSelectedProject(option ? option.value : null);
    setIsProjectDropdownOpen(false);
  };

  const handleStatusSelect = (option) => {
    setSelectedStatus(option ? option.value : null);
    setIsStatusDropdownOpen(false);
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
        value: project._id,
        label: project.name,
      }))
    : [];

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedClient(null);
    setSelectedStatus(null);
    setSelectedProject(null);
  };

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

  const handleProjectSearch = (e) => {
    setSelectedProject(e.target.value);
  };

  const filteredProjects = projectOptions.filter((option) =>
    selectedProject
      ? option.label.toLowerCase().includes(selectedProject.toLowerCase())
      : true
  );

 const filteredData = (taskworkAllAPIData || []).filter((item) => {
   const isClientMatch = selectedClient
     ? item.client.toLowerCase() === selectedClient.toLowerCase()
     : true;
   const isStatusMatch = selectedStatus
     ? item.status.toLowerCase() === selectedStatus.toLowerCase()
     : true;
   const isProjectMatch = selectedProject
     ? item.project.toLowerCase() === selectedProject.toLowerCase()
     : true;
   const itemDate = new Date(item.createdAt);
   const adjustedEndDate = new Date(endDate);
   adjustedEndDate.setHours(23, 59, 59, 999);
   const isDateInRange =
     (!startDate || itemDate >= new Date(startDate)) &&
     (!endDate || itemDate <= adjustedEndDate);
   return isClientMatch && isStatusMatch && isProjectMatch && isDateInRange;
 });

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

  const prepareExportData = () => {
    const data = paginatedData.map((item) => ({
      Client: item.clientName,
      Project: item.projectName,
      Task: item.task,
      Assigned: `${item.assignedUserName} (${item.assignedUserEmail})`,
      Time: item.time || "N/A",
      Status:
        item.status === "wip"
          ? "Work In Progress"
          : item.status === "completed"
          ? "Completed"
          : item.status === "aborted"
          ? "Aborted"
          : "Pending",
    }));
    return [
      ...data,
      {
        Client: "Total Time",
        Project: "",
        Task: "",
        Assigned: "",
        Time: totalTime,
        Status: "",
      },
    ];
  };

  return (
    <DefaultPage>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 border-b-4 border-indigo-600 pb-2 mb-4">
            Task Data
          </h1>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FaPlus size={16} className="mr-2" />
              Add New Task
            </button>
            <CSVLink
              data={prepareExportData()}
              filename={"task-data.csv"}
              className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaDownload size={16} className="mr-2" />
              Download CSV
            </CSVLink>
          </div>
        </div>

        <div className="flex flex-wrap space-x-4 mb-6">
          {/* Client Dropdown */}
          <div className="relative">
            <Select
              options={filteredClients}
              onChange={handleClientSelect}
              value={clientOptions.find(
                (client) => client.value === selectedClient
              )}
              onMenuOpen={() => setIsClientDropdownOpen(true)}
              onMenuClose={() => setIsClientDropdownOpen(false)}
              isClearable
              placeholder="Select client"
            />
          </div>
          {/* Project Dropdown */}
          <div className="relative">
            <Select
              options={filteredProjects}
              onChange={handleProjectSelect}
              value={projectOptions.find(
                (project) => project.value === selectedProject
              )}
              onMenuOpen={() => setIsProjectDropdownOpen(true)}
              onMenuClose={() => setIsProjectDropdownOpen(false)}
              isClearable
              placeholder="Select project"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <Select
              options={statusOptions}
              onChange={handleStatusSelect}
              value={statusOptions.find(
                (status) => status.value === selectedStatus
              )}
              onMenuOpen={() => setIsStatusDropdownOpen(true)}
              onMenuClose={() => setIsStatusDropdownOpen(false)}
              isClearable
              placeholder="Select status"
            />
          </div>

          {/* Date Range Picker */}
          <div className="relative flex flex-col space-y-2">
            <div className="flex space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                isClearable
                placeholderText="Select date range"
                className="border p-2 rounded w-60"
                maxDate={currentDate}
              />
            </div>
          </div>
        </div>

        {/* Display the filtered and paginated data */}
        <div className="mb-6">
          {isLoading ? (
            <ClipLoader size={50} color={"#123abc"} loading={isLoading} />
          ) : error ? (
            <p className="text-red-500">Error loading data</p>
          ) : (
            <div>
              {paginatedData.length === 0 ? (
                <p className="text-center text-gray-500 text-lg font-semibold mt-8">
                  No records found
                </p>
              ) : (
                <div>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {/* Table Headers */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedData.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.clientName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.projectName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.task}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.assignedUserName
                              ? `${item.assignedUserName} (${item.assignedUserEmail})`
                              : "Unknown User"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {item.time ? item.time : "N/A"} hrs
                          </td>
                          <td>
                            <span
                              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-md text-center inline-block ${
                                item.status === "completed"
                                  ? "bg-green-500 text-white w-32"
                                  : item.status === "wip"
                                  ? "bg-orange-300 text-black w-32"
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400"
                    >
                      <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                      Page {currentPage} of{" "}
                      {Math.ceil(
                        (taskworkAllAPIData?.length || 0) / itemsPerPage
                      )}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage ===
                        Math.ceil(
                          (taskworkAllAPIData?.length || 0) / itemsPerPage
                        )
                      }
                      className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400"
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                  <p className="mt-4 text-lg font-semibold">
                    Total Time: {totalTime}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Task Modal */}
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

        <ToastContainer />
      </div>
    </DefaultPage>
  );
};

export default Page;
