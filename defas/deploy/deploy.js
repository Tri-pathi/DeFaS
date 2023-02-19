const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();
const args=["0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed"];
module.exports=async({deployments,getNamedAccounts})=>{
    const{deploy,log}= deployments;
    const {deployer}= await getNamedAccounts();

    const defas=await deploy("DeFaS",{
        from:deployer,
        log:true,
        args:args,
        waitConfirmations:network.config.waitConfirmations||1

    })

    log(`Decentralized Fantasy Sports Contract is deployed at ${defas.address}`);
   if(!developmentChains.includes(network.name)&&process.env.POLYGONSCAN_API){
    await verify(defas.address, args);
   }

}