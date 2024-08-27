import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password", success: false });
        }

        const tokenData = { id: user._id, email: user.email };
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1h" });

        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
            tokenData,
        });

        response.cookies.set("token", token, { httpOnly: true, path: "/" });
        response.cookies.set("role", user.role, { httpOnly: false, path: "/" });
        return response;
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
