const express = require('express');
const {
    createGig,
    getAllGigs,
    getSingleGig,
    updateGig,
    deleteGig,
    createGigReview,
    getReviwesByGigId,
    getAllGigReviews
} = require('../../controllers/Admin/gigControllers');
const { authUser } = require('../../middleware/authMiddleware');
const router = express.Router();


router.route('/create').post(createGig);
router.get('/get', getAllGigs);
router.get('/get/:id', getSingleGig);
router.put('/update/:id', updateGig);
router.delete('/delete/:id', deleteGig);
router.post('/review', authUser,createGigReview);
router.get('/review/:gigId', getReviwesByGigId);
router.get('/reviews', getAllGigReviews);


module.exports = router