const express=require("express");
const Bodyparser=require("body-parser");
const request=require("request");
const https=require("https");

const app=express();

app.use(Bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/signup.html")
})

app.post("/",(req,res)=>{
    const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;
    
    const data={
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstname,
                    LNAME:lastname
                }
            }
        ]
    };

    const JSONdata= JSON.stringify(data);

    const url="https://us8.api.mailchimp.com/3.0/lists/8470aaa020";
    const options={
        method:"POST", 
        auth:"hardik:1405d852d7c8c111efabd525b88a04eb5-us8"
    };

    const request = https.request(url,options,(response)=>{

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })

    })
    
    request.write(JSONdata);
    request.on("error",err=>{
        console.log(err);
    });
    
    request.end();  
});


app.post("/failure",(req,res)=>{
    res.redirect("/");
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("Running on port 3000");
})

// 405d852d7c8c111efabd525b88a04eb5-us8
// 8470aaa020