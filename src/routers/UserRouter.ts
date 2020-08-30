import {Router} from "express";
import {UserValidators} from "../validators/UserValidators";
import {GlobalMiddleWare} from "../middlewares/GlobalMiddleWare";
import {UserController} from "../controllers/UserController";
import * as passport from "passport";

 class UserRouter
{
    public router : Router;

    constructor()
    {
        this.router = Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();


    }


    getRoutes()
    {
        this.router.get('/resend/verification/token',GlobalMiddleWare.authenticate,GlobalMiddleWare.checkVerified,
            UserController.resendVerification);
        this.router.get('/login',UserValidators.login(),GlobalMiddleWare.checkError,UserController.login);
        this.router.get('/send/reset/password/token',UserValidators.sendVerificationEmail(),GlobalMiddleWare.checkError,
            UserController.sendVerificationEmail);
        this.router.get('/verify/reset/password/token',UserValidators.verifyPasswordToken(),GlobalMiddleWare.checkError,
            UserController.verifyPasswordToken);
        this.router.get('/login/fb',passport.authenticate('facebook',{scope:'email'}));
        this.router.get('/fb/auth',passport.authenticate('facebook',{failureRedirect:'/failed/login'})
            ,UserController.LoginFacebook);
        this.router.get('/failed/login',UserController.FailedLogin);
        this.router.get('/fb/logout',UserController.Logout);
        this.router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
        this.router.get('/auth/google/callback',passport.authenticate('google',
            {failureRedirect:'/auth/fail'}),UserController.LoginGoogle);
        this.router.get('/auth/fail',UserController.FailedLogin);
        this.router.get('/google/logout',UserController.Logout);
        this.router.get('/users',GlobalMiddleWare.authenticate,GlobalMiddleWare.isVerified,UserController.SearchUser);
    }
    postRoutes()
    {
        this.router.post('/signup',UserValidators.sign_up(),GlobalMiddleWare.checkError,UserController.sign_up);

    }
    patchRoutes()
    {
        this.router.patch('/verifyUser',GlobalMiddleWare.authenticate,GlobalMiddleWare.checkVerified,
            UserValidators.verifyUser(),GlobalMiddleWare.checkError,UserController.verifyUser);
        this.router.patch('/reset/password',UserValidators.resetPassword(),GlobalMiddleWare.checkError,
            UserController.resetPassword);
    }
    deleteRoutes()
    {

    }
}
export default new UserRouter().router;
