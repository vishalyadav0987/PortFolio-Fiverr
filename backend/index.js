const express = require("express");
const PORT = process.env.PORT || 4000;
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require("./connectDB/connect");
const { app, server } = require('./socket/Socket');
const cors = require('cors')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const authUserRoute = require("./routes/authUserRoutes");
const gigRoute = require('./routes/Admin/gigRoutes');
const orderRoute = require('./routes/orderRoutes');
const messageRoute = require('./routes/messageRoutes/messageRoutes');
const paymentRoute = require('./routes/paymentRotes');
const notificationRoute = require('./routes/notificationRoutes')
const clientNotificationRoute = require('./routes/clientNotifyRoutes')
const clientProjectRoute = require('./routes/Admin/clientProjectRoutes')


app.use(cors({
    origin: [
        "http://localhost:3000", // Admin
        process.env.FRONTEND_URL  // Client
        // 'http://localhost:5173'
      ],
    credentials: true
}));

require('./config/cornJob'); // Importing the cron job

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    timeout: 120000, // 2 minutes
})


app.use('/api/v1/user', authUserRoute);
app.use('/api/v1/gig', gigRoute);
app.use('/api/v1/gig', orderRoute);
app.use('/api/v1/communicate', messageRoute);
app.use('/api/v1/gig/payment', paymentRoute);
app.use('/api/v1/notify', notificationRoute);
app.use('/api/v1/notify/client', clientNotificationRoute);
app.use('/api/v1/client',clientProjectRoute );


app.use("/test", (req, res) => {
    res.send("<h1>This route is used for testing purposes. Yeah, it's working!</h1>");
});

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        server.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log("Something went wrong in connecting to the server:", error.message);
    }
}

start();


/************************************************************************ 
        Koi sensetive data nh hai sabhi check kar liya hai ✅
*************************************************************************/