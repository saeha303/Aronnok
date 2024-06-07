// import React from "react";
// import { useParams } from 'react-router-dom';
// import OneProduct from "../Components/OneProduct/OneProduct";

// const ViewProduct = (props) => {
//     // Get the product ID from the URL parameters
//     // const { productId } = useParams();
//     const { productId } = props.params;

//     return (
//         <div>
//            {/* Pass the product ID to the OneProduct component */}
//            <OneProduct productId={productId} />
//         </div>
//     );
// };

// export default ViewProduct;

import React from 'react';
import OneProduct from '../Components/OneProduct/OneProduct';
import Footer from '../Components/Footer/Footer';
import { useParams } from 'react-router-dom';
import Navbar from '../Components/Navbar/Navbar';




const ViewProduct = () => {
    // Get the product ID from the URL parameters
    const { category,userId,productId} = useParams();
    // console.log(productId);
    console.log("helloooooooooooooooooooooooooooo we got the product id", {productId});
    console.log(category);
    console.log("category in view product")
    let path=''
    if (category === 'comingsoon') {
      path=`https://aronnok.vercel.app/api/comingsoon/${userId}/${productId}`;
  } else {
      path=`https://aronnok.vercel.app/api/product/${userId}/${productId}`;
  }
  console.log(path);
  
    return (
      <div>
        <Navbar userId={userId}/>
        {/* Pass the product ID to the OneProduct component */}
        <OneProduct mypath={path} productId={productId} userId={userId} whattype={category} />
        <Footer />
      </div>
    );
  };
  
  export default ViewProduct;