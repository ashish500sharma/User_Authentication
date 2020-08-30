import * as express from "express";
import {getEnvironment} from "./environments/env";
import UserRouter from "./routers/UserRouter";
import * as mongoose from "mongoose";
import bodyParser = require("body-parser");
import * as passport from "passport";
import {Strategy as Facebook_Strategy} from "passport-facebook";
import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {PassportMiddleWare} from "./middlewares/PassportMiddleWare";
export class Server
{
    public app : express.Application  = express();
    constructor()
    {
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.HandleErrors();
    }

    setConfigurations()
    {
        this.setMongoDb();
        this.ConfigureBodyParser();
        this.ConfigureFBPassport();
        this.ConfigureGooglePassport();
    }


    // mongodb connection

    setMongoDb()
    {
        const databaseConnect = getEnvironment().db_url;
        mongoose.connect(databaseConnect,
            {useNewUrlParser:true, useUnifiedTopology:true}).then(
            ()=>
            {
                console.log("mongodb is connected");
            });

    }

    //body-parser configure

    ConfigureBodyParser()
    {
        this.app.use(bodyParser.urlencoded({extended:true}));
    }

    //Passport pre Initialization
    passportSettings()
    {
        passport.serializeUser(function (user,cb)
        {
            cb(null,user);
        })
        passport.deserializeUser(function (obj,cb)
        {
            cb(null,obj);
        })
    }

    //configure Passport for Facebook
    ConfigureFBPassport()
    {
        this.passportSettings();

        passport.use(new Facebook_Strategy(
            {
                clientID:'291902951908390',
                clientSecret:'c80f0cc678c722220bd77f0a4b977e9b',
                callbackURL:'http://localhost:5000/api/user/fb/auth',
                profileFields:['id','displayName','email'],
                enableProof: true
            },PassportMiddleWare.fb_signup_Passport
        ));
    }

    //Configure Passport for User
    ConfigureGooglePassport()
    {
        this.passportSettings();
        passport.use(new GoogleStrategy(
            {
                clientID:'33299138916-81qjso44sbdop2kkuo2aggebi45jua86.apps.googleusercontent.com',
                clientSecret:'OfnCMrkXdlVThL7LLVhQvdiw',
                callbackURL:'http://localhost:5000/api/user/auth/google/callback'
            },PassportMiddleWare.google_signup_Passport));
    }




    // routings

    setRoutes()
    {
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use('/api/user',UserRouter);

    }

    //Unwanted routes handler
    error404Handler()
    {
        this.app.use((req,res)=>
        {
            res.status(404).json(
                {
                    message:'Not Found',
                    Status_code:404,
                });

        });
    }

    //error handler

    HandleErrors()
    {
        this.app.use((error,req,res,next)=>{

            const errorstatus = req.errorStatus || 500;

            res.status(errorstatus).json(
                {
                    message: error.message || 'Something Went Wrong. Please try Again!',
                    status_code: errorstatus,
                });



        });
    }
}
