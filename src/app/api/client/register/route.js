import { NextResponse } from "next/server";
import Client from "../../../../models/clientModel";
import { connect } from "../../../../db/dbConfig"

connect()

export async function POST(req) {
    try {
        const reqBody = await req.json()
        const { name, email, phonenumber } = reqBody
        console.log(name, email, phonenumber)

        const client = await Client.findOne({ email: email });
        if (client) {
            return NextResponse.json({
                message: "Client already exists",
                status: 400 
            })
        }

        const newClient = new Client({
            name,
            email,
            phonenumber,
            isDelete: "",
            image_url: "",
            public_id: "",
        })
        const savedClient = await newClient.save();
        console.log(savedClient);

        return NextResponse.json({
            message: "User created successfully",
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