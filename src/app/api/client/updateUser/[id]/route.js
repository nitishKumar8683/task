import { NextResponse } from "next/server";
import Client from "../../../../../models/clientModel";
import { connect } from "../../../../../db/dbConfig"

connect();

export async function PUT(request, { params }) {
    const id = params.id;
    const reqBody = await request.json();
    const { name, role, email, phonenumber } = reqBody;
    
    try {
        const updatedUser = await Client.findByIdAndUpdate(id, {
            name, role, email, phonenumber
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found..." });
        }

        const dataResponse = NextResponse.json({
            message: "Updated Successfull",
            status: 201, 
            updatedUser,
        });
        return dataResponse;
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}
