import jwt from 'jsonwebtoken'

const generateTokenAndCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, //prevent XSS attacks
        sameSite: 'strict', //CSRF attacks
        secure: process.env.NODE_ENV !== 'development'
    })
    return token;
}
export default generateTokenAndCookie;