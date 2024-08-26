import { NextResponse } from "next/server";
import Client from "../../../../models/clientModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function DELETE(request) {
    const url = new URL(request.url);
    const id = url.searchParams.get('id'); 

    try {
        const user = await Client.findById(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.isDelete === "") {
            user.isDelete = "1";
            await user.save();
            return NextResponse.json({
                message: "Client deleted successfully",
                status: 200
            });
        } else {
            return NextResponse.json({
                message: "Client is already deleted",
                status: 400
            });
        }
    } catch (err) {
        console.error("Failed to update isDelete field:", err);
        return NextResponse.json(
            { message: "Failed to update isDelete field" },
            { status: 500 }
        );
    }
}
