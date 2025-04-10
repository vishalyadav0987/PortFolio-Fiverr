const brevoClient = require("./mail.config");
const { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } = require('./emailTemplate')

const sender = { // Ye add karna jaroori hai
    name: "Vishal yadav",
    email: "viahalyadav0987@gmail.com"  // Ye same hona chahiye jo Brevo me verified hai
};


const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const response = await brevoClient.sendTransacEmail({
            sender,
            to: recipient,
            subject: "Verify your email",
            htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            headers: { "category": "Email Verification" }
        })
        // console.log("Email sent successfully", response)
    } catch (error) {
        console.error("Error sending verification email", error)
        throw new Error(`Error sending verification email: ${error.message}`)
    }
}

const sendWelcomeEmail = async (email, sendingToName) => {
    const recipient = [{ email }]

    try {
        const response = await brevoClient.sendTransacEmail({
            sender,
            to: recipient,
            subject: "Welcome User",
            htmlContent: WELCOME_EMAIL_TEMPLATE.replace("{userName}", sendingToName)
        })
        console.log("Welcome email sent successfully", response)
    } catch (error) {
        console.error("Error sending welcome email", error)
        throw new Error(`Error sending welcome email: ${error.message}`)
    }
}

const sendForgetPasswordEmail = async (email, resetUrl) => {
    const recipient = [{ email }]

    try {
        const response = await brevoClient.sendTransacEmail({
            sender,
            to: recipient,
            subject: "Reset Password Link",
            htmlContent: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
            headers: { "category": "Password Reset" }
        })
        console.log("Forget password email sent successfully", response)
    } catch (error) {
        console.error("Error sending forget password email", error)
        throw new Error(`Error sending forget password email: ${error.message}`)
    }
}

const sendResetPasswordSuccessfullEmail = async (email) => {
    const recipient = [{ email }]

    try {
        const response = await brevoClient.sendTransacEmail({
            sender,
            to: recipient,
            subject: "Password Reset Successfully",
            htmlContent: PASSWORD_RESET_SUCCESS_TEMPLATE,
            headers: { "category": "Password Reset" }
        })
        console.log("Password reset success email sent successfully", response)
    } catch (error) {
        console.error("Error sending reset success email", error)
        throw new Error(`Error sending reset success email: ${error.message}`)
    }
}

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendForgetPasswordEmail,
    sendResetPasswordSuccessfullEmail
}
