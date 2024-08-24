// pages/api/client/uploadClient.js

import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';
import Client from "../../../../models/clientModel";
import { connect } from "../../../../db/dbConfig";

connect();

export async function POST(req, res) {
    return new Promise((resolve, reject) => {
        const form = new multiparty.Form();
        form.uploadDir = path.join(process.cwd(), 'uploads'); // Ensure this path is correct
        form.keepExtensions = true;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Form parse error:", err);
                return resolve({
                    status: 500,
                    body: JSON.stringify({
                        success: false,
                        message: "Error processing form",
                        error: err.message,
                    }),
                });
            }

            try {
                const file = files.file[0];
                const fileName = file?.originalFilename; // Adjust based on `multiparty` file properties

                if (!fileName) {
                    return resolve({
                        status: 400,
                        body: JSON.stringify({
                            success: false,
                            message: "File upload failed",
                        }),
                    });
                }

                const newClient = new Client({
                    fileName, // Save the file name in the database
                    isDelete: "", // Adjust as needed based on your schema
                });

                const savedClient = await newClient.save();
                console.log(savedClient);

                resolve({
                    status: 200,
                    body: JSON.stringify({
                        message: "Client created successfully",
                        savedClient,
                        success: true,
                    }),
                });
            } catch (error) {
                console.error("Error creating client:", error);
                resolve({
                    status: 500,
                    body: JSON.stringify({
                        success: false,
                        message: "Error creating client",
                        error: error.message,
                    }),
                });
            }
        });
    });
}

export const config = {
    api: {
        bodyParser: false, // Disable Next.js's default body parsing to handle file uploads
    },
};
