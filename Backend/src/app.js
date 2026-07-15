const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

function createApp() {
    
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.get("/health",(req,res)=>{
        res.status(200).json({
            status:"ok"
        });
    });

    app.use("/api/auth",authRoutes);

    return app;
}

module.exports = {createApp};