import { NextResponse } from "next/server";
import Project from "../../../../models/projectModel";
import { connect } from "../../../../db/dbConfig"

connect()

export async function POST(req) {
    try {
        const reqBody = await req.json()
        const { name} = reqBody
        console.log(name)

        const newClient = new Project({
            name,
            isDelete: "",
        })
        const savedClient = await newClient.save();
        console.log(savedClient);

        return NextResponse.json({
            message: "Project created successfully",
            savedClient,
            success: true,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error creating user",
                error: error.message,
            },
            { status: 500 },
        );
    }
}