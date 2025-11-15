const mongoose = require("mongoose");

const portfolioSchema = mongoose.Schema({
    name : { 
        type : String ,
        required : true
    },
    sector : String ,
    purchasePrice : {
        type : Number,
        required : true
    },
    quantity : {
        type : Number,
        required : true
    },
    investment : {
        type : Number,
        required : true
    },
    portfolioPer : {
        type : Number,
        required : true
    },
    sec : String ,
    ticker : String ,
    price : Number ,
    apiName : String

})

module.exports = mongoose.model("portfolio",portfolioSchema)