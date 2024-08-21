import { NextResponse } from "next/server";
import User from "../../../../../models/userModel";
import { connect } from "../../../../../db/dbConfig"

connect();

export async function PUT(request, { params }) {
    const id = params.id;
    const reqBody = await request.json();
    const { firstName, lastName, email, phonenumber } = reqBody;
    
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstName, lastName, email, phonenumber
        });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found..." });
        }

        const dataResponse = NextResponse.json({
            message: "Updated Successfullaa",
            status: 201, 
            updatedUser,
        });
        return dataResponse;
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}
