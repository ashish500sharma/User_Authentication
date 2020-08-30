import * as  Bcrypt from 'bcrypt';

export class Utils
{
  public  MAX_TOKEN_TIME = 50000;

    static generateVerificationToken(size: number = 5)
    {
        let digits = '0123456789';
        let otp = '';
        for(let i=0; i<size;i++)
        {
            otp += digits[Math.floor(Math.random()*10)];


        }
        return parseInt(otp);

    }

    static encryptedPassword(password:String):Promise<any>
    {
      return new Promise((resolve,reject)=>
      {
          Bcrypt.hash(password,10,(err,hash)=>
          {
              if(err)
              {
                  reject(err);
              }else
                  {
                      resolve(hash);
                  }

          });
      });
    }


    static comparePassword(password:{plainPassword:string,encryptedPassword:string}):Promise<any>
    {
        return new Promise((resolve,reject)=>
        {
            Bcrypt.compare(password.plainPassword,password.encryptedPassword,(err,isSame)=>
            {
                if(err)
                {
                    reject(err);
                }
                else if(!isSame)
                {
                    reject(new Error('USERNAME AND PASSWORD DOES NOT MATCH'));
                }
                else
                    {
                        resolve(true);
                    }
            });

        });
    }
}