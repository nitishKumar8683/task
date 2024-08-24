import { NextResponse } from "next/server";
import Client from "../../../../models/clientModel";
import { connect } from "../../../../db/dbConfig"

connect()

export async function POST(req) {
    try {
        const clientData = await Client.find({
            isDelete: { $ne: "1" },
        })
        console.log(clientData);
        return NextResponse.json({
            message: "Client Data Retrieve Successfully",
            success: true,
            clientData, 
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}