// const { models } = require("mongoose");
// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const registerSchema = require("./validation/registerSchema");
// const register = async(req, res) => {
//      try{
//          const{userName, email, password, role} = req.body;
//         const { error, value } = registerSchema.validate(req.body, {
//         abortEarly: false,
//         stripUnknown: true
//         })
//         const exitUser = await User.findOne({email});
//         if (exitUser) return res.status(400).json({ msg: "Account Already Exist"});
       
        
//         const hashPassword = await bcrypt.hash(password, 10);
//         const user = await User.create({
//          userName,
//          email,
//          password: hashPassword,
//          role
// })
//        res.status(201).json({
//         msg:"Done Created User",
//         data: user
// });
//     }
//     catch(error){
//         console.log(error);
//     }
// }
// const login = async(req, res) => {
//  try{
//         const{email, password}= req.body;
//         if (!email || !password) {
//             return res.status(400).json({ msg: "Missing Data"});       
//         }
//         const user = await User.findOne({email});
//         if (!user) {
//             return res
//             .status(400)
//             .json({ msg: "Account Not Found"});
//         }
//         const matchPassword = await bcrypt.compare(password, user.password);
//         if (!matchPassword) {
//             return res.status(400).json({msg: "Invalid Password"});
//         }
// const token = jwt.sign({
//     id: user._id,
//     role: user.role
// },
//  process.env.JWT_SECRET,
//  {
//    expiresIn: "1d",
// },
// );
//         res.status(200).json({
//             msg: "Success Login",
//             token,
//         });
//     }
//     catch(error){
//         console.log(error);
//     }
// }

// module.exports = {
//     register,
//     login
// }
const { models } = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const registerSchema = require("./validation/registerSchema");

const register = async(req, res) => {
     try{
         const{userName, email, password, role} = req.body;
        const { error, value } = registerSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
        })
        const exitUser = await User.findOne({email});
        if (exitUser) return res.status(400).json({ msg: "Account Already Exist"});
       
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
         userName,
         email,
         password: hashPassword,
         role
        })
        res.status(201).json({
            msg:"Done Created User",
            data: user
        });
    }
    catch(error){
        console.log(error);
    }
}

const login = async(req, res) => {
    try{
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Missing Data" });       
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Account Not Found" });
        }

        // ✅ لو الـ user بعت role وهي مختلفة عن اللي في الـ DB → رفض
        if (role && user.role !== role) {
            return res.status(403).json({ msg: `This account is not registered as ${role}` });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ msg: "Invalid Password" });
        }

        // const token = jwt.sign(
        //     { id: user._id, role: user.role },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "1d" }
        // );
const token = jwt.sign(
  { 
    id: user._id, 
    role: user.role  // ✅ ده المهم! لازم الـ role يكون موجود
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
        // ✅ بنرجع الـ role مع الـ token عشان الـ frontend يعرفها
        res.status(200).json({
            msg: "Success Login",
            token,
            role: user.role,        // ← ده اللي كان ناقص
            userName: user.userName
        });
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    register,
    login
}
