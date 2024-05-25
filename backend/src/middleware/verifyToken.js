import jwt from "jsonwebtoken";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function verifyToken(req, res, next) {
    const token = req.cookies.Token

    if (token) {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        const verifyUser = await prisma.userDetails.findUnique({
            where: {
                email: verifyToken.email,
            },
            select: {
                fname: true,
                lname: true,
                mobileNo: true,
                email: true,
                role: true
            }
        })
        return res.json({
            status: "success",
            message: "User Successfullyy Logged In",
            data: verifyToken
        })

    }

    next();
}