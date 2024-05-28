import express, { urlencoded } from 'express'
// import dotenv from 'dotenv'
// dotenv.config();
import cookieParser from 'cookie-parser';
import nodemailer from 'nodemailer'
import cors from 'cors'
import { generateToken } from './utils/generateToken.js'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from './middleware/verifyToken.js'
const prisma = new PrismaClient()
const app = express();

app.use(cors({
    origin:process.env.ORIGIN,
    credentials: true
}))
app.use(express.json())


app.use(urlencoded({ extended: true }))
app.use(cookieParser())

//   app.options("/*", function(req, res, next){
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     res.send(200);
//   });
app.post("/register", async (req, res) => {
    const formData = req.body;
    console.log(formData);

    const userExists = await prisma.userDetails.findUnique({
        where: {
            email: formData.email
        }
    })

    if (userExists) return res.json({
        status: "failure",
        message: "User Already Exists",
        data: {}
    })

    const newUser = await prisma.userDetails.create({
        data: formData,
        select: {
            fname: true,
            lname: true,
            email: true,
            mobileNo: true,
            role: true,
            id: true
        }
    })

    res.json({
        status: "success",
        message: "User Successfully Created",
        data: newUser
    })

})

app.post('/login', async (req, res) => {

    const formData = req.body;

    const verifyUser = await prisma.userDetails.findUnique({
        where: {
            email: formData.email,
        },
        select: {
            fname: true,
            lname: true,
            mobileNo: true,
            email: true,
            role: true,
            id: true
        }
    })

    if (verifyUser === null) {
        return res.json({
            status: "failure",
            message: "Email is Incorrect",
            data: {}
        })
    }

    const newToken = generateToken(verifyUser);
    const ALMOST_ONE_HOUR_MS = 3600000


    res.cookie('Token', newToken, { httpOnly: true, expires: new Date(Date.now() + ALMOST_ONE_HOUR_MS) })

    res.json({
        status: "success",
        message: "User Successfullyy Logged In",
        data: verifyUser
    })
})

app.get("/", verifyToken, (req, res) => {
    res.json({
        status: "failure",
        message: "Session Expired, Please Login",
        data: {}
    })
})

app.get("/info", (req, res) => {
    res.json({
        info: "API is live"
    })
})

app.route('/property').post(async (req, res) => {

    const formData = req.body;

    const newProperty = await prisma.propertyDetails.create({
        data: {
            userEmail: formData.userEmail,
            BHK: formData.BHK,
            location: formData.location,
            totalRooms: formData.totalRooms,
            rent: formData.rent
        }
    })
    res.json({
        status: "success",
        message: "Property Posted successfully",
        data: newProperty
    })
}).get(async (req, res) => {
    console.log(req.query.email);
    const newProperty = await prisma.userDetails.findMany({
        where: {
            email: req.query.email
        },
        select: {
            propertyDetails: true
        }
    })
    res.json({
        status: "success",
        message: "Property Posted successfully",
        data: newProperty
    })
}).delete(async (req, res) => {
    const id = Number(req.query.id);
    console.log(id);
    const deleteProperty = await prisma.propertyDetails.delete({
        where: {
            id: id
        },
    })
    console.log(deleteProperty);
    res.json({
        status: "success",
        message: "Property successfully Deleted",
        data: deleteProperty
    })
}).patch(async (req, res) => {
    console.log(req.body);
    const formData = req.body
    const updatedUser = await prisma.propertyDetails.update({
        where: {
            id: Number(formData.id)
        },
        data: {
            BHK: Number(formData.BHK),
            location: formData.location,
            totalRooms: Number(formData.totalRooms),
            rent: Number(formData.rent)
        },
        select: {
            BHK: true,
            location: true,
            totalRooms: true,
            rent: true,
        }
    })

    res.json({
        status: "success",
        message: "Property successfully Updated",
        data: updatedUser
    })
})

app.get("/allproperties", async (req, res) => {
    const allProperties = await prisma.propertyDetails.findMany({
        select: {
            id: true,
            BHK: true,
            location: true,
            totalRooms: true,
            rent: true,
            userEmail: true,
            user: true,
            like: true,
        }
    })

    res.json({
        status: "success",
        message: "Successfully Fetched",
        data: allProperties
    })
})

app.get("/logout", (req, res) => {
    res.clearCookie("Token", { domain: "localhost", path: "/" });
    res.end()
})

app.patch("/like", async (req, res) => {
    console.log(req.body);
    const likeDetails = req.body

    if (req.body.purpose === "AddLike") {
        await prisma.propertyDetails.update({
            where: {
                id: likeDetails.id
            },
            data: {
                like: {
                    push: likeDetails.email
                }
            }
        })
        res.json({
            status: "success",
            message: "Like Added"
        })
    }
    else {


        const all = await prisma.propertyDetails.findUnique({
            where: {
                id: likeDetails.id
            },
            select: {
                like: true
            }
        })

        //Array of likes of a particular property
        const likes = all.like
        console.log(likes);

        const removedLike = likes.filter((like) => like !== likeDetails.email)
        console.log(removedLike);
        await prisma.propertyDetails.update({
            where: {
                id: likeDetails.id
            },
            data: {
                like: {
                    set: removedLike
                }
            }
        })
        console.log();
        res.json({
            status: "success",
            message: "Like Deleted"
        })
    }

})

app.post("/sendBuyer", async (req, res) => {
    try {
        const body = req.body
        console.log(body);
        const BuyerData = body.BuyerData;
        const SellerData = body.sellerData;


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        // try {
        //   //To buyer
        const mail = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: body.BuyerData.email,
            // replyTo: email,
            subject: `Message from rental application`,
            html: `
        <div>
        <h1><strong>Property Details</strong></h1>
        <br />
        <strong>BHK</strong> : ${SellerData.BHK} <br />
        <strong>location</strong>:  ${SellerData.location} <br />
        <strong>totalRooms</strong>:  ${SellerData.totalRooms} <br />
        <strong>rent</strong>:  ${SellerData.rent}<br />
       <br />
        <h1><strong>Seller Details</strong></h1>
      <br/>
        <strong>Seller Email</strong>: ${SellerData.user.email} <br />
         <strong>name</strong>: ${SellerData.user.fname} ${" "} ${SellerData.user.lname}<br />
            <strong>mobileNo</strong>: ${SellerData.user.mobileNo}<br />
      </div>`,
        })
        return res.json({ message: "Success: email was sent" })
    } catch (error) {
        console.log(error);
        return res.json({ message: "COULD NOT SEND MESSAGE" })
    }
})

app.post("/sendSeller", async (req, res) => {
    try{
console.log("seller");
    const body = req.body

    const BuyerData = body.BuyerData;
    const SellerData = body.sellerData;
//   
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mail = await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: SellerData.userEmail,
        // replyTo: email,
        subject: `Message from rental application`,
        html: `
      <div>
    <h1><strong>Interested Buyer Details</strong></h1>
    <br />
    <strong>name</strong> : ${BuyerData.fname}${" "}${BuyerData.lname} <br />
    <strong>mobileNo</strong> : ${BuyerData.mobileNo} <br />
    <strong>email</strong>: ${BuyerData.email} <br />
  </div> `,
    })
    return res.json({ message: "Success: email was sent" })
} catch (error) {
    console.log(error);
    return res.json({ message: "COULD NOT SEND MESSAGE" })
}
  
})

// const PORT = process.env.PORT || 8001 || 8002;
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
})

export default app;
