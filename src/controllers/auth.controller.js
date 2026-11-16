
import { registerUser } from '../services/auth.service.js';

import { verifyEmail } from '../services/emailVerification.service.js';


/**
 * Handle user registration requests.
 */
export const register = async (req, res) => {
    // The validation middleware provides validated request data.
    const user = await registerUser(req.validated.body);

    // Return HTTP 201 when the account is successfully created.
    res.status(201).json({
        success: true,
        message: 'Registration successful. Please verify your email.',
        data: {
            user,
        },
    });
};



/**
 * Handle email verification requests.
 */
export const verifyEmailAddress = async (req, res) => {
    // Read the verification token from the URL query parameters.
    // const { token } = req.query;
    const { token } = req.validated.query;

    // Verify the token and activate the associated account.
    const user = await verifyEmail(token);

    // Return the verified account information.
    res.status(200).json({
        success: true,
        message: 'Email verified successfully. Your account is now active.',
        data: {
            user,
        },
    });
};
