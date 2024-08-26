"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DefaultPage from "@/components/DefaultPage/DefaultPage";
import Card from "@/components/Card/Card";
import { FaUsers, FaUserTag, FaProjectDiagram, FaTasks } from "react-icons/fa";
import { fetchUserData } from "@/app/redux/user/userSlice";
import { fetchClientData } from "../../app/redux/client/clientSlice";
import { fetchProjectData } from "../../app/redux/project/projectSlice";
import { fetchTaskWorkData } from "../../app/redux/taskwork/taskworkSlice";
import { BeatLoader } from "react-spinners";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData());
    dispatch(fetchClientData());
    dispatch(fetchProjectData());
    dispatch(fetchTaskWorkData());
  }, [dispatch]);

  // Get loading states from Redux state
  const { userAllAPIData, isLoading: isUserLoading } = useSelector(
    (state) => state.userAll
  );
  const { clientAllAPIData, isLoading: isClientLoading } = useSelector(
    (state) => state.clientAll
  );
  const { projectAllAPIData, isLoading: isProjectLoading } = useSelector(
    (state) => state.projectAll
  );
  const { taskworkAllAPIData, isLoading: isTaskworkLoading } = useSelector(
    (state) => state.taskworkAll
  );

  // Calculate total counts
  const totalUsers = userAllAPIData?.length || 0;
  const totalClients = clientAllAPIData?.length || 0;
  const totalProjects = projectAllAPIData?.length || 0;
  const totalTasks = taskworkAllAPIData?.length || 0;

  // Check if any data is loading
  const isLoading =
    isUserLoading || isClientLoading || isProjectLoading || isTaskworkLoading;

  return (
    <DefaultPage>
      <div className="flex flex-col min-h-screen p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        <div className="flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <BeatLoader color="#4A90E2" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <Card title="Total Users" count={totalUsers} icon={<FaUsers />} />
              <Card
                title="Total Clients"
                count={totalClients}
                icon={<FaUserTag />}
              />
              <Card
                title="Total Projects"
                count={totalProjects}
                icon={<FaProjectDiagram />}
              />
              <Card title="Total Tasks" count={totalTasks} icon={<FaTasks />} />
            </div>
          )}
        </div>
      </div>
    </DefaultPage>
  );
};

export default Dashboard;
