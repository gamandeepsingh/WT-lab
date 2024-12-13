import express from "express";
import {   createOffer, deleteOffer, getOfferId, getOffers, updateOffer, getOfferEmail } from "../controllers/offer.controller.js";

const router = express.Router();

router.post("/post-offer",createOffer);
router.get("/myOffers/:email",getOfferEmail);
router.delete("/deleteOffer/:id",deleteOffer);
router.patch("/update-offer/:id/:userRole",updateOffer);
router.get("/all-offers/:id",getOfferId);
router.get("/all-offers",getOffers);

export default router;