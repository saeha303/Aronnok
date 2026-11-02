// import React from 'react'
// import Trending from '../Components/Trending/Trending';
// import Cover from '../Components/Cover/Cover';
// import Footer from  '../Components/Footer/Footer';
// import Navbar from '../Components/Navbar/Navbar';
// import { useParams } from 'react-router-dom';

// const Home = () => {
//   const  userId  = useParams();
//   return (
//     <div>
//       <Navbar/>
//       <Cover/>
//       <Trending catagory="Trending" mypath={`${API}/api/trending`}/>
//       <Trending catagory="Recommended for you" mypath =`${API}/api/recommend/${userId}`/>
//       <Footer/>
//     </div>
//   )
// }

// export default Home
import React from 'react';
import Trending from '../Components/Trending/Trending';
import Cover from '../Components/Cover/Cover';
import Footer from '../Components/Footer/Footer';
import Navbar from '../Components/Navbar/Navbar';
import { useParams } from 'react-router-dom';
import { API } from '../backend';

const Home = () => {
  const { userId } = useParams();

  return (
   <div>
      <Navbar userId={userId} menu={"home"}/>
      <Cover userId={userId}/>
      <Trending catagory="Trending" mypath={`${API}/api/trending`} userId={userId}/>
      <Trending catagory="New Arrivals" mypath={`${API}/api/product/newarrival`}  userId={userId}/>
      <Trending catagory="Recommended for you" mypath={`${API}/api/recommend/${userId}`}  userId={userId} />
      <Trending catagory="Coming Soon" mypath={`${API}/api/product/comingsoon`}  userId={userId} />
      <Footer />
    </div>
  );
};

export default Home;
