const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); 
dotenv.config(); 

function createJWT(user_id) {
    const payload = {
        user: user_id
    }; 

    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1hr"}); 
}; 

module.exports = createJWT; 