import {Request, Response} from 'express';
import AuthService from '../services/AuthService';

class AuthController {
    static async register(req:Request, res:Response){
        try{
            const {username, email, password} = req.body;
            console.log(username, email, password);

            const user = await AuthService.registerUser(username,email,password);

            res.status(201).json({
                msg:"User registered"
            });
        }catch (err:any){
            res.status(400).json({
                err: err.message
            });
        }
    }


    static async login(req:Request, res:Response){
        try{
            const {email, password} = req.body;
            const token = await AuthService.loginUser(email,password);
            res.status(200).json({
                token : token,
            });
            
        }catch (err:any){
            res.status(401).json({
                err: err.message
            });
        }
    }
}

export {AuthController};