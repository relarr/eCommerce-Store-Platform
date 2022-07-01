import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from './Button';
import './AddToCart.css';

const AddToCart = (props) => {
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  return (
    <div className='add-to-cart'>
      <div className='stock'>
        <h4>
          {props.stock.length - 1 > 0
            ? `${props.stock.length - 1} in stock`
            : 'Out of stock'}
        </h4>
      </div>
      <div className='divisor'></div>
      <div className='quantity'>
        <p>Quantity</p>
        <select
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
        >
          {props.stock.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className='divisor'></div>
      <div>
        <Button
          disabled={quantity < 1}
          onClick={() => navigate(`/cart/${props.productId}?qty=${quantity}`)}
        >
          ADD TO CART
        </Button>
      </div>
    </div>
  );
};

export default AddToCart;
