const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
dotenv.config(); 

module.exports = async(req, res, next) => {
    try {
        const jwtToken  = req.header("token"); 

        if (!jwtToken) {
            // return res.status(403).json("Not Authorise");
            const err = new Error('Not Authorised'); 
            err.status = 403; 
            return next(err); 
        }; 

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET); 

        req.user = payload.user; 

    } catch (err) {
        // console.error(err.message); 
        // return res.status(403).json("Not Authorised"); 
        err.status(403); 
        return next(err); 
    }

    next(); 
}; 