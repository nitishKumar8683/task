import { UploadImage } from "../../../../helpers/upload-image";
import { NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../db/dbConfig";
import mongoose from "mongoose";

connect();

export async function PUT(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id'); 

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({
            error: "Invalid or missing ID",
            status: 400,
        });
    }

    try {
        const formData = await req.formData();
        const image = formData.get("image");
        const name = formData.get("name");
        const email = formData.get("email");
        const phonenumber = formData.get("phonenumber");

        const currentUser = await User.findById(id);
        if (!currentUser) {
            return NextResponse.json({
                error: "User not found",
                status: 404,
            });
        }

        let imageUrl = currentUser.image_url;
        if (image && image instanceof Blob) {
            const data = await UploadImage(image, "next-js-payroll");
            imageUrl = data?.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            image_url: imageUrl,
            name,
            email,
            phonenumber,
        }, { new: true });

        if (!updatedUser) {
            return NextResponse.json({
                error: "User not found",
                status: 404,
            });
        }

        return NextResponse.json({
            msg: "Profile updated successfully",
            status: 200,
            updateMe: updatedUser
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            status: 500,
        });
    }
}
