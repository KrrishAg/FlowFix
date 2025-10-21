interface SmsData {
    phone: string;
    message: string;
}
export declare function sendSms(smsData: SmsData): Promise<{
    success: boolean;
    error: string;
} | undefined>;
export {};
//# sourceMappingURL=sms.d.ts.map