// import React from 'react'
// import FavouriteItem from '../Components/FavouriteItem/FavouriteItem'

// const Favourites = () => {
//   return (
//     <div>
//       <FavouriteItem/>
//     </div>
//   )
// }

// export default Favourites

import React from 'react';
import Wishlist from '../Components/Wishlist/Wishlist';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar/Navbar';
import { useParams } from 'react-router-dom';
import { API } from '../backend';

const Home = () => {
  const { userId } = useParams();

  return (
   <div>
      <Navbar userId={userId} menu={"favourites"}/>
      <Wishlist category="Favourites" mypath={`${API}/api/favourites/${userId}`} userId={userId}/>
      <Footer />
    </div>
  );
};

export default Home;

