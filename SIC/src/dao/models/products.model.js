import mongoose from "mongoose";

//nombre de la collecion de productos
const productsCollection = "products";

//esquema de productos
const productSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true
    },
    precio:{
        type:Number,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    categoria:{
        type:String,
        required:true,
        enum:["Leche","Helado","Alcohol"]
    },
    stock:{
        type:Number,
        required:true
    }
});

export const productsModel = mongoose.model(productsCollection,productSchema);