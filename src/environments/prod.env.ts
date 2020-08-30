import {Environment} from "./env";

export  const prodEnvironment : Environment =
    {
        db_url: "*",
        jwt_secret_key:'prod_secret'
    }