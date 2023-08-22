export class Constants {
    static readonly Attributes = {
        EMAIL: 'email',
        PASSWORD: 'password',
    };

    static readonly messages = {
        EMAIL_VERIFICATION_SUCCESS: 'Email Successfully Verified!'
    }

    static readonly ErrorMessages = {
        FAILED_CREATE_USER: 'Failed to create user.',
        FAILED_FETCH_USERS: 'Failed to fetch users.',
        FAILED_DELETE_USER: 'Failed to delete user.',
        FAILED_UPDATE_USER: 'Failed to update user.',

        EMAIL_CONFLICT: 'Email address already exists.',
        EMAIL_NOT_FOUND: 'Email address not found.',
        USER_NOT_FOUND: 'User not found.',

        INVALID_ID_FORMAT: 'Invalid ID format.',
        INVALID_EMAIL: 'Invalid email address.',
        MIN_PASSWORD: 'Minimum password length is 4.',
        MAX_PASSWORD: 'Maximum password length is 15.',

        PASSWORD_MISMATCH: 'Password does not matched.',
        JWT_TOKEN_EXPIRED: 'Token has expired.',
        JWT_TOKEN_GENERATION_ERROR: 'Error generating verification token.',
        SOME_ERROR_OCCURRED: 'Some Error Occurred.',
    };
}
