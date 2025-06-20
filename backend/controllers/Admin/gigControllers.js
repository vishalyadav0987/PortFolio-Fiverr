const GigSchema = require('../../models/GigSchema');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const UserSchema = require('../../models/UserSchema');
const NotificationSchema = require('../../models/NotificationSchema')
const { io, onlineUsers } = require('../../socket/Socket')

/*------------------------------------------
        Create gig Controller
------------------------------------------*/
const createGig = async (req, res) => {
    try {
        const safeParse = (data) => {
            try {
                return typeof data === "string" ? JSON.parse(data) : data;
            } catch (error) {
                console.error("Invalid JSON format:");
                return null;
            }
        };

        req.body.PricingPlans = safeParse(req.body.PricingPlans);
        req.body.FAQ = safeParse(req.body.FAQ);
        req.body.extraFeatures = safeParse(req.body.extraFeatures);

        // Handle thumbnail images
        let images = [];
        if (typeof req.body.thumbnailImages === "string") {
            images.push(req.body.thumbnailImages);
        } else if (Array.isArray(req.body.thumbnailImages)) {
            images = req.body.thumbnailImages;
        }

        const imagesLinks = await Promise.all(
            images.map(async (img) => {
                // Check if the image is a valid base64 string
                if (!img || typeof img !== 'string' || !img.startsWith('data:image')) {
                    throw new Error('Invalid image format');
                }

                // Upload image to Cloudinary
                try {
                    const result = await cloudinary.uploader.upload(img, {
                        folder: "products",
                        resource_type: "auto"
                    });
                    return { public_id: result.public_id, url: result.secure_url };
                } catch (error) {
                    console.error("Cloudinary upload error:", error);
                    throw new Error(`Image upload failed: ${error.message}`);
                }
            })
        );

        req.body.thumbnailImages = imagesLinks;

        // Handle MyPortfolio
        let portfolio = [];
        if (Array.isArray(req.body.MyPortfolio)) {
            portfolio = await Promise.all(
                req.body.MyPortfolio.map(async (project) => {
                    let projectImages = [];
                    if (typeof project.projectImages === "string") {
                        projectImages.push(project.projectImages);
                    } else if (Array.isArray(project.projectImages)) {
                        projectImages = project.projectImages;
                    }

                    const projectImageLinks = await Promise.all(
                        projectImages.map(async (img) => {
                            // Check if the image is a valid base64 string
                            if (!img || typeof img !== 'string' || !img.startsWith('data:image')) {
                                throw new Error('Invalid project image format');
                            }

                            try {
                                const result = await cloudinary.uploader.upload(img, {
                                    folder: "portfolio",
                                    resource_type: "auto"
                                });
                                return { public_id: result.public_id, url: result.secure_url };
                            } catch (error) {
                                console.error("Cloudinary upload error:", error);
                                throw new Error(`Project image upload failed: ${error.message}`);
                            }
                        })
                    );

                    return { ...project, projectImages: projectImageLinks };
                })
            );
        }

        req.body.MyPortfolio = portfolio; // ✅ Correct assignment


        // Extract data safely
        const {
            title,
            description,
            thumbnailImages,
            MyPortfolio = [],
            PricingPlans = [],
            extraFeatures = [],
            FAQ = [],
            techStack = "",
            functionality = "",
            websiteType = ""
        } = req.body;

        const { from, since, AvgResponseT, Languages, AboutMe } = req.body;

        // Validation
        if (!title || !thumbnailImages.length || !description || !from || !since || !AvgResponseT || !Languages?.length || !AboutMe) {
            return res.status(400).json({ success: false, message: "All required fields must be provided!" });
        }

        // Create new gig
        const newGig = new GigSchema({
            title,
            thumbnailImages,
            description,
            DetailedAboutYourself: { from, since, AvgResponseT, Languages, AboutMe },
            MyPortfolio,
            PricingPlans,
            extraFeatures,
            FAQ,
            projectDetails: {
                websiteType,
                techStack,
                functionality,
            }
        });

        const savedGig = await newGig.save();

        return res.status(201).json({
            success: true,
            message: "Gig created successfully!",
            gig: savedGig
        });
    } catch (error) {
        console.error("Something went wrong in createGig function:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Something went wrong in createGig!",
            error: error.message,
            details: error.stack 
        });
    }
};





/*------------------------------------------
        Get All Gigs Controller (Simple)
------------------------------------------*/
const getAllGigs = async (req, res) => {
    try {
        const gigs = await GigSchema.find();
        return res.status(200).json({
            success: true,
            gigs
        });
    } catch (error) {
        console.log("Error in getAllGigs:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch gigs" });
    }
};







/*------------------------------------------
        Get Single Gig By ID Controller
------------------------------------------*/
const getSingleGig = async (req, res) => {
    try {
        const { id } = req.params;

        const gig = await GigSchema.findById(id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found!"
            });
        }

        return res.status(200).json({
            success: true,
            gig
        });

    } catch (error) {
        console.log("Error in getSingleGig:", error.message);
        return res.status(500).json({ success: false, message: "Failed to fetch gig" });
    }
};






