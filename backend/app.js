const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const Stripe = require('stripe')
const jwt = require('jsonwebtoken')

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

//mongodb connection
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connect to database"))
  .catch((err) => console.log(err));

//schema
const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxlength: 32,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 32,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    index: { unique: true },
    match: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  image: String,
});

//model
const userModel = mongoose.model("user", userSchema);

//api
app.get("/", (req, res) => {
  res.send("Hello from Node.js");
});
//api signup
app.post("/register", async (req, res) => {
  const { email, firstName, lastName, password, confirmpassword, image } =
    req.body;
  const data = {
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    confirmpassword: confirmpassword,
    image: image,
  };
  try {
    const userExists = await userModel.findOne({ email: email });
    if (userExists) {
      return res.send({ message: "email already exists", alert: false });
    } else {
      await userModel.insertMany([data]);
      res.send({ message: "Registration Complete", alert: true });
   
    }
  } catch (e) {
    console.log(e);
  }
});

//api login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await userModel.findOne({
      email: email,
      password: password,
    });

    if (result) {
      const datasend = {
        id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
        // isAuth: true,
        // token: "your-jwt-token",
        // expiresIn: "1h",
      };
      console.log(datasend);
      res.send({
        message: "login is successfully and Redirecting to then Page",
        alert: true,
        data: datasend,
      });
      const token = jwt.sign(
        { email: user.email, _id: user._id },
        "divyesh",
        { expiresIn: '24h' }
    )
      res.cookie("token",token)
    } else {
      res.send({
        message: "Invalid email or password or Create an account",
        alert: false,
      });
    }
  } catch (e) {
    console.log(e);
  }

  // bcrypt.compare(password,result.password,(err,isMatch)=>{
  //   if(err){
  //     console.log(err)
  //     return res.send({message:"Invalid email or password",alert:false})
  //   }
  //   if(isMatch){
  //     return res.send({message:"Login Successful",alert:true})
  //   }
  //   else{
  //     return res.send({message:"Invalid email or password",alert:false})
  //   }
  // })
});
//product section

//schema

const productSchema = mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  image: String,
  description: String,
});

//model

const productModel = mongoose.model("product", productSchema);

//product api

//save product in database
app.post("/uploadproduct", async (req, res) => {
  
  const { name, category, price, image, description } = req.body;
  const data = {
    name: name,
    category: category,
    price: price,
    description: description,
    image: image,
  };
  try {
    await productModel.insertMany([data]);
    res.send({ message: "upload successfully", alert: true });
  } catch (e) {
    console.log(e);
    res.send({ message: "Error in uploading", alert: false });
  }
});

//get product from database
app.get("/product",async(req,res)=>{
  const data =await productModel.find({})
  res.send(JSON.stringify(data))
})

/*****payment getWay */
console.log(process.env.STRIPE_SECRET_KEY)


const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)

app.post("/create-checkout-session",async(req,res)=>{

// const {productCartItem} = req.body;
// const lineItems = productCartItem.map((product)=>{
//   price_data:{
//     currency:"usd"
//     product_data : {
//       name : product.name
//       images : [product.image]
//     }
//     unit_amount : product.price * 100
//   }
//   quantity:product.quantity
// })
// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ['card'],
//   line_items: lineItems,
//   mode: 'payment',
//   success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//   cancel_url: `${process.env.FRONTEND_URL}/cancel`,
// })
// res.send({id:session.id})

     try{
      const params = {
          submit_type : 'pay',
          mode : "payment",
          payment_method_types : ['card'],
          billing_address_collection : "auto",
          shipping_options : [{shipping_rate : "shr_1N0qDnSAq8kJSdzMvlVkJdua"}],

          line_items : req.body.map((item)=>{
            return{
              price_data : {
                currency : "inr",
                product_data : {
                  name : item.name,
                  images : [item.image]
                },
                unit_amount : item.price * 100,
              },
              adjustable_quantity : {
                enabled : true,
                minimum : 1,
              },
              quantity : item.qty
            }
          }),

          success_url : `${process.env.FRONTEND_URL}/success`,
          cancel_url : `${process.env.FRONTEND_URL}/cancel`,

      }

      
      const session = await stripe.checkout.sessions.create(params)
      // console.log(session)
      res.status(200).json(session.id)
     }
     catch (err){
        res.status(err.statusCode || 500).json(err.message)
     }

})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
