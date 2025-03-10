import { Request, Response, Application } from "express";
require("dotenv").config();
const { Web3 } = require("web3");
const { contractABI } = require("./abi.json");
import { Companies } from "../models/company.model"; 

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const contractAddress = "0x26Fe86CFDe39799670Ccb46b6aBec1eFDfe2A734";
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

function addAccountToWallet(account) {
  if (!web3.eth.accounts.wallet.some((a) => a.address === account.address)) {
    web3.eth.accounts.wallet.add(account);
  }
}

addAccountToWallet(account);
const contract = new web3.eth.Contract(contractABI, contractAddress);

const store = new Companies(); 

const paymentHandler = async (req: Request, res: Response) => {
  const { companyId, tripId, userWalletAddress, amountInWei } = req.body;

  try {
    const company = await store.show(companyId);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const companyWalletAddress = company.wallet;

    if (!companyWalletAddress) {
      return res.status(400).json({ error: "Company wallet address is missing" });
    }

    addAccountToWallet(account);

    const amountHex = web3.utils.toHex(amountInWei); 

    const gas = await contract.methods
      .processPayment(companyId, tripId, userWalletAddress, companyWalletAddress)
      .estimateGas({ from: account.address, value: amountHex }); 

    const tx = contract.methods.processPayment(companyId, tripId, userWalletAddress, companyWalletAddress);

    const nonce = await web3.eth.getTransactionCount(account.address);

    const gasPrice = await web3.eth.getGasPrice();

    const signedTx = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: tx.encodeABI(),
        gas: gas,
        value: amountHex, 
        from: account.address, 
        nonce: nonce,
        gasPrice: gasPrice,
      },
      process.env.PRIVATE_KEY
    );

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    res.status(200).send({
      message: "Payment successful",
      transactionHash: receipt.transactionHash,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send("Error processing payment");
  }
};

// Route registration function
const registerPaymentRoute = (app: Application) => {
  app.post("/payment", paymentHandler); 
};

export default registerPaymentRoute; 



// import { Request, Response, Application } from "express";
// require("dotenv").config();
// const { Web3 } = require("web3");
// const { contractABI } = require("./abi.json");

// const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
// const contractAddress = "0x26Fe86CFDe39799670Ccb46b6aBec1eFDfe2A734";
// const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

// function addAccountToWallet(account) {
//   if (!web3.eth.accounts.wallet.some((a) => a.address === account.address)) {
//     web3.eth.accounts.wallet.add(account);
//   }
// }

// addAccountToWallet(account);
// const contract = new web3.eth.Contract(contractABI, contractAddress);


// const paymentHandler = async (req: Request, res: Response) => {
//     const { companyId, tripId, userWalletAddress, amountInWei } = req.body;
  
//     try {
     
//       addAccountToWallet(account); 
//       const gas = await contract.methods
//         .processPayment(companyId, tripId, userWalletAddress)
//         .estimateGas({ from: account.address, value: amountInWei });
  
//       // Create the transaction
//       const tx = contract.methods.processPayment(companyId, tripId, userWalletAddress);
  
//       // Get the nonce for the transaction
//       const nonce = await web3.eth.getTransactionCount(account.address);
  
//       // Fetch the current gas price
//       const gasPrice = await web3.eth.getGasPrice();
  
//       // Sign the transaction
//       const signedTx = await web3.eth.accounts.signTransaction(
//         {
//           to: contractAddress,
//           data: tx.encodeABI(),
//           gas: gas,
//           value: amountInWei,
//           from: account.address, 
//           nonce: nonce,
//           gasPrice: gasPrice, 
//           // For EIP-1559 transactions
//           // maxFeePerGas: gasPrice,
//           // maxPriorityFeePerGas: gasPrice,
//         },
//         process.env.PRIVATE_KEY
//       );
  
//       // Send the signed transaction
//       const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
//       res.status(200).send({
//         message: "Payment successful",
//         transactionHash: receipt.transactionHash,
//       });
//     } catch (error) {
//       console.error("Error processing payment:", error);
//       res.status(500).send("Error processing payment");
//     }
//   };
  

//   const registerPaymentRoute = (app: Application) => {
//     app.post("/payment", paymentHandler);
//   };

//   export default registerPaymentRoute;