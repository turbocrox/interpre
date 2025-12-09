import express  from   "express"
import {ENV} from  "./lib/env.js";
import  path  from  "path";


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



app.listen(ENV.PORT,()=>console.log(`server is running on port ${ENV.PORT}`)); 