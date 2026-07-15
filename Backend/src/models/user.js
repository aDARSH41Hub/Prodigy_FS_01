const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:[true, "Name is required"],
        trim:true,
        minlength:[3, "Name must be at least 3 characters"],
        maxlength:[50, "Name must not exceed 50 characters"]
    },

    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please provide a valid email address",
        ], 
    },

    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:[8, "Password must be at least 8 characters"],
        select:false,
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },
    isActive:{
        type:Boolean,
        default:true}
},
{
    timestamps:true,
    toJSON:{ virtuals:true },
    toObject:{ virtuals:true },
}
);    
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.comparePassword = function(candidatePassword){
    return  bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("user",userSchema);