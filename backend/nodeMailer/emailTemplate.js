const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #ff6347, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verify Your Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for signing up! Your verification code is:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff6347;">{verificationCode}</span>
    </div>
    <p>Enter this code on the verification page to complete your registration.</p>
    <p>This code will expire in 15 minutes for security reasons.</p>
    <p>If you didn't create an account with us, please ignore this email.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #ff6347, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #ff6347; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #ff6347, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #ff6347; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our App</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #ff6347, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Welcome to Our App!</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello {userName},</p>
    <p>We're excited to have you on board! Thank you for joining our community.</p>
    <p>To help you get started, here are a few resources:</p>
    <ul style="padding-left: 20px;">
      <li><a href="{"#"}" style="color: #ff6347; text-decoration: none;">Getting Started Guide</a></li>
      <li><a href="{"#"}" style="color: #ff6347; text-decoration: none;">Explore Features</a></li>
      <li><a href="{"#"}" style="color: #ff6347; text-decoration: none;">Support & FAQs</a></li>
    </ul>
    <p>If you have any questions, feel free to reach out to our support team.</p>
    <p>We hope you enjoy your experience with us!</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

const ORDER_PAYMENT_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background-color: #0d9488; padding: 25px; text-align: center; border-radius: 5px 5px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmation</h1>
  </div>

  <div style="background-color: white; padding: 25px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <!-- Order Summary -->
    <div style="margin-bottom: 25px;">
      <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">Order Summary</h2>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>Payment ID:</strong> {paymentId}</p>
      <p><strong>Status:</strong> {transactionStatus}</p>
      <p><strong>Payment Method:</strong> {paymentMethod}</p>
      <p><strong>Total Paid:</strong> ₹{totalAmount}</p>
    </div>

    <!-- Customer Details -->
    <div style="margin-bottom: 25px;">
      <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">Customer Details</h2>
      <p><strong>Name:</strong> {customerName}</p>
      <p><strong>Email:</strong> {customerEmail}</p>
      <p><strong>Phone:</strong> {customerPhone}</p>
      
      <div style="display: flex; gap: 20px; margin-top: 15px;">
        <div style="flex: 1;">
          <h3 style="color: #0d9488; margin: 0;">Billing Address</h3>
          <p>{billingAddress}</p>
        </div>
        <div style="flex: 1;">
          <h3 style="color: #0d9488; margin: 0;">Shipping Address</h3>
          <p>{shippingAddress}</p>
        </div>
      </div>
    </div>

    <!-- Product Details -->
    <div style="margin-bottom: 25px;">
      <h2 style="color: #0d9488; border-bottom: 2px solid #0d9488; padding-bottom: 5px;">Product Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th style="text-align: left; padding: 10px;">Product</th>
            <th style="text-align: center; padding: 10px;">Qty</th>
            <th style="text-align: right; padding: 10px;">Price</th>
            <th style="text-align: right; padding: 10px;">Total</th>
            <th style="text-align: right; padding: 10px;">PaidAt</th>
          </tr>
        </thead>
        <tbody>
          {productRows}
        </tbody>
      </table>
    </div>

    <!-- Delivery Date -->
    <div style="background-color: #0d9488; color: white; padding: 15px; border-radius: 5px; text-align: center;">
      <h3 style="margin: 0;">Expected Delivery Date</h3>
      <p style="font-size: 18px; margin: 10px 0;">{deliveryDate}</p>
    </div>

    <div style="margin-top: 25px; text-align: center;">
      <p>Need help? Contact our support team</p>
      <p style="margin: 0;">📞 +91-XXXXX-XXXXX | ✉️ support@yourbrand.com</p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply to this email.</p>
    <p>© 2023 Your Brand Name. All rights reserved.</p>
  </div>
