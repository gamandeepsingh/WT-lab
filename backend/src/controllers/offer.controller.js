import { errorHandler } from "../utils/error.js";
import Offers from "../models/offer.model.js";

export const createOffer = async (req, res, next) => {
  try {
    const body = req.body;
    body.createAt = new Date();
    console.log(body);

    const offer = await Offers.create(body);

    const response = {
      acknowledged: true,
      offer,
    };
    return res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateOffer = async (req, res, next) => {
  const offer = await Offers.findById(req.params.id);
  const userRole = req.params.userRole;  

  if (userRole === "normalUser") {
    return res.status(400).json({
      message: "You are not authorized to update the offer.",
    });
  }

  const offerData = req.body;

  if (!offer) {
    return next(errorHandler(404, "Offer not found!"));
  }

  try {
    const updatedOffer = await Offers.findByIdAndUpdate(
      req.params.id,
      offerData,
      { new: true }
    );

    const response = {
      acknowledged: true,
      updatedOffer,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getOffers = async (req, res, next) => {
  try {
    const offers = await Offers.find();

    if (!offers) {
      return next(errorHandler(404, "offer not found!"));
    }

    res.status(200).json(offers);
  } catch (error) {
    next(error);
  }
};

export const getOfferId = async (req, res, next) => {
  try {
    const id = req.params.id;
    const offer = await Offers.findById(id);
    if (!offer) {
      return next(errorHandler(404, "offer not found!"));
    }

    res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  const offer = await Offers.findById(req.params.id);
  if (!offer) {
    return next(errorHandler(404, "Job not found!"));
  }
  try {
    const organiseDate = new Date(offer.Date);    
    await Offers.findByIdAndDelete(req.params.id);
    const response = {
      acknowledged: true,
      message: "Job has been deleted!",
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getOfferEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const offer = await Offers.find({
      postedBy: email,
    });
    if (!offer) {
      return next(errorHandler(404, "offer not found!"));
    }
    res.status(200).json(offer);
  } catch (error) {
    next(error);
  }
};