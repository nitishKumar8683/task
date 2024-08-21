import { getDataUser } from "../../../../helpers/getUserData";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../db/dbConfig"

connect()

export async function GET(request) {
    try {
        const userId = await getDataUser(request)
        const dataUser = await User.findOne({ _id: userId }).select("-password")
        return NextResponse.json({
            message: "User found",
            dataUser
        })
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }
}