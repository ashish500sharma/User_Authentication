import {Utils} from "../utils/Utils";
import User from "../models/User";

export class PassportMiddleWare
{
    static async fb_signup_Passport (accessToken,refreshToken,profile,done)
    {

        try
        {   const password = 'Ashish@123';
            const hash =  await Utils.encryptedPassword(password);
            const user = await User.findOne({facebookId:profile.id,});

            if(user)
            {
                done(null,profile);
            }else
            {

                const data =
                    {
                        email:profile.emails[0].value ,
                        username:'default',
                        role:'user',
                        phone_no:7894561230,
                        password:hash,
                        verification_token:Utils.generateVerificationToken(),
                        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                        fb_token:accessToken,
                        facebookId:profile.id,
                        on_board:0
                    }

                await new User(data).save();
                done(null,profile);
            }

        }
        catch (e)
        {
            console.log(e);
           done(e);
        }
    }

    static async google_signup_Passport (accessToken,refreshToken,profile,done)
    {

        try
        {   const password = 'Ashish@123';
            const hash =  await Utils.encryptedPassword(password);
            const user = await User.findOne({googleId:profile.id,});

            if(user)
            {
               return  done(null,profile);
            }else
            {

                const data =
                    {
                        email:profile.emails[0].value,
                        username:'default'+ Utils.generateVerificationToken(),
                        role:'user',
                        phone_no:78945+ Utils.generateVerificationToken(),
                        password:hash,
                        verification_token:Utils.generateVerificationToken(),
                        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
                        google_token:accessToken,
                        googleId:profile.id,
                        verified:true,
                        on_board:0
                    }

                await new User(data).save();
               return  done(null,profile);
            }

        }
        catch (e)
        {
            console.log(e);
            done(e,e.message);
        }
    }



}
