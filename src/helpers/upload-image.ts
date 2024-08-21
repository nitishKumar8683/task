import { cloudinary } from "./cloudinary"; // Adjust the path as per your project structure

export const UploadImage = async (file: File, folder: string) => {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder,
        },
        (err: any, result: any) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(bytes);
    });
  } catch (error:any) {
    throw new Error(`Error uploading image: ${error.message}`);
  }
};
