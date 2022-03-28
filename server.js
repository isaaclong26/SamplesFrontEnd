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

mongoose.connect('mongodb://localhost:27017/samplesdb1' , { useNewUrlParser: true ,  tlsAllowInvalidHostnames: true});






app.post("/addSample/:pro", async (req, res)=>{

      let pro = req.params.pro
      
      let correctProduct = await Product.findOne({name: pro})
      


      let newSamp = await Sample.create(req.body)
     
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
  
  








app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});



