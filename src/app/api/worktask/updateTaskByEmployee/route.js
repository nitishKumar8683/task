import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function PUT(req) {
    try {
        // Parse the request body
        const { id, time, status } = await req.json();

        // Validate inputs
        if (!id || (!time && !status)) {
            return NextResponse.json({ message: "ID and at least one field (time or status) are required" }, { status: 400 });
        }

        // Find and update the task work entry
        const updatedTaskWork = await TaskWork.findByIdAndUpdate(
            id,
            { $set: { time, status } },
            { new: true } // Return the updated document
        );

        if (!updatedTaskWork) {
            return NextResponse.json({ message: "Task Work not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Task Work updated successfully",
            success: true,
            taskworkData: updatedTaskWork,
        });
    } catch (error) {
        console.error('Error updating task work:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
