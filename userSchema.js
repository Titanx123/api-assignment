const mongoose = require("mongoose");

// creating schema using new mongoose where userchema is the schema name
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    customer_id: Number
});

const inventorySchema = new mongoose.Schema({
    inventory_id : Number,
    inventory_type: String,
    item_name : String,
    available_quantity: Number
});

// user is the collection name
const userModal = mongoose.model("user",userSchema);
const inventory_Modal = mongoose.model("inventory",inventorySchema);
// exporting the schema
module.exports = {userModal,inventory_Modal};