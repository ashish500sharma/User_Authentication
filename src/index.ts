import {Server} from "./server";

// server running at port 5000


let server = new Server().app;
let port = process.env.PORT || 5000;
server.listen(port,()=>
{
   console.log("Server running at 5000 Port");
});





