import { NextResponse } from "next/server";
import Project from "../../../../models/projectModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function DELETE(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    try {
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        if (project.isDelete === "") {
            project.isDelete = "1";
            await project.save();
            return NextResponse.json({
                message: "Project deleted successfully",
                status: 200
            });
        } else {
            return NextResponse.json({
                message: "Project is already deleted",
                status: 400
            });
        }
    } catch (err) {
        console.error("Failed to update isDelete field:", err);
        return NextResponse.json(
            { message: "Failed to update isDelete field" },
            { status: 500 }
        );
    }
}
