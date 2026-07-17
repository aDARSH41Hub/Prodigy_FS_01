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
    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
},

    passwordHash:{
        type:String,
        required:[true, "Password is required"],
        minlength:[8, "Password must be at least 8 characters"],
        select:false,
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
    if (!this.isModified("passwordHash")) return;

    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});
userSchema.methods.comparePassword = function(candidatePassword){
    return  bcrypt.compare(candidatePassword, this.passwordHash);
};
module.exports = mongoose.model("user",userSchema);