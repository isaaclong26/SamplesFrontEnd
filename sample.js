
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const catSchema = new Schema({
    name: String,
    inventory: Number,
    products: [{type: Schema.Types.ObjectId, ref:"Product"}]


})

const productSchema = new Schema({
        name: String,
        category: {type: Schema.Types.ObjectId, ref: "Cat"},
        samples: [{type: Schema.Types.ObjectId, ref: "Sample"}]
    



})




const sampleSchema = new Schema({
    name: String,
    inventory: Number,
    location: String,
    category: String,
    image: String,
    finish: String,
    requestType: String,
})



const Sample = mongoose.model("Sample", sampleSchema)
const Cat = mongoose.model("Cat", catSchema)

const Product = mongoose.model("Product", productSchema)

module.exports= {Sample, Cat, Product};