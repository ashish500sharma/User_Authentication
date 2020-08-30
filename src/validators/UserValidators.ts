import {body,query} from "express-validator";
import User from "../models/User";

export class UserValidators
{
    static sign_up()
    {
        return [body('name','NAME IS REQUIRED').isString(),
            body('email','email is required').isEmail().custom((email)=>
        {
            return User.findOne({email:email}).then(user =>{

                if(user){
                    throw new Error('User email already exists');
                }
                else{
                    return true
                }
            })
        }) ,
            body('password','password is required').isString()
                .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@])[a-zA-Z0-9@]{8,12}')
                .withMessage("Password be like 'Ashish@1996' min:8,max 12 Alphabets and use only @ for special corrector "),

            body('username','username is required').isString().custom((username)=>
            {
                return User.findOne({username:username}).then(username =>{

                    if(username){
                        throw new Error('Username already exists');
                    }
                    else{
                        return true
                    }
                })
            }).matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_.])[a-zA-Z0-9@]{8,18}').
            withMessage("Username should have small Alphabets , capital Alphabets , special character (_ or .), numbers min:8 and max:18 Alphabets"),

        body('phone_no','PHONE NO IS REQUIRED').isString().matches('^[789][0-9]{9}$').withMessage('Phone no should be valid!')];
    }

    static login()
    {
        return[query('email','Email is Required').isEmail().custom((email,{req})=>
        {
            return User.findOne({email:email}).then((user)=>
            {
                if(user)
                {
                    req.user = user;
                    return true;
                }
                else
                    {
                        throw new Error('User Does not found');
                    }
            })
        }),
        query('password','Password is required').isString()
        ]
    }

    static verifyUser()
    {
        return[body('verification_token','VERIFICATION TOKEN IS REQUIRED').isNumeric(),
        ]
    }

    static sendVerificationEmail()
    {
        return[query('email','EMAIL IS REQUIRED').isEmail().custom((email)=>
        {
            return User.findOne({email:email}).then((email)=>
            {
                if(email)
                {
                    return true;
                }
                else
                    {
                        throw new Error('USER IS NOT EXISTED');
                    }
            })
        })]
    }

    static verifyPasswordToken()
    {
        return[query('reset_password_token','RESET PASSWORD TOKEN IS REQUIRED').isNumeric().custom((token)=>
        {
            return User.findOne({reset_password_token:token,reset_password_token_time: {$gt:Date.now()}}).then((token)=>
            {
                if(token)
                {
                    return true;
                }
                else
                    {
                        throw new Error('TOKEN DOES NOT EXIST, PLEASE TRY AGAIN');
                    }
            });
        })]
    }

    static resetPassword()
    {
        return [body('email','email is required').isEmail()
            .custom((email,{req})=>
            {
                return User.findOne({email:email}).then(user=>
                {
                    if(user)
                    {
                        req.user = user;
                        return true;
                    }
                    else
                    {
                        throw new Error('USER DOES NOT EXIST');
                    }
                })
            })
            ,body('new_password','New Password is required').isString()
                .matches('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@])[a-zA-Z0-9@]{8,12}')
                .withMessage("Password be like 'Ashish@1996' min:8,max 12 Alphabets and use only @ for special corrector ")
            .custom((newPassword,{req})=>
            {
                if(newPassword === req.body.confirm_password)
                {
                    return true;

                }else
                {
                    throw new Error('Confirm Password and New Password Should be Matched');
                }

            }),
            body('confirm_password','Confirm Password is required').isString(),
            body('reset_password_token','Reset Password Token is Required').isNumeric()
                .custom((token,{req})=>
                {
                    if(Number(req.user.reset_password_token) === Number(token))
                    {
                        return true;
                    }else
                    {   req.errorStatus = 422;
                        throw new Error('Reset Password Token is Invalid , Try again');
                    }
                })
        ]
    }
}
