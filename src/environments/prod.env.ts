import {Environment} from "./env";

export  const prodEnvironment : Environment =
    {
        db_url: "mongodb+srv://musikii:12345@musikii.pxw5y.mongodb.net/musikii?retryWrites=true&w=majority",
        jwt_secret_key:'prod_secret'
    }