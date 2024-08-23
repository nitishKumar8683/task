import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import { connect } from "../../../../db/dbConfig";

connect()

export async function GET(req) {
    try {
        const taskworkData = await TaskWork.find({
            isDelete: { $ne: "1" },
        })
        console.log(taskworkData);
        return NextResponse.json({
            message: "Task Work Data Retrieve Successfully",
            success: true,
            taskworkData,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}