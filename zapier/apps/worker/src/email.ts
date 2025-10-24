("use server");

//using the api key of my unofficial email id

import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailDatatype {
  email: string;
  message: string;
}

export async function sendEmail(emailData: EmailDatatype) {
  try {
    const { email, message } = emailData;

    const emailContent = `
      <hr>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <hr>
    `;

    console.log(email, message, emailContent);

    const { data, error } = await resend.emails.send({
      from: "Krrish <onboarding@resend.dev>",
      to: [email],
      subject: `Email from ZAPIER`,
      html: emailContent,
    });

    if (error) {
      console.log("Error in sending the mail");
      return { success: false, error };
    }
    console.log("Mail sent successfully");
    return { success: true, data };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email. Please try again." };
  }
}
