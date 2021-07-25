const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AuthSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlenght: [2, "invalid name"]
    },
    lastname: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        minlenght: [2, "invalid name"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value))
            {
                throw new Error("invalid email address")
            }
        }
    },
    number: {
        type: Number,
        required: true,
        unique: true,
        min: [10, "invalid number"]
    },
    lastname: {
        type: String,
        required: true,
        uppercase: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required : true
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

AuthSchema.methods.generateTokens = async function () {
    try
    {
        const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
        
    } catch (error)
    {
        res.status(501).render("error", { para: error });
    }
};

AuthSchema.pre("save", async function (next) {
    if (this.isModified("password"))
    {
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    }
    next();
});

const AuthUser = new mongoose.model("AuthUser", AuthSchema);

module.exports = AuthUser;