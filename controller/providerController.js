const { models } = require("mongoose");
const Providers = require("../models/Providers");
const Review = require("../models/Review");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const providerSchema = require("./validation/providerSchema");
const register = async(req, res) => {
     try{
         const{name, email, password, price, completedJobs, experience} = req.body;
        const { error, value } = providerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
        })
        const exitProvider = await Providers.findOne({email});
        if (exitProvider) return res.status(400).json({ msg: "Account Already Exist"});
       
        
        const hashPassword = await bcrypt.hash(password, 10);
        const provider = await Providers.create({
         name,
         email,
         price,
         password: hashPassword,
         completedJobs,
         experience
})
       res.status(201).json({
        msg:"Done Created Provider",
        data: provider
});
    }
    catch(error){
        console.log(error);
    }
}
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
    try{
        const { userId, providerId, rating, comment } = req.body;
        const review = new Review({
            userId,
            providerId,
            rating,
            comment
        });

        await review.save();

        res.status(201).json(review);

    }catch(error){
        res.status(500).json({message:error.message});
    }
}

module.exports = {
    register,
    login,
    addReview
}