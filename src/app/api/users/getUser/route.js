import { NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../db/dbConfig"

connect()

export async function GET(req) {
    try {
        const usersData = await User.find({
            role: { $ne: "admin" },
            isDelete: { $ne: "1" },
        }).select("-password")
        console.log(usersData);
        return NextResponse.json({
            message: "User Retrieve Successfully",
            success: true,
            usersData,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}