import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

interface RazorpayDatatype {
  keyId: string;
  keySecret: string;
  amntInPaise: string;
  description: string;
  custName: string;
  custEmail: string;
}

export async function sendRazorpay(razorpayData: RazorpayDatatype) {
  try {
    let { keyId, keySecret, amntInPaise, description, custName, custEmail } =
      razorpayData;
    if (!keyId) keyId = process.env.RAZORPAY_KEY_ID || "";
    if (!keySecret) keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const paymentLink = await razorpay.paymentLink.create({
      amount: amntInPaise,
      currency: "INR",
      description,
      customer: {
        name: custName,
        email: custEmail,
      },
      notify: {
        sms: false,
        email: false, //cuz we want to notify ourselves
      },
    });

    console.log(
      "Razorpay payment link created successfully:",
      paymentLink.short_url
    );

    return paymentLink.short_url;
  } catch (error: any) {
    console.error("Razorpay payment link creation failed:", error);
  }
}
