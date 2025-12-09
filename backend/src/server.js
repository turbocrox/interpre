import express  from   "express"
import {ENV} from  "./lib/env.js";
import  path  from  "path";
import  { connectDB }  from "./lib/db.js";
import { start } from "repl";


const app = express();
const  __dirname =  path.resolve();
app.get("/health",(req,res)=>{
   res.status(200).json({message:"Server is running" });
});

// make  out app  for deployment  ---  acc  to  this it mean hat  when  
// ever  we will  vist  the api other then  above one it will  take to  react app 
//  so we have  now under one  url  two  (server  amd  react app) both  
if(ENV.NODE_ENV === "production")
{
   app.use(express.static(path.join(__dirname,"../frontend/dist")));
   app.get("/{*any}",(req,res)=>{
      res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
   })
}


//  for  conneting to db  and  then start the server (simple + best  practice  )
const  startServer =  async ()=>
{
   try{
      await connectDB();
      app.listen(ENV.PORT,()=>{
      console.log("server  started on port",ENV.PORT);
      });


   }
   catch(error)
   {
      console.error("Error starting server:", error);
      process.exit(1);
   }
}


startServer();
