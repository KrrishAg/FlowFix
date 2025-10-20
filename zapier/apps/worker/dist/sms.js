import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();
export async function sendSms(smsData) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTHTOKEN;
    const client = twilio(accountSid, authToken);
    const message = await client.messages.create({
        body: smsData.message,
        from: process.env.TWILIO_SENDER_NUMBER,
        to: process.env.TWILIO_RECEIVER_NUMBER || "",
    });
    console.log(message.sid);
}
