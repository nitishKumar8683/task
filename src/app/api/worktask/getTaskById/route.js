import { NextResponse } from "next/server";
import TaskWork from "../../../../models/taskworkModel";
import { connect } from "../../../../db/dbConfig";
import { authenticate } from "../../../../helpers/auticate";

connect();

export async function GET(req) {
    try {
        const user = await authenticate(req);

        if (!user) {
            console.error('Authentication failed: User not authenticated');
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }

        console.log('Authenticated user:', user);

        // Ensure `user.email` is correctly used
        const taskworkData = await TaskWork.find({
            isDelete: { $ne: "1" },
            assigned: user.email // Filter based on the user's email
        }).exec();

        console.log('Retrieved taskworkData:', taskworkData);

        return NextResponse.json({
            message: "Task Work Data Retrieved Successfully",
            success: true,
            taskworkData,
        });
    } catch (error) {
        console.error('Error occurred:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
