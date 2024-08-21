import jwt from "jsonwebtoken";

export const getDataUser = (request) => {
  try {
    const enCodedToken = request.cookies.get("token")?.value || "";
    const deCodedToken = jwt.verify(enCodedToken, process.env.TOKEN_SECRET);
    return deCodedToken.id;
  } catch (error) {
    throw new Error(error.message);
  }
};
