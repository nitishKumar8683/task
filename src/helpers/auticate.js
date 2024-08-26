import jwt from 'jsonwebtoken';

export async function authenticate(request) {
    const token = request.cookies.get("token")?.value || "";
    console.log('Token from cookies:', token); // Log token

    if (!token) {
        console.warn('No token found in cookies');
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log('Decoded token:', decoded); // Log decoded token
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return null;
    }
}

