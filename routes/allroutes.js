// const express = require('express')

// const router = express.Router()
// const schema1= require("../models/allschemas.js")

// router.get('/users',async(req,res)=>{
//     try{
//         // console.log("id"+req.params.id);

//         schema1.find()
//         .then(user => res.json(user))
//         .catch(err => res.json(err))
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).send(" error while fetching houses");
//     }
//     // res.json({hey:'this is all routes page...'})
// })

// router.get('/user/:id',async(req,res)=>{
//     let myid = req.params.id;

//     try{
//         console.log("id"+req.params.id);

//         const user = await schema1.findById(myid);
//         res.send(user);
//         // schema1.findById(myid)
//         // .then(user => res.json(user))
//         // .catch(err => res.json(err))
//     }
//     catch(err){
//         console.log(err);
//         res.status(500).send(" error while fetching houses");
//     }
//     // res.json({hey:'this is all routes page...'})
// })

// router.post('/x',async(req,res)=>{
//     // const{name, ph_number, mail}=req.body
//     try {
//         // const x=await schema1.create(req.body)
//         const x= new schema1(req.body)
//         const y= await x.save()
//         res.send(y)
//         // res.status(200).json(x)
//     } catch (error) {
//         res.status(400).json({error:error.message})
//     }
//     // res.json({a:'A'})
// })
// module.exports= router  


const express = require('express');
const router = express.Router();
const x = require("../models/allschemas");
const JWT_SECRET = "AARU";
const jwt = require('jsonwebtoken');


router.post('/signup', async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, password and email are required fields' });

    }


    try {
        let user = await x.findOne({ email });

        if (!user) {
            user = new x({ name, email, password , isAdmin});
            await user.save();
            const data = {
                user: {
                    id: user.id
                }
            }

            const authToken = jwt.sign(data, JWT_SECRET);

            console.log({ authToken });
            res.json({ auth: true, 'authtoken': authToken, message: 'User data saved successfully' });
        }
        else {
            res.json({ message: 'Email is already exists!!' });
        }
    } catch (error) {
        console.error('Error saving user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/signin', async (req, res) => {
    const { email , password} = req.body;
    if ( !email || !password ) {
      return res.status(400).json({ error: 'Please enter the email and password' });
    }
    try {
      let user = await x.findOne({ email});
      if (!user) {
        res.json({ message: 'Email does not exists!!' });
      }
      if (password !== user.password) {
        return res.status(400).json({ message: 'Invalid credentials!' });
      }
      else
      {
        const data = {
          user:{
            id: user.id
          }
        }
        const user_name = user.name;
        const authToken = jwt.sign(data, JWT_SECRET);
        
        console.log({authToken});
        res.json({ user_Name : user_name, auth : true ,'authtoken':authToken, message: 'User logined successfully' });
      }
    } catch (error) {
      console.error('Error saving user details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;