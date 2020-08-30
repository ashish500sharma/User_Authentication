import User from "../models/User";
import {Utils} from "../utils/Utils";
import {NodeMailer} from "../utils/NodeMailer";
import * as jwt from 'jsonwebtoken';
import {getEnvironment} from "../environments/env";


export class UserController
{

    /**
     * @access  Public
     * @Method  POST
     * @route   /api/user/signup
     * @input   { email,username,password,role,phone_no }
     * @desc    provide a user sign_up with email verification.
     */
    static async sign_up(req,res,next)
    {
        const email=req.body.email;
        const username=req.body.username;
        const password = req.body.password;
        const role = 'user';
        const phoneNo =  req.body.phone_no;
        const verification_token = Utils.generateVerificationToken();

        try{
            const hash =  await Utils.encryptedPassword(password);
            const data = {
                email:email ,
                password:hash,
                username:username,
                role:role,
                phone_no:phoneNo,
                verification_token:verification_token,
                verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                on_board: 1
            };

            console.log(data);
            let user = await new User(data).save();
            res.send(user);
            await NodeMailer.sendEmail({to: ['as1996sharma@gmail.com '],
                subject: 'Email Verification',
                html: `<h1>HELLO THERE ! 😁</h1><br><h1>OTP: ${verification_token} </h1>`
            })
        }
        catch (e)
        {
            next(e);

        }

    }


    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/login
     * @input   { email , password}
     * @desc    provide user login through jwt token
     */

    static async login(req,res,next)
    {
        const password = req.query.password;
        const user = req.user;


        try
        {
            await Utils.comparePassword({plainPassword:password,encryptedPassword:user.password});

             const token = jwt.sign(
                {
                        email: user.email,
                        user_id: user._id,
                         username: user.username,
                         role: user.role,
                        }
                         ,getEnvironment().jwt_secret_key   ,
                {expiresIn: '1d'});

            const Data = {user: user, token: token, role: user.role};
            res.json(Data);

        }
        catch (e)
        {
            next(e);
        }
    }


    /**
     * @access  Public
     * @Method  PATCH
     * @route   /api/user/verifyUser
     * @input   { verification_token }
     * @desc    Verify user's field to true
     */

    static async verifyUser(req,res,next)
    {
        const verificationToken = req.body.verification_token;
        const email = req.user.email;

        try {
            console.log(verificationToken, email);
            const user = await User.findOneAndUpdate({
                email: email, verification_token: verificationToken,
                verification_token_time: {$gt: Date.now()}
            }, {verified: true}, {new: true});
            if (user) {
                res.send(user);
            }
            else {
                throw new Error('Verification Token is Expired. Please Request for new Token')
            }
        }
        catch (e) {
            next(e);
        }
    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/resend/verification/email
     * @input   {  }
     * @desc    Resend Verification email to User
     */

    static async resendVerification(req,res,next)
    {    const email = req.user.email;
        const verification_token = Utils.generateVerificationToken();
        try {
            const user: any = await User.findOneAndUpdate({email: email},
                {
                    verification_token: verification_token,
                    verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
                },{new:true});

            if (user) {
                await NodeMailer.sendEmail({to: ['as1996sharma@gmail.com '],
                    subject: 'Email Verification',
                    html: `<h1>HELLO THERE ! 😁</h1><p>your resend verification</p><br><h1>OTP: ${verification_token} </h1>`
                })
                res.json(
                    {
                        success: true,
                        token:verification_token
                    });
            }
            else {
                throw Error('User Does Not Exist');
            }

        } catch (e) {
            next(e);
        }
    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/send/reset/password/email
     * @input   { email }
     * @desc    send reset password email to User
     */

    static async sendVerificationEmail(req,res,next)
    {
        const email = req.query.email;
        const reset_password_token = Utils.generateVerificationToken();

        try
        {
            const user = await User.findOneAndUpdate({email:email},
                {
                    reset_password_token:reset_password_token,
                    reset_password_token_time : Date.now() + new Utils().MAX_TOKEN_TIME,
                    updated_at:new Date()
                },{new:true});

                res.send(user);

             await NodeMailer.sendEmail(
                {to:email,
                    subject:'RESET PASSWORD VERIFICATION TOKEN',
                    html:`<h1>PASSWORD VERIFICATION OTP</h1></h1><h2>${reset_password_token}</h2>`
                });

        }catch (e)
        {
            next(e);
        }
    }

    /**
     * @access  Public
     * @Method  get
     * @route   /api/user/verify/reset/password/token
     * @input   {reset password token}
     * @desc    verify reset password token
     */

    static verifyPasswordToken(req,res,next)
    {
        res.json(
            {
                success:true
            })
    }

    /**
     * @access  Public
     * @Method  PATCH
     * @route   /api/user/reset/password
     * @input   {email,new_password,confirm_password,reset password token}
     * @desc    reset password of user
     */

    static async resetPassword(req,res,next)
    {
        const user = req.user;
        const new_password = req.body.new_password;
        try
        {
            const updatedPassword = await Utils.encryptedPassword(new_password);

            const updatedUser = await User.findOneAndUpdate({_id:user._id},
                {updated_at:new Date(),
                password:updatedPassword},{new:true});
            res.send(updatedUser);

        }catch (e)
        {
            next(e);
        }
    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/login/fb
     * @input   {}
     * @desc    Login with Facebook
     */

    static LoginFacebook(req,res,next)
    {
            res.send('Logged in to Facebook');
            console.log(req.isAuthenticated());
            console.log(req.user);


    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/failed/login for FB and /api/user/auth/fail for google
     * @input   {}
     * @desc    Login Failed Of User
     */
    static FailedLogin(req,res,next)
    {
        res.send('Login Failed');
    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/fb/logout for FB and /api/user/google/logout for google
     * @input   {}
     * @desc    Logout user
     */
    static Logout(req,res,next)
    {
        req.logout();
        res.send('User is Logged out');

        console.log(req.isAuthenticated());
    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/auth/google
     * @input   {}
     * @desc    Login with Google
     */
    static LoginGoogle(req,res,next)
    {
        res.send('Logged in to Google');
        console.log(req.isAuthenticated());
        console.log(req.user);
    }

    /**
     * @access  Public
     * @Method  GET
     * @route   /api/user/users
     * @input   {name or Username}
     * @desc    Login with Google
     */

    static async SearchUser(req,res,next)
    {
        const SearchField = req.query.name;

        try
        {
            const searchedUser = await User.find({name:{$regex: SearchField,$options: 'i'}});
                res.send(searchedUser);
        }catch (e)
        {
            res.send(e);
        }
    }

}
