import { NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function PUT(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
        return NextResponse.json({
            error: "ID parameter is required",
            status: 400,
        });
    }

    const reqBody = await req.json();
    const { name, role, email, phonenumber } = reqBody;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            name, role, email, phonenumber
        }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found..." });
        }

        return NextResponse.json({
            message: "Updated Successfully",
            status: 200,
            updatedUser,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}
