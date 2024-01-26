import React, { useContext, useState } from 'react'
import './Product.css'
import star_dull from '../Assets/star_dull_icon.png'

import star from '../Assets/star_icon.png'
import { CartContext } from '../../Context/CartContext'

const Product = (prod) => {

  const{print,cartItems,cartTotalPrice,addToCart,removeFromCart}=useContext(CartContext);
    const ratingStars = () => {
        const result = [];
        for (let i = 0; i < prod.rating; i++) {
          result.push(<img src={star} alt=""/>);
        }
        for (let i = prod.rating; i < 5; i++) {
          result.push(<img src={star_dull} alt=""/>);
        }
        return result;
      };

      const [isClicked, setIsClicked] = useState(false);

      const addToFavourites = () => {
        setIsClicked(!isClicked);
      };

  return (
    <div className='product-container'> 
      <img src={prod.photo} alt="" />
      <div className="plant-details">
        <p className='plant-name'>{prod.name}</p>
        <div className="product-description">
            <p>{prod.description}</p>
        </div>
        <div className="star-img">
            {ratingStars()}
        </div>
        <p className='product-price'><b>${prod.price}</b></p>
        <div className="product-footer">
          <button className='love-icon-btn'>  <i
            className={`bi bi-heart ${isClicked ? 'clicked' : ''}`}
            style={{ fontSize: '20px' }}
            onClick={addToFavourites}
          ></i></button>
          <button className="buy-btn"onClick={addToCart(prod.id)}>Buy</button>    
        </div>
      </div>
    </div>
  )
}

export default Product
