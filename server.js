const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const {userModal, inventory_Modal, orderModel} = require("./userSchema");


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

app.post("/order",async(req,res)=>{
    
    const item =    await inventory_Modal.find({inventory_id: req.body.inventory_id});
    if(item.length){
        if(item[0].available_quantity >= req.body.quantity){
            const resultquantity = item[0].available_quantity - req.body.quantity;
            const orderData = await  orderModel.create({customer_id: req.body.customer_id,inventory_id: req.body.inventory_id,item_name: req.body.item_name,quantity: req.body.quantity});
            res.status(200).send(orderData);
            const inventoryupdate = await inventory_Modal.updateOne({inventory_id: req.body.inventory_id},{available_quantity: resultquantity});
            console.log(inventoryupdate);
        }else{
            res.status(400).send("out of stock");
        }
    }
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
app.get("/order",(req,res)=>{
    orderModel.find().then((orders)=>{
        res.render("orders",{orders});
    })
});