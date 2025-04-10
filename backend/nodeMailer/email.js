const nodemailer = require('nodemailer');
const { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, ORDER_PAYMENT_SUCCESS_TEMPLATE, MILESTONE_COMPLETION_TEMPLATE, ORDER_NOTIFICATION_TEMPLATE, ORDER_STATUS_UPDATED_TEMPLATE, REVISION_STATUS_UPDATED_TEMPLATE } = require('./emailTemplate');

// Gmail SMTP config — env se lena better hai
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SMTP_EMAIL,  // your gmail
        pass: process.env.SMTP_APP_PASSWORD  // app password (not your Gmail password)
    }
});

// Sender Info
const sender = '"Vishal Yadav" <vishalyadav0987@gmail.com>';  // same email jo SMTP me use kiya hai

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: sender,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

const sendWelcomeEmail = async (email, sendingToName) => {
    try {
        const mailOptions = {
            from: sender,
            to: email,
            subject: "Welcome User",
            html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", sendingToName)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

const sendForgetPasswordEmail = async (email, resetUrl) => {
    try {
        const mailOptions = {
            from: sender,
            to: email,
            subject: "Reset Password Link",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Forget password email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending forget password email", error);
        throw new Error(`Error sending forget password email: ${error.message}`);
    }
};

const sendResetPasswordSuccessfullEmail = async (email) => {
    try {
        const mailOptions = {
            from: sender,
            to: email,
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset success email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending reset success email", error);
        throw new Error(`Error sending reset success email: ${error.message}`);
    }
};


const sendOrderConfirmationEmail = async (
    email,
    orderId,
    paymentId,
    transactionStatus,
    paymentMethod,
    totalAmount,
    customerName,
    customerEmail,
    customerPhone,
    billingAddress,
    shippingAddress,
    productRows,
    deliveryDate
) => {
    try {
        const mailOptions = {
            from: sender,
            to: email,
            subject: "Order Confirmation - Vishal Yadav: Full Stack Solution Architect",
            html: ORDER_PAYMENT_SUCCESS_TEMPLATE
                .replace(/{orderId}/g, orderId)
                .replace(/{paymentId}/g, paymentId)
                .replace(/{transactionStatus}/g, transactionStatus)
                .replace(/{paymentMethod}/g, paymentMethod)
                .replace(/{totalAmount}/g, totalAmount)
                .replace(/{customerName}/g, customerName)
                .replace(/{customerEmail}/g, customerEmail)
                .replace(/{customerPhone}/g, customerPhone)
                .replace(/{billingAddress}/g, billingAddress)
                .replace(/{shippingAddress}/g, shippingAddress)
                .replace(/{productRows}/g, productRows)
                .replace(/{deliveryDate}/g, deliveryDate)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Order confirmation email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending order confirmation email", error);
        throw new Error(`Error sending order confirmation email: ${error.message}`);
    }
};


const sendFullPaymentEmail = async (
    email,
    userName,
    title,
    orderId,
    totalAmout
) => {
    try {
        const mailOptions = {
            from: sender,
            to: email,
            subject: "Full Payment - Vishal Yadav: Full Stack Solution Architect",
            html: MILESTONE_COMPLETION_TEMPLATE
                .replace(/{userName}/g, userName)
                .replace(/{orderId}/g, orderId)
                .replace(/{title}/g, title)
                .replace(/{totalAmout}/g, totalAmout)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Milestone to full payment:", info.messageId);
    } catch (error) {
        console.error("Error sendFullPaymentEmail email", error);
        throw new Error(`Error sending order confirmation email: ${error.message}`);
    }
};

const sendEmailNotification = async (email, messageText, orderId) => {
    try {
        const orderLink = `http://localhost:5173/orders/${orderId}`;

        const mailOptions = {
            from: sender,
            to: email,
            subject: `New Message OrderId # ${orderId} - Vishal Yadav: Full Stack Solution Architect`,
            html: ORDER_NOTIFICATION_TEMPLATE
                .replace(/{messageText}/g, messageText)
                .replace(/{orderId}/g, orderId)
                .replace(/{orderLink}/g, orderLink)
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Notification email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending notification email", error);
        throw new Error(`Error sending notification email: ${error.message}`);
    }
};


const sendEmailNotificationUpdateOrderStatus = async (email, orderId, newStatus) => {
    try {
        // Generate the order link
        const orderLink = `http://localhost:5173/orders/${orderId}`;

        // Replace placeholders in the template
        const emailBody =  ORDER_STATUS_UPDATED_TEMPLATE
            .replace(/{orderId}/g, orderId)
            .replace(/{newStatus}/g, newStatus)
            .replace(/{orderLink}/g, orderLink);

        // Define mail options
        const mailOptions = {
            from: sender, // Replace with your sender email
            to: email, // Recipient email
            subject: `Order Status Updated - Order #${orderId}`, // Email subject
            html: emailBody, // Email body (HTML content)
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Notification email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending notification email", error);
        throw new Error(`Error sending notification email: ${error.message}`);
    }
};


const sendRevisionStatusEmail = async (email, orderId, revisionId, revisionStatus) => {
    try {
        // Generate the revision link
        const revisionLink = `http://localhost:5173/orders/${orderId}/revisions/${revisionId}`;

        // Replace placeholders in the template
        const emailBody = REVISION_STATUS_UPDATED_TEMPLATE
            .replace(/{orderId}/g, orderId)
            .replace(/{revisionId}/g, revisionId)
            .replace(/{revisionStatus}/g, revisionStatus)
            .replace(/{revisionLink}/g, revisionLink);

        // Define mail options
        const mailOptions = {
            from: sender, // Replace with your sender email
            to: email, // Recipient email
            subject: `Revision Status Updated - Order #${orderId}`, // Email subject
            html: emailBody, // Email body (HTML content)
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Revision status email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending revision status email", error);
        throw new Error(`Error sending revision status email: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgetPasswordEmail,
    sendResetPasswordSuccessfullEmail,
    sendOrderConfirmationEmail,
    sendFullPaymentEmail,
    sendEmailNotification,
    sendEmailNotificationUpdateOrderStatus,
    sendRevisionStatusEmail
};
