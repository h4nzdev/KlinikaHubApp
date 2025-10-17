import express from "express";
import reviewController from "../controller/reviewController.js";

const reviewRouter = express.Router();

// @route   GET /api/reviews/init
// @desc    Initialize review table
// @access  Public
reviewRouter.get("/init", async (req, res) => {
  try {
    await reviewController.initTable();
    res.json({
      success: true,
      message: "Review table initialized successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Public
reviewRouter.post("/", async (req, res) => {
  try {
    const review = await reviewController.createReview(req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
reviewRouter.get("/", async (req, res) => {
  try {
    const reviews = await reviewController.getAllReviews();
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
reviewRouter.get("/:id", async (req, res) => {
  try {
    const review = await reviewController.getReviewById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/patient/:patientId
// @desc    Get reviews by patient ID
// @access  Public
reviewRouter.get("/patient/:patientId", async (req, res) => {
  try {
    const reviews = await reviewController.getReviewsByPatientId(
      req.params.patientId
    );
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/clinic/:clinicId
// @desc    Get reviews by clinic ID
// @access  Public
reviewRouter.get("/clinic/:clinicId", async (req, res) => {
  try {
    const reviews = await reviewController.getReviewsByClinicId(
      req.params.clinicId
    );
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/rating/:rating
// @desc    Get reviews by rating (1-5)
// @access  Public
reviewRouter.get("/rating/:rating", async (req, res) => {
  try {
    const rating = parseInt(req.params.rating);
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const reviews = await reviewController.getReviewsByRating(rating);
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/status/:status
// @desc    Get reviews by status
// @access  Public
reviewRouter.get("/status/:status", async (req, res) => {
  try {
    const reviews = await reviewController.getReviewsByStatus(
      req.params.status
    );
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/verified/all
// @desc    Get verified reviews only
// @access  Public
reviewRouter.get("/verified/all", async (req, res) => {
  try {
    const reviews = await reviewController.getVerifiedReviews();
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Public
reviewRouter.put("/:id", async (req, res) => {
  try {
    const review = await reviewController.updateReview(req.params.id, req.body);
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/reviews/:id/status
// @desc    Update review status only
// @access  Public
reviewRouter.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    if (status === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }
    const review = await reviewController.updateReviewStatus(
      req.params.id,
      status
    );
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/reviews/:id/helpful
// @desc    Mark review as helpful
// @access  Public
reviewRouter.patch("/:id/helpful", async (req, res) => {
  try {
    const review = await reviewController.markReviewAsHelpful(req.params.id);
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Public
reviewRouter.delete("/:id", async (req, res) => {
  try {
    await reviewController.deleteReview(req.params.id);
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/patient/:patientId/details
// @desc    Get reviews by patient ID WITH clinic details
// @access  Public
reviewRouter.get("/patient/:patientId/details", async (req, res) => {
  try {
    const reviews = await reviewController.getReviewsByPatientIdWithDetails(
      req.params.patientId
    );
    res.json({
      success: true,
      data: reviews,
      message: `Found ${reviews.length} reviews with details`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/clinic/:clinicId/details
// @desc    Get reviews by clinic ID WITH patient details
// @access  Public
reviewRouter.get("/clinic/:clinicId/details", async (req, res) => {
  try {
    const reviews = await reviewController.getReviewsByClinicIdWithDetails(
      req.params.clinicId
    );
    res.json({
      success: true,
      data: reviews,
      message: `Found ${reviews.length} reviews with details`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/with-details/all
// @desc    Get all reviews WITH clinic and patient names
// @access  Public
reviewRouter.get("/with-details/all", async (req, res) => {
  try {
    const reviews = await reviewController.getAllReviewsWithDetails();
    res.json({
      success: true,
      data: reviews,
      message: `Found ${reviews.length} reviews with details`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// FIXED ROUTES - No more question marks in path parameters!

// @route   GET /api/reviews/stats/clinic
// @desc    Get rating statistics for all clinics
// @access  Public
reviewRouter.get("/stats/clinic", async (req, res) => {
  try {
    const stats = await reviewController.getClinicRatingStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/reviews/stats/clinic/:clinicId
// @desc    Get rating statistics for specific clinic
// @access  Public
reviewRouter.get("/stats/clinic/:clinicId", async (req, res) => {
  try {
    const stats = await reviewController.getClinicRatingStats(
      req.params.clinicId
    );
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default reviewRouter;
