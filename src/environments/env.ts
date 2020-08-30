import {prodEnvironment} from "./prod.env";
import {devEnvironment} from "./dev.env";

export interface Environment
{
    db_url:string;
    jwt_secret_key:string;
}
export function getEnvironment()
{
    if(process.env.NODE_ENV === 'production')
    {
        return prodEnvironment;
    }
    else
    {
        return devEnvironment;
    }

}