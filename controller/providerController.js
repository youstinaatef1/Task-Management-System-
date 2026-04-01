const { models } = require("mongoose");
const mongoose = require("mongoose");
const Providers = require("../models/Providers");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const providerSchema = require("./validation/providerSchema");

const register = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ msg: "Please Add Image" });
    
    const { error, value } = providerSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        msg: error.details.map((err) => err.message)
      });
    }

    const { email, password } = value;

    const exitProvider = await Providers.findOne({ email });
    if (exitProvider) {
      return res.status(400).json({ msg: "Account Already Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    value.password = hashPassword;
    value.image = req.file.path;

    const provider = await Providers.create(value);

    res.status(201).json({
      msg: "Done Created Provider",
      data: provider
    });

  } catch (error) {
    console.log(error);
  }
};
const login = async(req, res) => {
 try{
        const{email, password}= req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Missing Data"});       
        }
        const provider = await Providers.findOne({email});
        if (!provider) {
            return res
            .status(400)
            .json({ msg: "Account Not Found"});
        }
        const matchPassword = await bcrypt.compare(password, provider.password);
        if (!matchPassword) {
            return res.status(400).json({msg: "Invalid Password"});
        }
const token = jwt.sign({
    id: provider._id
},
 process.env.JWT_SECRET,
 {
   expiresIn: "1d",
},
);
        res.status(200).json({
            msg: "Success Login",
            token,
        });
    }
    catch(error){
        console.log(error);
    }
}
const addReview = async (req, res) => {
    try {
        const { providerId, rating, comment } = req.body;
        const userId = req.user.id; 
 const completedBooking = await Booking.findOne({
            userId: userId,
            providerId: providerId,
            status: "completed"
        });

        if (!completedBooking) {
            return res.status(400).json({ 
                msg: "You can only review a provider after completing a booking with them" 
            });
        }
        const existingReview = await Review.findOne({
            user: userId,      
            provider: providerId 
        });

        if (existingReview) {
            return res.status(400).json({ msg: "You already reviewed this provider" });
        }

        const review = new Review({
            user: userId,      
            provider: providerId, 
            rating,
            comment
        });

        await review.save();
        res.status(201).json(review);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
const getProviderReviews = async (req, res) => {
    try {
        const { providerId } = req.params;

        const reviews = await Review.find({ provider: providerId })
            .populate("user", "userName")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);

    } catch (error) {
        res.status(500).json({ msg: "Error", error });
    }
};

const getAllProviders = async (req, res) => {
    try {
        const providers = await Providers.find();
        res.status(200).json({ data: providers});
    } catch (error) {
        res.status(500).json({ msg: "Error", error });

    }
}
module.exports = {
    register,
    login,
    addReview,
    getProviderReviews,
    getAllProviders
}