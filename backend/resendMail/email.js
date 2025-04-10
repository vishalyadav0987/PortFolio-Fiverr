const { Resend } = require('resend');
const { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplate');

const resend = new Resend(process.env.RESEND_API_KEY);  // .env me RESEND_API_KEY daalna mat bhulna

const sender = "Vishal Yadav <vishalyadav@on-resend.dev>"


const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const { data, error } = await resend.emails.send({
            from: sender,
            to: [email],
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken)
        });

        if (error) throw new Error(error.message);
        console.log("Verification email sent successfully:", data);
    } catch (error) {
        console.error("Error sending verification email", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

const sendWelcomeEmail = async (email, sendingToName) => {
    try {
        const { data, error } = await resend.emails.send({
            from: sender,
            to: [email],
            subject: "Welcome User",
            html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", sendingToName)
        });

        if (error) throw new Error(error.message);
        console.log("Welcome email sent successfully:", data);
    } catch (error) {
        console.error("Error sending welcome email", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

const sendForgetPasswordEmail = async (email, resetUrl) => {
    try {
        const { data, error } = await resend.emails.send({
            from: sender,
            to: [email],
            subject: "Reset Password Link",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl)
        });

        if (error) throw new Error(error.message);
        console.log("Forget password email sent successfully:", data);
    } catch (error) {
        console.error("Error sending forget password email", error);
        throw new Error(`Error sending forget password email: ${error.message}`);
    }
};

const sendResetPasswordSuccessfullEmail = async (email) => {
    try {
        const { data, error } = await resend.emails.send({
            from: sender,
            to: [email],
            subject: "Password Reset Successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
        });

        if (error) throw new Error(error.message);
        console.log("Password reset success email sent successfully:", data);
    } catch (error) {
        console.error("Error sending reset success email", error);
        throw new Error(`Error sending reset success email: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgetPasswordEmail,
    sendResetPasswordSuccessfullEmail
};
