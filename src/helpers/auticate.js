import jwt from 'jsonwebtoken';

export async function authenticate(request) {
    const token = request.cookies.get("token")?.value || ""; // Adjust for your setup
    if (!token) {
        console.warn('No token found in cookies');
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        return decoded; // Ensure `decoded` contains user information like email
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}
