import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {PrismaClient} from "@prisma/client";
//import {User} from "@prisma/client";

const prisma = new PrismaClient();

class AuthService {
    //register user
    static async registerUser(name : string, email:string, password: string){
        //check if user exist
        const existingUser= await prisma.user.findUnique({where: {email}});

        if(existingUser){
            throw new Error("User already exists with this email!");
        }

        //hass password
        const hashedPassword:string = await bcrypt.hash(password, 10);

        //creat user in DB

        const user = await prisma.user.create({
            data : {
                name, email, password: hashedPassword,
            }
        });

        return user;
    }



    //login user

    static async loginUser(email: string, password: string){
        //check if user exists

        const user= await prisma.user.findUnique({where : {email}});

        if(!user){
            throw new Error("User not found!");
        }

        if(!user.password){
            throw new Error("Password is empty");
        }

        //compare password
        const passwordMatch = await bcrypt.compare (password, user.password);
        if(!passwordMatch){
            throw new Error("Invalid password!");
        }

        //create token

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "7d" });

        return token;
    }
}

export default AuthService;