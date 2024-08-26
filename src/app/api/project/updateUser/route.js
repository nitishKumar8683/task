import { NextResponse } from "next/server";
import Project from "../../../../models/projectModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function PUT(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const reqBody = await request.json();
    const { name } = reqBody;

    try {
        const updatedProject = await Project.findByIdAndUpdate(id, { name });

        if (!updatedProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Update successful",
            status: 200,
            updatedProject,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
