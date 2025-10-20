import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);
//@ts-ignore
export async function SMS({ smsData }) {
    const accountSid = "AC4e06b035f038a17a159bd50f37b03d59";
    const authToken = "eb86555b23178ece1fc898c581fdbf1a";
    const client = require("twilio")(accountSid, authToken);
    const message = await client.messages.create({
        body: "test message by twilio",
        from: "+16074146146",
        to: "+918287778772",
    });
    console.log(message.sid);
}
