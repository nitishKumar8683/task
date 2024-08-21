import { connect } from '../../../../db/dbConfig'
import { NextResponse } from "next/server";
import User from "../../../../models/userModel";

connect();

export async function DELETE(request, { params }) {
    const id = params.id;

    try {
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" });
        }

        if (user.isDelete === "") {
            user.isDelete = "1";
            await user.save();
            return NextResponse.json({
                message: "User isDelete successfully",
                status: 200
            });
        } else {
            return NextResponse.json({
                message: "User is already deleted",
                
            });
        }
    } catch (err) {
        console.error("Failed to update isDelete field:", err);
        return NextResponse.json(
            { message: "Failed to update isDelete field" },
            { status: 500 },
        );
    }
}