/*------------------------------------------
        Update Gig Controller
------------------------------------------*/
const updateGig = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedGig = await GigSchema.findByIdAndUpdate(id, req.body, {
            new: true,        // return updated gig
            runValidators: true  // schema validation follow करे
        });

        if (!updatedGig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Gig updated successfully!",
            gig: updatedGig
        });

    } catch (error) {
        console.log("Error in updateGig:", error.message);
        return res.status(500).json({ success: false, message: "Failed to update gig" });
    }
};






/*------------------------------------------
        Delete Gig Controller
------------------------------------------*/
const deleteGig = async (req, res) => {
    try {
        const { id } = req.params;

        const gig = await GigSchema.findById(id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found!"
            });
        }

        await GigSchema.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Gig deleted successfully!"
        });

    } catch (error) {
        console.log("Error in deleteGig:", error.message);
        return res.status(500).json({ success: false, message: "Failed to delete gig" });
    }
};



/*------------------------------------------
    Create review on Gig Controller
------------------------------------------*/
const createGigReview = async (req, res) => {
    try {
        const { gigId, orderId, comment, rating } = req.body;

        // Validate Gig ID and Order ID
        if (!mongoose.Types.ObjectId.isValid(gigId) || (orderId && !mongoose.Types.ObjectId.isValid(orderId))) {
            return res.status(400).json({ success: false, message: 'Invalid Gig ID or Order ID' });
        }

        const gig = await GigSchema.findById(gigId);
        if (!gig) {
            return res.status(404).json({ success: false, message: `Gig not found with id: ${gigId}` });
        }

        // Fetch user data including avatar
        const user = await UserSchema.findById(req.user._id).select("name avatar");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log(user);



        // Find if user already reviewed this gig (without orderId)
        const existingGigReviewIndex = gig.reviews.findIndex(
            (rev) => rev.userRevId.toString() === req.user._id.toString() && !rev.orderId
        );

        // Find if user already reviewed this gig under a specific order
        const existingOrderReviewIndex = gig.reviews.findIndex(
            (rev) => rev.userRevId.toString() === req.user._id.toString() && rev.orderId?.toString() === orderId?.toString()
        );

        if (orderId) {
            // User is reviewing from order page
            if (existingOrderReviewIndex !== -1) {
                // Update existing review for this order
                gig.reviews[existingOrderReviewIndex].comment = comment;
                gig.reviews[existingOrderReviewIndex].rating = Number(rating);
                gig.reviews[existingOrderReviewIndex].edited = true;
                gig.reviews[existingOrderReviewIndex].createdAt = Date.now();

                // Send real-time notification to admin
                const adminId = process.env.ADMIN_ID; // Replace with actual admin user ID
                const notification = await NotificationSchema.create({
                    type: 'edit_order_review',
                    message: `User ${user._id} has edit review for Order #${orderId?.toString()?.slice(-6)} with rating: ${rating} ` ,
                    orderId: orderId,
                    buyerId: user._id
                });

                // Populate orderId and buyerId
                const populatedNotification = await NotificationSchema.findById(notification._id)
                    .populate("orderId")
                    .populate("buyerId")
                    .exec();


                // Emit notification to admin via Socket.io
                const adminSocketId = onlineUsers?.get(adminId);
                console.log(adminSocketId);

                if (adminSocketId) {
                    io.to(adminSocketId).emit("editReviewNotification", populatedNotification);
                }


            } else {
                // New review for a new order
                gig.reviews.push({
                    userRevId: req.user._id,
                    orderId,
                    name: user?.name,
                    avatar: user?.avatar?.url,
                    comment,
                    rating: Number(rating),
                    createdAt: Date.now(),
                    edited: false
                });

                // Send real-time notification to admin
                const adminId = process.env.ADMIN_ID; // Replace with actual admin user ID
                const notification = await NotificationSchema.create({
                    type: 'new_order_review',
                    message: `User ${user._id} has review for Order #${orderId?.toString()?.slice(-6)} with rating: ${rating} ` ,
                    orderId: orderId,
                    buyerId: user._id
                });

                // Populate orderId and buyerId
                const populatedNotification = await NotificationSchema.findById(notification._id)
                    .populate("orderId")
                    .populate("buyerId")
                    .exec();


                // Emit notification to admin via Socket.io
                const adminSocketId = onlineUsers?.get(adminId);
                console.log(adminSocketId);

                if (adminSocketId) {
                    io.to(adminSocketId).emit("newReviewNotification", populatedNotification);
                }

                
            }
        } else {
            // User is reviewing from gig page (without orderId)
            if (existingGigReviewIndex !== -1) {
                // Update the existing gig review
                gig.reviews[existingGigReviewIndex].comment = comment;
                gig.reviews[existingGigReviewIndex].rating = Number(rating);
                gig.reviews[existingGigReviewIndex].edited = true;
                gig.reviews[existingGigReviewIndex].createdAt = Date.now();

                // Send real-time notification to admin
                const adminId = process.env.ADMIN_ID; // Replace with actual admin user ID
                const notification = await NotificationSchema.create({
                    type: 'edit_gig_review',
                    message: `User ${user._id} has edit review for Gig #${gigId?.toString()?.slice(-6)} with rating: ${rating} ` ,
                    orderId: undefined,
                    buyerId: user._id
                });

                // Populate orderId and buyerId
                const populatedNotification = await NotificationSchema.findById(notification._id)
                    .populate("orderId")
                    .exec();


                // Emit notification to admin via Socket.io
                const adminSocketId = onlineUsers?.get(adminId);
                console.log(adminSocketId);

                if (adminSocketId) {
                    io.to(adminSocketId).emit("editReviewNotification", populatedNotification);
                }
            } else {
                // New review for this gig
                gig.reviews.push({
                    userRevId: req.user._id,
                    name: user?.name,
                    avatar: user?.avatar?.url,
                    comment,
                    rating: Number(rating),
                    createdAt: Date.now(),
                    edited: false
                });

                // Send real-time notification to admin
                const adminId = process.env.ADMIN_ID; // Replace with actual admin user ID
                const notification = await NotificationSchema.create({
                    type: 'new_review',
                    message: `User ${user._id} has review for Gig #${gigId?.toString()?.slice(-6)} with rating: ${rating} ` ,
                    orderId: undefined,
                    buyerId: user._id
                });

                // Populate orderId and buyerId
                const populatedNotification = await NotificationSchema.findById(notification._id)
                    .populate("orderId")
                    .exec();


                // Emit notification to admin via Socket.io
                const adminSocketId = onlineUsers?.get(adminId);
                console.log(adminSocketId);

                if (adminSocketId) {
                    io.to(adminSocketId).emit("newReviewNotification", populatedNotification);
                }
            }
        }

        // Update number of reviews and average rating
        gig.numOfReviews = gig.reviews.length;
        gig.ratings = gig.reviews.reduce((acc, rev) => acc + rev.rating, 0) / gig.numOfReviews;

        await gig.save();
        const updatedGig = await GigSchema.findById(gigId).populate({
            path: "reviews.orderId",
            populate: { path: "OrderItems" } // Populate orderItems inside orderId
        });
        res.json({
            success: true,
            message: "Review processed successfully!",
            gig: updatedGig
        });

    } catch (error) {
        console.error("Error in createGigReview:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};






/*------------------------------------------
    Get review of gig by id
------------------------------------------*/
const getReviwesByGigId = async (req, res) => {
    try {
        const gigId = req.params.gigId;
        if (!mongoose.Types.ObjectId.isValid(gigId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Gig ID'
            });
        }
        const gig = await GigSchema.findById(gigId);
        if (!gig) {
            return res.json({ success: false, message: "Product not found!" });
        }
        res.json({ success: true, reviews: gig.reviews })
    } catch (error) {
        console.log("Error in getAllReviwes function: ", error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Product is not fetched",
            error: error.message
        });
    }
}







/*------------------------------------------
    Get review of gig all
------------------------------------------*/
const getAllGigReviews = async (req, res) => {
    try {
        const gigs = await GigSchema.find().populate([
            {
                path: 'reviews.userRevId',
                select: 'name email avatar.url' // ✅ Populate user details
            },
            {
                path: 'reviews.orderId',
                populate: { path: 'OrderItems' } // ✅ Populate OrderItems inside orderId
            }
        ]).sort({
            createdAt: 1
        });


        if (!gigs.length) {
            return res.status(404).json({ success: false, message: 'No gigs found' });
        }

        // Extract reviews from all products
        const allReviews = gigs.flatMap(gig =>
            gig.reviews.map(review => ({
                gigId: gig._id,
                title: gig.name,
                user: review.userRevId
                    ? { _id: review.userRevId._id, name: review.userRevId.name, email: review.userRevId.email }
                    : { _id: null, name: review.name, email: null }, // ✅ Fallback to stored name if userRevId is missing
                avatar: review?.avatar,
                rating: review.rating,
                comment: review.comment,
                edited: review.edited,
                createdAt: review.createdAt,
                orderId: review?.orderId
            }))
        );

        res.json({ success: true, reviews: allReviews });
    } catch (error) {
        console.error('Error fetching all gigs reviews:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};






module.exports = {
    createGig,
    getAllGigs,
    getSingleGig,
    updateGig,
    deleteGig,
    createGigReview,
    getReviwesByGigId,
    getAllGigReviews
}



/**************************************************** 
            Koi sensetive data nh hai ✅
****************************************************/
