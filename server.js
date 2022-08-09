const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const {userModal, inventory_Modal} = require("./userSchema");


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));




app.set("view engine","ejs");
app.listen(3003,(err)=>{
    if(!err){
        console.log("Server Started at port 3003");
    }
    else{
        console.log(err);
    }
});

mongoose.connect("mongodb://localhost/api_assignment",()=>{
    console.log("connected to DATABASE");
},(err)=>{
    console.log(err);
});

app.post("/user/add",(req,res)=>{
    userModal.find({email:req.body.email}).then((userData)=>{
        if(userData.length){
            res.status(400).send("User already Exists");
        }
        else{
            userModal.create({name: req.body.name, email: req.body.email,customer_id : Math.floor((Math.random() * 10) + 1)}).then((userData)=>{
                res.status(200).send({userData});
            }).catch((err)=>{
                console.log(err);
            })
        }
    })
});


app.post("/inventory",(req,res)=>{
    inventory_Modal.create({inventory_id: req.body.inventory_id,inventory_type: req.body.inventory_type,item_name: req.body.item_name,available_quantity: req.body.available_quantity}).then((InventoryData)=>{
        res.status(200).send({InventoryData});
    }).catch((err)=>{
        console.log(err);
    })
});


app.get("/inventory/electronics",(req,res)=>{
    inventory_Modal.find({inventory_type: "Electronics"}).then((electronics)=>{
        res.render( "electronics",{electronics});
    }).catch((err)=>{
        console.log(err);
    })
});

app.get("/user/add",(req,res)=>{
    userModal.find().then((user)=>{
        res.render("user",{user});
    })
});

app.get("/inventory",(req,res)=>{
    inventory_Modal.find().then((inventory)=>{
        res.render("inventory",{inventory});
    })
});

app.get("/inventory/furniture",(req,res)=>{
    inventory_Modal.find({inventory_type: "Furniture"}).then((furnitures)=>{
        res.render( "furnitures",{furnitures});
    }).catch((err)=>{
        console.log(err);
    })
});