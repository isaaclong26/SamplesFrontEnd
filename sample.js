
const mongoose = require("mongoose");
const Schema = mongoose.Schema;




const requestSchema = new Schema({
    date: {
        type: Date,
        // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
      },
      completedDate: Date,
    address: String,
    samples: [{type: Schema.Types.ObjectId, ref: "Sample"}],
    customer: String,
    status:{
        type: String,
        default: "Incomplete"
    }


})

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
    die: String,
    min: Number,
    requests: [{type: Schema.Types.ObjectId, ref: "Request"}]
})



const Sample = mongoose.model("Sample", sampleSchema)
const Cat = mongoose.model("Cat", catSchema)

const Product = mongoose.model("Product", productSchema)
const Request = mongoose.model("Request", requestSchema)

module.exports= {Sample, Cat, Product, Request};