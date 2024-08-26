import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import Client from "../../../../models/clientModel";
import Project from "../../../../models/projectModel";
import User from "../../../../models/userModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function POST(req) {
    try {
        // Fetch taskwork data excluding those marked as deleted
        const taskworkData = await TaskWork.find({ isDelete: { $ne: "1" } });
        console.log("Fetched TaskWork Data:", taskworkData);

        // Collect unique client, project, and user identifiers from the taskwork data
        const clientIds = [...new Set(taskworkData.map(t => t.client ? t.client.toString() : null).filter(id => id !== null))];
        const projectIds = [...new Set(taskworkData.map(t => t.project ? t.project.toString() : null).filter(id => id !== null))];
        const userIds = [...new Set(taskworkData.map(t => t.assigned ? t.assigned.toString() : null).filter(id => id !== null))];

        console.log("Client IDs:", clientIds);
        console.log("Project IDs:", projectIds);
        console.log("User IDs:", userIds);

        // Fetch client, project, and user details based on collected IDs
        const clients = await Client.find({ _id: { $in: clientIds } });
        const projects = await Project.find({ _id: { $in: projectIds } });
        const users = await User.find({ _id: { $in: userIds } });  // Assuming userIds are ObjectIds

        console.log("Fetched Clients:", clients);
        console.log("Fetched Projects:", projects);
        console.log("Fetched Users:", users);

        // Create maps for quick lookup of client, project, and user details
        const clientMap = clients.reduce((map, client) => {
            map[client._id.toString()] = client.name;
            return map;
        }, {});
        const projectMap = projects.reduce((map, project) => {
            map[project._id.toString()] = project.name;
            return map;
        }, {});
        const userMap = users.reduce((map, user) => {
            map[user._id.toString()] = {
                name: user.name,
                email: user.email
            };
            return map;
        }, {});

        console.log("Client Map:", clientMap);
        console.log("Project Map:", projectMap);
        console.log("User Map:", userMap);

        // Enrich the taskwork data with client, project, and user information
        const enrichedTaskworkData = taskworkData.map(task => ({
            ...task.toObject(),
            clientName: clientMap[task.client ? task.client.toString() : ''] || 'Unknown Client',
            projectName: projectMap[task.project ? task.project.toString() : ''] || 'Unknown Project',
            assignedUserName: userMap[task.assigned ? task.assigned.toString() : '']?.name || 'Unknown User',
            assignedUserEmail: userMap[task.assigned ? task.assigned.toString() : '']?.email || 'Unknown Email'
        }));

        // Return the enriched taskwork data in the response
        return NextResponse.json({
            message: "Task Work Data Retrieved Successfully",
            success: true,
            taskworkData: enrichedTaskworkData,
        });
    } catch (error) {
        // Handle and return any errors that occur
        console.error("Error in POST handler:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
