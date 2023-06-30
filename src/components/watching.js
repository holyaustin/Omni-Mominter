/** @jsxRuntime classic */
/** @jsx jsx */ 

import React, { useEffect, useState } from "react";
import { jsx, Box } from 'theme-ui';
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { useRouter } from 'next/router'
import { useNavigate, useLocation } from "react-router-dom";
import Web3Modal from "web3modal";
import { Player } from '@livepeer/react';
import Image from 'next/image';
import { rgba } from 'polished';
import ShareLink from "react-twitter-share-link";
import Popup from 'reactjs-popup';
//import 'reactjs-popup/dist/index.css';

import blenderPoster from '../../public/images/mominter_logo.png';
import fileNFT from "../../artifacts/contracts/Mominter.sol/Mominter.json";
import { MominterAddress } from "../../config";

const containerStyle = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  paddingTop: "56.25%", /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
};
const responsiveIframe = {
  position: "absolute",
  top: "0",
  left: "0",
  bottom: "0",
  right: "0",
  width: "100%",
  height: "100%",
};

export default function Watching() {
  console.log('Entered watching component');
  const [formInput, updateFormInput] = useState({ tipamount: '' })
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [owners, setOwners] = useState([]);
  const [ensName, setEnsName] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    loadVideo();
    //loadCount();
    console.log("Counter executed")
  }, []);

  const getIPFSGatewayURL = (ipfsURL) => {
    const urlArray = ipfsURL.split("/");
    const ipfsGateWayURL = `https://${urlArray[2]}.ipfs.nftstorage.link/${urlArray[3]}`;
    return ipfsGateWayURL;
  };
  
  const getId = (props) => {
    console.log(props);
    return props;
  };

  async function Live() {
    router.push("/dashboardLive");
  }
  async function Claim() {
    const { tipamount } = formInput;
    if (!tipamount) { 
      alert("Please enter a valid tip amount")
      return;
    };
    updateFormInput(tipamount);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // get tip amount

  const decimals = 18;
    //const tip = tipamount
    const tip = "1000000000000000000";
    console.log("Tip is ", tip);
    const amount = ethers.utils.parseUnits(tip)
    // const amount = BigNumber.from(tip).mul(BigNumber.from(10).pow(decimals));
    console.log("Amount is ", amount);
    const contract = new ethers.Contract(MominterAddress, fileNFT.abi, signer);
    const videoid = props.vid;
    console.log("videoid is ", videoid);
    
    const transaction= await contract.tipCreator(videoid, { value: tip } );
    await transaction.wait();

  }

  const rpcUrl = "https://rpc.ankr.com/zetachain_evm_testnet";
   // const rpcUrl = "localhost";

   const { query: vid } = router; 
   const props =  vid ;
   console.log('Props result is without ', props.vid);

  async function loadVideo() {
    /* create a generic provider and query for items */
    console.log("loading Moments for item", props.vid);
    const vid = props.vid;
    console.log("vid is ", vid);

    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(MominterAddress, fileNFT.abi, signer);
    const data = await contract.fetchOneNews(vid);
    console.log(" data mapping is ", data);
    const data2 = await contract.fetchViews(vid);

    /*
    *  map over items returned from smart contract and format
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      console.log("inside data mapping");
      const tokenUri = await contract.tokenURI(i.tokenId);
      console.log("token Uri is ", tokenUri);
      const httpUri = getIPFSGatewayURL(tokenUri);
      console.log("Http Uri is ", httpUri);
      const meta = await axios.get(httpUri);
      
      const count = (data2.toNumber())+1
      console.log("Moment data fetched from contract");
      console.log("data2 value is ", data2);
      console.log("count value is ", count);
      const filename = i.fileName;
      console.log("Filename is ", filename);
      const created = new Date((i.dateCreated).toNumber() * 1000).toLocaleDateString();
      console.log("date created is ", created);
      const description = i.description;
      console.log("description is ", description);

      const item = {
        tokenId: i.tokenId.toNumber(),
        image: getIPFSGatewayURL(meta.data.image),
        name: meta.data.name,
        created: created,
        description: meta.data.description,
        sharelink: getIPFSGatewayURL(meta.data.image),
        owner: i.owner.toString(),
        view: count,
      };
      console.log("item returned is ", item);
      setOwners(item.owner);
      return item;
    }));
    setNfts(items);
    setLoadingState("loaded");
  }

  async function loadCount() {
    /* create a generic provider and query for items */
      console.log("loading Moments for item", props.vid);
    const vid = props.vid;
    console.log("vid is ", vid);

    try {
      //setTxStatus("Adding transaction to Polygon Mumbai..");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const connectedContract = new ethers.Contract(MominterAddress, fileNFT.abi, provider.getSigner());
      console.log("Count variable is ", vid);

      const mintNFTTx = await connectedContract.createViewItem(vid);
      console.log("View Counter successfully retrieved from Blockchain");
      await mintNFTTx.wait();
      return mintNFTTx;
    } catch (error) {
      setErrorMessage("Failed to send tx to Blockchain.");
      console.log(error);
    }
 
  };

  const PosterImage = () => {
    return (
      <Image
        src={blenderPoster}
        layout="fill"
        objectfit="cover"
        priority
        placeholder="blur"
      />
    );
  };

  if (loadingState === "loaded" && !nfts.length) {
    return (
      <div>
    
        <h1 className="px-20 py-10 text-3xl">You have not selected anyvideo to watch</h1>
        
      </div>
    );
  }
  return (
    <Box as="section"  sx={styles.section} className="bg-blue-800 ">
    <>
    <div className=" text-2xl text-center text-white font-bold ">
        <h1>Watch Moment</h1>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 col-gap-2 row-gap-5 mx-20 my-5">

	<div className="col-start-1 col-end-3 row-span-2 text-white bg-black text-4xl flex items-center justify-center border-4 border-red-500" style={containerStyle}>

  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 pt-4">
{nfts.map((nft, i) => (
    <div key={i} className="shadow rounded-xl overflow-hidden min-w-full " style={responsiveIframe}>
      
      <iframe
        title={nft.name}
        style={responsiveIframe}
        src={`${nft.sharelink}#toolbar=0`}
        className="py-3 object-cover h-full"
        objectfit="cover"
      />
 
    </div>
  ))
}
</div>
    
  </div>

	<div className="row-span-3 text-black bg-white text-2xl flex text-left p-3 ">
    {nfts.map((nft, i) => (
    <div key={i} className="overflow-auto tect-blue-800  bg-white shadow rounded-xl font-bold">
      <div className="p-1">
        <p style={{ height: "20px" }} className="text-3xl font-semibold underline">Video Details</p>
      </div>
      <br/>
      <div className="p-1">
        <p style={{ height: "20px" }} className="text-xl font-semibold"> No. of Views : {nft.view}</p>
      </div>

      <br/>
      <div className="p-1">
        <p style={{ height: "20px" }} className="text-xl font-semibold">Video id: {nft.tokenId}</p>
      </div>
      <br/>
      <div className="p-1">
        <p style={{ height: "40px" }} className="text-xl font-semibold">Moment Title: {nft.name}</p>
      </div>
      <br/>
      <div className="p-1">
        <p style={{ height: "40px" }} className="text-xl font-semibold">Description: {nft.description}</p>
      </div>
      <br/>
      <div className="p-1">
        <p style={{ height: "20px" }} className="text-xl font-semibold"> Published on: {nft.created}</p>
      </div>
      <br/>
      <div className="p-1">
        <p style={{ height: "20px" }} className="text-xl font-semibold">Creator: {nft.owner}</p>
      </div>
      <br/>
      <div className="p-1 mb-5">
        <p style={{ height: "20px" }} className="text-xl font-semibold">IPFS Link : {nft.sharelink}</p>
      </div>
      <br/>


    </div>
  ))}
   </div>

  
		<div className=" col-span-3 text-white pt-3  text-xl flex items-center justify-center sm:row-span-3">
            <div className="p-4 flex">
      <input
          placeholder="Tip Amount in ZETA"
          className=" border rounded p-2 mr-2 w-4/5 text-center text-black  font-bold"
          onChange={e => updateFormInput({ ...formInput, tipamount: e.target.value })}
        />
                  <button type="button" className="w-full bg-blue-800 text-white font-bold py-4 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full" onClick={() => Claim()}>Tip the Creator</button>
      </div>
                <div className="p-4">
                  <button type="button" className="w-full bg-blue-800 text-white font-bold py-4 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full">
                    <a
                      className="social-icon-link github"
                      href="https://web3chat-holyaustin.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="chat"
                    >Chat with Creator 
                    </a>
                  </button>
                </div>
                <div className="p-4">
                <ShareLink link="https://mominter.vercel.app/explore" text="News on Demand from eye witness all around the globe!" hashtags="blockchaintechnology Mominter huddle01 holyaustin IPFS Lighthouse">
              {(link) => (
                  <button type="button" className="w-full bg-blue-800 text-white font-bold py-4 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full">                   
                  <a href={link} target="_blank" rel="noreferrer">Share on Twitter</a></button>
                  )}
            </ShareLink>
                </div>

                <div className="p-4">
                  <button type="button" className="w-full bg-blue-800 text-white font-bold py-4 px-12 border-b-4 border-blue-200 hover:border-blue-500 rounded-full">
                    <a
                      className="social-icon-link github"
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="chat"
                    >Video Conference 
                    </a>
                  </button>
                </div>

            
    </div>

   
</div>
    </>
      </Box>
  );
}

const styles = {
  section: {
    backgroundColor: 'primary',
    pt: [17, null, null, 20, null],
    pb: [6, null, null, 12, 16],
  },
 };
