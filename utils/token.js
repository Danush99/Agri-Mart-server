const jwt = require('jsonwebtoken');


const getAccessToken = (auth) => {
    console.log("auth : ", auth)
    return jwt.sign(
        {
            "email": auth.email,
            "password": auth.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '60s' }
    )
}

const getRefreshToken = (auth) => {
    return jwt.sign(
        { "email": auth.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
}

module.exports = {
    getAccessToken,
    getRefreshToken
}