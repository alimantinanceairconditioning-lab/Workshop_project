import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days
const COOKIE_NAME = "admin_token";

export interface JWTPayload {
    userId: string;
    email: string;
    name: string;
    role: string;
}

/**
 * Generate JWT token
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Set authentication cookie
 */
export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    
    const isProduction = process.env.NODE_ENV === "production";
    
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true, // Prevents JavaScript access (XSS protection)
        secure: isProduction, // HTTPS only in production
        sameSite: "lax", // CSRF protection
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
        path: "/", // Available across entire site
        priority: "high", // High priority cookie
    });
}

/**
 * Get authentication token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);
    return token?.value || null;
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Get current authenticated user from cookies
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
    const token = await getAuthToken();
    if (!token) return null;
    return verifyToken(token);
}
