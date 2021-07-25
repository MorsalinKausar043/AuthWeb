const express = require('express');
const AuthUser = require('./models/conn');
const router = new express.Router();
const bcrypt = require("bcryptjs");
const cookie = require("cookie");

// middleware 
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// router get 

router.get("/", (req, res) => {
    res.status(201).render("index");
})

router.get("/registration", (req, res) => {
    res.status(201).render("registration");
})

router.get("/login", (req, res) => {
    res.status(201).render("login");
})

router.get("/error", (req, res) => {
    res.status(501).render("error");
})

router.get("/register-api", async (req, res) => {
    try {
        const getUserData = await AuthUser.find({});
        res.status(201).send(getUserData);
    } catch (error){
        res.status(501).render("error", { para: error });
    }
})

// router post

router.post("/registration", async (req, res) => {
    try
    {
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;
        if (password === confirmpassword)
        {
            const AuthUserData = new AuthUser({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                number : req.body.number,
                password : password ,
                confirmpassword : confirmpassword
            })

            const token = await AuthUserData.generateTokens();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000),
                httpOnly: true
            });


            await AuthUserData.save();
            res.status(201).render("index");
            
        } else
        {
            res.status(501).render("error", { para: error });
        }

    } catch (error)
    {
        console.log(error);
        res.status(501).render("error", { para: error });
    }
});



router.post("/login", async (req, res) => {
    try
    {
        const email = req.body.email;
        const password = req.body.password;

        const userMail = await AuthUser.findOne({ email });
        const isMatch = await bcrypt.compare(password, userMail.password);

        const token = await userMail.generateTokens();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000),
            httpOnly: true
        });

        isMatch? res.status(201).render("index") : res.status(501).render("error", { para: error });
        
    } catch (error) {
        res.status(501).render("error", { para: "invalid password" });
    }
})


// router export 

module.exports = router;