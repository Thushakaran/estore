const sendToken = (user, statusCode, res) => {

    //Creating JWT Token
    const token = user.getJwtToken();

    //setting cookies
    const days = Number(process.env.COOKIE_EXPIRES_TIME) || 7;
    const options = {
        expires: new Date(
            Date.now() + days * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user
        })

}

module.exports = sendToken;