import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }
        const task = await TaskWork.findById(id);

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }
        task.isDelete = 1;
        await task.save();
        return NextResponse.json({ message: 'Task successfully deleted' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting task work:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
