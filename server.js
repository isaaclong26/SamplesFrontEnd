const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const path = require("path")
const cors = require('cors');
const app = express();
const {Cat, Sample, Product} = require("./sample")


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();

app.use(express.static("public"));
app.use(cors());

mongoose.connect('mongodb+srv://isaaclong26:elco9377@cluster0.0claj.mongodb.net/samplesDB?retryWrites=true&w=majority' , { useNewUrlParser: true ,  tlsAllowInvalidHostnames: true});






app.post("/addSample/:pro", async (req, res)=>{
      console.log("/addSample")

      let pro = req.params.pro
      
      let correctProduct = await Product.findOne({name: pro})
      


      let newSamp = await Sample.create(req.body)
      console.log(newSamp)
       correctProduct.samples.push(newSamp)

       correctProduct.save()

      res.send(correctProduct)
})
app.post("/addCat", async (req, res)=>{
  console.log("/addCat")
console.log(req.body)
// { Sample Body 
//      name: String,
//     inventory: Number,
//     products: [{type: Schema.Types.ObjectId, ref:"product"}

  Cat.create(req.body).then(newCat => {res.json(newCat);})


})
app.post("/addProduct/:cat", async (req, res)=>{
  console.log("/addProduct")
  console.log(req.body)
  // Sample Body 
  // name: String,
  //       category: {type: Schema.Types.ObjectId, ref: "cat"},
  //       samples: [{type: Schema.Types.ObjectId, ref: "sample"}]
  


    let cat = req.params.cat
    let corCat = await Cat.findOne({name: cat}).populate()
    let newProduct = await Product.create(req.body)
    corCat.products.push(newProduct)
    corCat.save();
    console.log(corCat)
    res.send(corCat)
  
  
  })


 app.get("/cats", async (req, res)=>{
    console.log('/cats')
    let cats = await Cat.find().populate({path: "products", populate:{path: "samples", model: "Sample"}})
    res.json(cats);

 }) 
  
 app.get("/samples", async (req, res)=>{

  let cats = await Sample.find()

  res.json(cats);

}) 
app.get("/products", async (req, res)=>{

  let cats = await Product.find()

  res.json(cats);

}) 


app.put("/cats/:catId", async (req, res)=>{
  let {catID} = req.params
  let update = req.body

  let x = await Cat.findOneAndUpdate(catID, update)

  res.json(x)


})

app.put("/product/:productId", async (req, res)=>{
  let {productId} = req.params
  let update = req.body

  let x = await Product.findOneAndUpdate(productID, update)

  res.json(x)


})
app.put("/sample/:sampleId", async (req, res)=>{
  let {sampleId} = req.params
  let update = req.body

  let x = await Sample.findOneAndUpdate(productID, update)

  res.json(x)


})

app.delete("/", async (req, res)=>{

  await Sample.deleteMany({})
  await Product.deleteMany({})
 await  Cat.deleteMany({})
  res.send("done")


})
  
  

app.get("/search/:field/:term", async (req, res)=>{
  
    let term = req.params.term
    let field = req.params.field


    if(field == "cat"){
      let cat = await Cat.findOne({name: term}).populate({path: "products", populate:{path: "samples", model: "Sample"}})
      let products = cat.products

      let samples = [] 
      for(x in products){
          let samps = products[x].samples
          samples = samples.concat(samps)

      }
      res.json(samples)
    
    }

    else if(field== "product"){
      let product = await Product.findOne({name: term}).populate({path: "samples"})
      console.log(product)
      let samples = product.samples
      res.json(samples)
    }
    else{
    let query = {[field]:term}
      console.log(query)

    let results = await Sample.find(query)


    res.json(results)
    }

})


app.get("/fixImages", async (req, res) => {
 
  let samples = await Sample.find()
  let placeholder = "C:/temp/Samples/photos/placeHolder.png" 
  for(x in samples){

    let image = samples[x].image
    
    let name = samples[x].name

    if(image == undefined){
      console.log("no pic given")
    }
    else{
      console.log(image)
    }

    

  }

  res.end();


})



app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});



