interface EmailData {
    email: string;
    message: string;
}
export declare function sendEmail(emailData: EmailData): Promise<{
    success: boolean;
    error: import("resend").ErrorResponse;
    data?: undefined;
} | {
    success: boolean;
    data: import("resend").CreateEmailResponseSuccess;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    data?: undefined;
}>;
export {};
//# sourceMappingURL=email.d.ts.map