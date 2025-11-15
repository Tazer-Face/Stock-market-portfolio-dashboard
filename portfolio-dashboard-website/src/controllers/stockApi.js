const portfolioModel = require('../models/Portfolio');

exports.findAllStocks = async(req,res) => {
    try{
        let result = await portfolioModel.find({}).lean();
        res.status(200).send(result);
    }
    catch(error){
        res.status(500).send("Something went wrong");
    }
}
