import jwt from "jsonwebtoken"

export function generateToken(user){
    return jwt.sign(user,process.env.JWT_SECRET)
}