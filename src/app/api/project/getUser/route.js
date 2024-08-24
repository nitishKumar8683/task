import { NextResponse } from "next/server";
import Project from "../../../../models/projectModel";
import { connect } from "../../../../db/dbConfig"

connect()

export async function POST(req) {
    try {
        const clientData = await Project.find({
            isDelete: { $ne: "1" },
        })
        console.log(clientData);
        return NextResponse.json({
            message: "Project Data Retrieve Successfully",
            success: true,
            clientData, 
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}