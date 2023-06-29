/** Uncomment the below codeblock if you want to add google analytics for more info please visit our docs analytics section */
/** 
import { useEffect } from 'react';
import Router from 'next/router';
import { initGA, logPageView } from 'analytics';
*/
import React, { useEffect } from 'react'
import Head from "next/head";
import '../assets/css/react-slick.css';
import 'tailwindcss/tailwind.css';
import "../styles/globals.css";
import "../styles/tachyons.min.css";
import "../styles/spinner.css";
import "../styles/index.css";
import "../styles/popup.css";

export default function CustomApp({ Component, pageProps }) {
  
  // return 
  return (
 
   
         <><Head>
      <link rel="shortcut icon" href="/images/logoonlyblue.png" />
    </Head><Component {...pageProps} /></> 
    
  );

}


