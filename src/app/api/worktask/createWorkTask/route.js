import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import { connect } from "../../../../db/dbConfig";


connect();

export async function POST(req) {
    try {
        const reqBody = await req.json();
        const { client, project, task , assigned } = reqBody;

        const newTaskWork = new TaskWork({
            client,
            project,
            task,
            assigned,
            status : "",
            time : "",
            isDelete: "",
        });
        const savedTaskWork = await newTaskWork.save();
        //(savedTaskWork);

        return NextResponse.json({
            message: "Task Work created successfully",
            savedTaskWork,
            success: true,
        });
    } catch (error) {
        console.error("Error creating task work:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error creating task work",
                error: error.message,
            },
            { status: 500 },
        );
    }
}
