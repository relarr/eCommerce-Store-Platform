import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addProductToCart, cartActions } from '../store/cart';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './Cart.css';

const Cart = () => {
  const { pid } = useParams();
  const [searchParams] = useSearchParams();
  const quantity = Number(searchParams.get('qty'));
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  const subtotalAmount = cart
    .reduce(
      (subtotal, product) => subtotal + product.quantity * product.price,
      0
    )
    .toFixed(2);

  useEffect(() => {
    if (pid) {
      dispatch(addProductToCart({ productId: pid, quantity }));
    }
  }, [dispatch, pid, quantity]);

  const navigate = useNavigate();
  const proceedHandler = () => {
    if (token) navigate('/shipping');
    else navigate('/auth?redirect=shipping');
  };

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : cart.length === 0 ? (
    <>
      <h2>Your Shopping Cart is empty</h2>
      <Button onClick={() => navigate('/')}>SHOP NOW</Button>
    </>
  ) : (
    cart && (
      <div className='cart'>
        <div className='cart-products'>
          <h3>Your Items</h3>
          {cart.map((product) => (
            <div key={product.productId} className='cart-product'>
              <div className='cart-product-image'>
                <img src={product.image} alt={product.name} />
              </div>
              <div className='cart-product-details'>
                <p>{product.brand}</p>
                <Link to={`/product/${product.productId}`}>
                  <p>{product.name}</p>
                </Link>
              </div>
              <div className='cart-product-price'>
                <p>${(product.price * product.quantity).toFixed(2)}</p>
              </div>
              <div className='cart-product-quantity'>
                <select
                  value={product.quantity}
                  onChange={(event) =>
                    dispatch(
                      addProductToCart({
                        productId: product.productId,
                        quantity: Number(event.target.value),
                      })
                    )
                  }
                >
                  {[...Array(product.stock).keys()].map((val) => (
                    <option key={val + 1}>{val + 1}</option>
                  ))}
                </select>
              </div>
              <div className='delete-button'>
                <span
                  className='material-symbols-outlined'
                  onClick={() =>
                    dispatch(
                      cartActions.removeProductFromCart(product.productId)
                    )
                  }
                >
                  delete_forever
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className='cart-to-checkout'>
          <h3>Order Summary</h3>
          <div className='cart-subtotal'>
            <div className='cart-subtotal-content'>
              <p>Number of Items</p>
              <p>
                {cart.reduce(
                  (subtotal, product) => subtotal + product.quantity,
                  0
                )}
              </p>
            </div>
            <div className='cart-subtotal-content'>
              <h4>Subtotal</h4>
              <h4>${subtotalAmount}</h4>
            </div>
            <div className='cart-subtotal-content'>
              <p>Standard shipping</p>
              <p>${subtotalAmount > 100 ? 'FREE' : '10'}</p>
            </div>
            <div className='cart-subtotal-content'>
              <p>Estimated taxes</p>
              <p>--</p>
            </div>
            <div className='cart-subtotal-content'>
              <h4>Order total</h4>
              <h4>${subtotalAmount}</h4>
            </div>
          </div>
          <Button onClick={proceedHandler}>PROCEED TO CHECKOUT</Button>
        </div>
      </div>
    )
  );
};

export default Cart;
