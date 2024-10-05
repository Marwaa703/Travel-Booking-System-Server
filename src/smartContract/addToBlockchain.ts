import { Request, Response, Application } from "express";
require("dotenv").config();
const { Web3 } = require("web3");
const { contractABI } = require("./abi.json");


const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));
const contractAddress = "0x26Fe86CFDe39799670Ccb46b6aBec1eFDfe2A734";
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

function addAccountToWallet(account: { address: any; }) {
  if (!web3.eth.accounts.wallet.some((a: { address: any; }) => a.address === account.address)) {
    web3.eth.accounts.wallet.add(account);
  }
}


addAccountToWallet(account);
const contract = new web3.eth.Contract(contractABI, contractAddress);


//&Dummy Data
const companies = [
    {
      id: 1,
      name: "Company A",
      physicalAddress: "123 ABC St",
      walletAddress: "0x7B042C1b2AFAEF10Ca614629003132ef1F381EBa", // Company wallet
    },
    {
      id: 2,
      name: "Company B",
      physicalAddress: "456 XYZ St",
      walletAddress: "0x9A23EFA12b4E2037Dd472C3b0043323Ef36A9D13", // Company wallet
    },
  ];
  
  const trips = [
    {
      id: 1,
      companyId: 1, // Company A
      title: "Trip to Mountains",
      price: web3.utils.toWei("0.01", "ether"), // 0.01 ETH in Wei
      date: "2024-10-12",
      maxReservations: 10,
    },
    {
      id: 2,
      companyId: 2, // Company B
      title: "Trip to Beach",
      price: web3.utils.toWei("0.02", "ether"), // 0.02 ETH in Wei
      date: "2024-11-01",
      maxReservations: 5,
    },
  ];

const addToContractHandler = async (req: Request, res: Response) => {
  try {
    const company = companies[0];
    const trip = trips[0];

    // Add company to smart contract
    const gasCompany = await contract.methods
      .createCompany(
        company.name,
        company.physicalAddress,
        company.walletAddress
      )
      .estimateGas({ from: account.address });

    const companyTx = contract.methods.createCompany(
      company.name,
      company.physicalAddress,
      company.walletAddress
    );

    const companySignedTx = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: companyTx.encodeABI(),
        gas: gasCompany,
        from: account.address, 
      },
      process.env.PRIVATE_KEY
    );

    await web3.eth.sendSignedTransaction(companySignedTx.rawTransaction);

    // Add trip to smart contract
    const gasTrip = await contract.methods
      .createTrip(
        trip.companyId,
        trip.title,
        trip.price,
        trip.date,
        trip.maxReservations
      )
      .estimateGas({ from: account.address });

    const tripTx = contract.methods.createTrip(
      trip.companyId,
      trip.title,
      trip.price,
      trip.date,
      trip.maxReservations
    );

    const tripSignedTx = await web3.eth.accounts.signTransaction(
      {
        to: contractAddress,
        data: tripTx.encodeABI(),
        gas: gasTrip,
        from: account.address, 
      },
      process.env.PRIVATE_KEY
    );

    await web3.eth.sendSignedTransaction(tripSignedTx.rawTransaction);

    res.status(200).send("Company and Trip added to smart contract");
  } catch (error) {
    console.error("Error adding company/trip:", error);
    res.status(500).send("Error adding company/trip");
  }
};


const registerCompanyAndTripRoute = (app: Application) => {
    app.post("/add-company-and-trip", addToContractHandler);
  };

  export default registerCompanyAndTripRoute;