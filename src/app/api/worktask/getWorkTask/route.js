import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import Client from "../../../../models/clientModel";
import Project from "../../../../models/projectModel";
import { connect } from "../../../../db/dbConfig";

connect()

export async function POST(req) {
    try {
        const taskworkData = await TaskWork.find({ isDelete: { $ne: "1" } });
        const clientIds = [...new Set(taskworkData.map(t => t.client))];
        const projectIds = [...new Set(taskworkData.map(t => t.project))];
        const clients = await Client.find({ _id: { $in: clientIds } });
        const projects = await Project.find({ _id: { $in: projectIds } });
        const clientMap = clients.reduce((map, client) => {
            map[client._id.toString()] = client.name;
            return map;
        }, {});
        const projectMap = projects.reduce((map, project) => {
            map[project._id.toString()] = project.name;
            return map;
        }, {});

        const enrichedTaskworkData = taskworkData.map(task => ({
            ...task.toObject(),
            clientName: clientMap[task.client] || 'Unknown Client',
            projectName: projectMap[task.project] || 'Unknown Project'
        }));

        return NextResponse.json({
            message: "Task Work Data Retrieve Successfully",
            success: true,
            taskworkData: enrichedTaskworkData,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}