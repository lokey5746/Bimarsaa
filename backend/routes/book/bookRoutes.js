import express from "express";

import {
  createBook,
  deleteBook,
  getBook,
  myProfile,
} from "../../controllers/book/bookControllers.js";

import protectRoute from "../../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protectRoute, createBook);
router.route("/").get(protectRoute, getBook);
router.route("/:id").delete(protectRoute, deleteBook);
router.route("/myprofile").get(protectRoute, myProfile);

export default router;
