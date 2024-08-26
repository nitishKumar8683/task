import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import Client from "../../../../models/clientModel";
import Project from "../../../../models/projectModel";
import { connect } from "../../../../db/dbConfig";
import { authenticate } from "../../../../helpers/auticate";

connect();

export async function POST(req) {
    try {
        const user = await authenticate(req);
        console.log('Authenticated user:', user);


        if (!user) {
            console.error('Authentication failed: User not authenticated');
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        //console.log('Authenticated user:', user);

        // Fetch taskwork data for the authenticated user
        const taskworkData = await TaskWork.find({
            isDelete: { $ne: "1" },
            assigned: user.id // Filter based on the user's email
        }).exec();

        // Extract unique client and project IDs
        const clientIds = [...new Set(taskworkData.map(t => t.client))];
        const projectIds = [...new Set(taskworkData.map(t => t.project))];

        // Fetch client and project details
        const clients = await Client.find({ _id: { $in: clientIds } });
        const projects = await Project.find({ _id: { $in: projectIds } });

        // Create lookup maps for quick access
        const clientMap = clients.reduce((map, client) => {
            map[client._id.toString()] = client.name;
            return map;
        }, {});
        const projectMap = projects.reduce((map, project) => {
            map[project._id.toString()] = project.name;
            return map;
        }, {});

        // Enrich taskworkData with client and project names
        const enrichedTaskworkData = taskworkData.map(task => ({
            ...task.toObject(),
            clientName: clientMap[task.client] || 'Unknown Client',
            projectName: projectMap[task.project] || 'Unknown Project'
        }));

        console.log('Retrieved and enriched taskworkData:', enrichedTaskworkData);

        return NextResponse.json({
            message: "Task Work Data Retrieved Successfully",
            success: true,
            taskworkData: enrichedTaskworkData,
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
