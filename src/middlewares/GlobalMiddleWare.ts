import {validationResult} from "express-validator";
import * as jwt from 'jsonwebtoken';
import {getEnvironment} from "../environments/env";
import User from "../models/User";


export class GlobalMiddleWare
{

    static checkError(req,res,next)
    {
        const error = validationResult(req);
        if(!error.isEmpty())
        {
            next(new Error(error.array()[0].msg));
        }
        else
        {
            next();
        }
    }

    static async authenticate(req,res,next)
    {
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.slice(7,authHeader.length) : null;
        try
        {

            jwt.verify(token,getEnvironment().jwt_secret_key,((err,decoded)=>
            {
                if(err)
                {
                    next(err);
                }else if(!decoded)
                {     req.errorStatus = 401;
                    next(new Error('User Not Authorised'));
                }else
                {

                    req.user = decoded;

                    next();
                }
            }))
        }catch (e){
            req.errorStatus = 401;
            next(e);

        }
    }



    static async  checkVerified(req,res,next)
    {
        try
         {
              const user =   await  User.findOne({email:req.user.email , verified: true});
                if (user)
                   {
                      req.errStatus = 401;
                       next(new Error('USER IS ALREADY VERIFIED'));
                   }
               else
                    {
                      next();
                    }

         }catch (e)
             {
              next(e);
             }

    }

    static async isVerified(req,res,next)
    {
        try
        {
            const verifyuser = await User.findOne({verified:true});
            if(verifyuser)
            {
                next();
            }
            else
                {
                    req.errStatus = 401;
                    next(new Error('USER IS NOT VERIFIED, YOU CANT ACCESS THIS PAGE!'));
                }

        }catch (e) {

                    next(e);
                    }
    }

}
