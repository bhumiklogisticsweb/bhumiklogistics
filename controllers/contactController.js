const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handleContactForm = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message } = req.body;
    const ip = req.ip;

    try {
        // Save to DB
        await ContactMessage.create({ name, email, phone, message, ip });

        // Send email with SendGrid
        const msg = {
            to: process.env.EMAIL_RECEIVER,
            from: process.env.EMAIL_SENDER, // must be verified in SendGrid
            subject: `New Contact Message from ${name}`,
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
        <p><small>Submitted from IP: ${ip}</small></p>
      `,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error('SendGrid Error:', err);
        res.status(500).json({ message: 'Server error. Try again later.' });
    }
};
