import { SafeUser } from "../entities/userEntity";


export interface AuthInterface {
    email: string;
    password: string;
};

export interface AuthResponse {
    success: boolean;
    message: string; 
    user?: SafeUser;
};

export interface InvalidRide {
    success: boolean;
    error_code: string; 
    error_description: string;
};