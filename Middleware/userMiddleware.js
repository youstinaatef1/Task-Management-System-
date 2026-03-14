const jwt = require("jsonwebtoken");
const userMiddleware = async(req, res , next)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.json({msg: "Token Not Found"});       
        }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decodedToken;
    next();

    } 
    catch(error){

    }
}
module.exports = userMiddleware;