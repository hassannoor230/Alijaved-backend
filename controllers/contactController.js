import Contact from "../models/Contact.js";
import sendEmail from "../utils/sendEmail.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required" });
    }

    const contact = await Contact.create(req.body);
    const adminEmail = process.env.ADMIN_EMAIL;

    // A serverless function can finish as soon as its HTTP response is sent.
    // Await delivery so Vercel does not terminate email sending early.
    const emailResults = await Promise.allSettled([
      adminEmail
        ? sendEmail({
            to: adminEmail,
            subject: `New portfolio lead: ${name}`,
            html: `
              <h2>New contact form submission</h2>
              <p><b>Name:</b> ${name}</p>
              <p><b>Email:</b> ${email}</p>
              ${req.body.budget ? `<p><b>Budget:</b> ${req.body.budget}</p>` : ""}
              <p><b>Message:</b></p>
              <p>${message}</p>
            `,
          })
        : Promise.reject(new Error("ADMIN_EMAIL is not configured")),
      sendEmail({
        to: email,
        subject: "Thanks for reaching out!",
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for getting in touch — I've received your message and will get back to you within 24 hours.</p>
          <p>Here's a copy of what you sent:</p>
          <blockquote style="border-left:3px solid #e6141f;padding-left:12px;color:#555;">${message}</blockquote>
          <p>Talk soon,<br/>Ali</p>
        `,
      }),
    ]);

    const emailErrors = emailResults
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason?.message || "Unknown email error");

    if (emailErrors.length) {
      console.error("Email send failed:", emailErrors.join(" | "));
      return res.status(201).json({
        message: "Your message was saved, but email delivery needs attention.",
        contact,
        emailSent: false,
      });
    }

    return res.status(201).json({
      message: "Thanks — I'll get back to you within 24 hours.",
      contact,
      emailSent: true,
    });
  } catch (err) {
    return res.status(400).json({ message: "Failed to send message", error: err.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages", error: err.message });
  }
};