</body>
</html>
`;


const MILESTONE_COMPLETION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Completion Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181f;">
  <div style="background: #0d9488; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Project Completed & Payment Received!</h1>
  </div>
  
  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <p style="color: #0f201f;">Dear {UserName},</p>
    <p style="color: #0f201f;">We're thrilled to confirm your project is successfully completed and full payment has been received! 🚀</p>

    <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #5eead4; margin: 25px 0;">
      <h3 style="color: #0d9488; margin-top: 0;">📜 Order Summary</h3>
      <p style="color: #0f201f;"><strong>Project Name:</strong> {title}<br>
      <strong>Order ID:</strong> <span style="color: #0d9488;">{orderId}</span><br>
      <strong>Final Payment:</strong> ₹{totalAmout}<br>
      <strong>Status:</strong> <span style="color: #0d9488; font-weight: bold;">✅ Completed</span></p>
    </div>

    <div style="margin: 30px 0;">
      <h3 style="color: #0d9488;">💡 Next Steps</h3>
      <ul style="color: #0f201f; padding-left: 20px;">
        <li>📥 <a href="#" style="color: #0d9488; text-decoration: none;">Download Final Deliverables</a></li>
        <li>⭐ <a href="#" style="color: #0d9488; text-decoration: none;">Share Your Experience</a></li>
        <li>❓ <a href="#" style="color: #0d9488; text-decoration: none;">Support Center</a></li>
      </ul>
    </div>

    <p style="color: #0f201f;">Thank you for choosing VY ! We look forward to collaborating again soon. 😊</p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 0.9em;">Best regards,<br>
      <strong style="color: #0d9488;">VY</strong></p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;

const ORDER_NOTIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181f;">
  <div style="background: #0d9488; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">📦 New Message Notification</h1>
  </div>

  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <p style="color: #0f201f;">Dear Customer,</p>
    <p style="color: #0f201f;">{messageText}</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{orderLink}" style="background-color: #0d9488; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        View Order Details →
      </a>
    </div>

    <div style="margin-top: 25px; padding: 15px; background: #f8fafc; border-left: 4px solid #5eead4;">
      <p style="color: #0f201f; margin: 0;">
        <strong>Order ID:</strong> <span style="color: #0d9488;">#{orderId}</span><br>
        <strong>Direct Link:</strong> <a href="{orderLink}" style="color: #0d9488; text-decoration: none;">{orderLink}</a>
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 0.9em;">
        Need help? Reply to this email or contact our support team.<br>
        <strong style="color: #0d9488;">Vishal Yadav: Full Stack Solution Architect</strong>
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`;


const ORDER_STATUS_UPDATED_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Updated</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181f;">
  <div style="background: #0d9488; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🔄 Order Status Updated</h1>
  </div>

  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <p style="color: #0f201f;">Dear Customer,</p>
    <p style="color: #0f201f;">
      The status of your order <strong>#{orderId}</strong> has been updated to <strong style="color: #0d9488;">{newStatus}</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{orderLink}" style="background-color: #0d9488; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        View Order Details →
      </a>
    </div>

    <div style="margin-top: 25px; padding: 15px; background: #f8fafc; border-left: 4px solid #5eead4;">
      <p style="color: #0f201f; margin: 0;">
        <strong>Order ID:</strong> <span style="color: #0d9488;">#{orderId}</span><br>
        <strong>New Status:</strong> <span style="color: #0d9488;">{newStatus}</span><br>
        <strong>Direct Link:</strong> <a href="{orderLink}" style="color: #0d9488; text-decoration: none;">{orderLink}</a>
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 0.9em;">
        Need help? Reply to this email or contact our support team.<br>
        <strong style="color: #0d9488;">Vishal Yadav: Full Stack Solution Architect</strong>
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>
`

const REVISION_STATUS_UPDATED_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revision Status Updated</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #18181f;">
  <div style="background: #0d9488; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🔄 Revision Status Updated</h1>
  </div>

  <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    <p style="color: #0f201f;">Dear Customer,</p>
    <p style="color: #0f201f;">
      The status of your revision for <strong>Order #{orderId}</strong> has been updated to <strong style="color: #0d9488;">{revisionStatus}</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{revisionLink}" style="background-color: #0d9488; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        View Revision Details →
      </a>
    </div>

    <div style="margin-top: 25px; padding: 15px; background: #f8fafc; border-left: 4px solid #5eead4;">
      <p style="color: #0f201f; margin: 0;">
        <strong>Order ID:</strong> <span style="color: #0d9488;">#{orderId}</span><br>
        <strong>Revision ID:</strong> <span style="color: #0d9488;">{revisionId}</span><br>
        <strong>New Status:</strong> <span style="color: #0d9488;">{revisionStatus}</span><br>
        <strong>Direct Link:</strong> <a href="{revisionLink}" style="color: #0d9488; text-decoration: none;">{revisionLink}</a>
      </p>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="color: #64748b; font-size: 0.9em;">
        Need help? Reply to this email or contact our support team.<br>
        <strong style="color: #0d9488;">Vishal Yadav: Full Stack Solution Architect</strong>
      </p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 0.8em;">
    <p>This is an automated message. Please do not reply directly to this email.</p>
  </div>
</body>
</html>`

// Usage function


module.exports = {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  ORDER_PAYMENT_SUCCESS_TEMPLATE,
  MILESTONE_COMPLETION_TEMPLATE,
  ORDER_NOTIFICATION_TEMPLATE,
  ORDER_STATUS_UPDATED_TEMPLATE,
  REVISION_STATUS_UPDATED_TEMPLATE,
}