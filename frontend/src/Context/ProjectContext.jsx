import React, { createContext, useEffect, useMemo, useState } from 'react'
import { API } from '../backend';
import { getCurrentUserId } from '../session';
// import all_plants from "../Components/Assets/all_products"
export const ProjectContext= createContext(null);

const ProjectContextProvider = (props) => {

    const [totalQuantity, setQuantity] = useState(0);
    const [cart, setCart] = useState({});
  const [cartItems, setCartItems] = useState([]);

    // const updateTotalQuantity=(items)=>{
    //     let total=0;
    //     items.map((item)=>{
    //         total+=item.quantity;
    //       });
    //     setQuantity(total);
    // }
    const updateTotalQuantity= async (items)=>{
        if (!getCurrentUserId()) return;
        try {
            const response = await fetch(`${API}/api/cart/viewCart/${getCurrentUserId()}`);
            const data = await response.json();
            setCart(data);
            setCartItems(data.items);
            console.log(data.items);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
          let total=0;
          cartItems.map((item)=>{
              total+=item.quantity;
            });
          setQuantity(total);
    }
    const contextValue={totalQuantity,updateTotalQuantity};

    
    return (
      <ProjectContext.Provider value={contextValue}>
          {props.children}
      </ProjectContext.Provider>
    )
}

export default ProjectContextProvider