import { NextResponse } from "next/server";
import Client from "../../../../models/clientModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function PUT(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const reqBody = await request.json();
    const { name, role, email, phonenumber } = reqBody;

    try {
        const updatedUser = await Client.findByIdAndUpdate(id, {
            name, role, email, phonenumber
        }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found..." }, { status: 404 });
        }

        return NextResponse.json({
            message: "Update Successful",
            status: 200,
            updatedUser,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
