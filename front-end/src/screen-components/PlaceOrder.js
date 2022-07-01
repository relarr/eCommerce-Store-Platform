import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { createOrder, orderActions } from '../store/order';
import { Link } from 'react-router-dom';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const { shippingAddress, paymentMethod, cart, loading, error } = useSelector(
    (state) => state.cart
  );

  const { newOrder, orderCreateSuccess } = useSelector((state) => state.order);

  const itemsAmount = cart
    .reduce((total, product) => total + product.price * product.quantity, 0)
    .toFixed(2);
  const shippingAmount = itemsAmount > 100 ? 0 : 10;
  const taxAmount = Number(0.11 * itemsAmount).toFixed(2);
  const totalAmount = (
    Number(itemsAmount) +
    Number(shippingAmount) +
    Number(taxAmount)
  ).toFixed(2);

  const navigate = useNavigate();
  const { _id: id } = newOrder;
  useEffect(() => {
    if (orderCreateSuccess) {
      dispatch(orderActions.resetOrderCreateSuccess());
      navigate(`/order/${id}`);
    }
  }, [navigate, orderCreateSuccess, id, dispatch]);

  const submitOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart,
        shippingAddress,
        paymentMethod,
        itemsAmount,
        taxAmount,
        shippingAmount,
        totalAmount,
      })
    );
  };

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    cart && (
      <div className='place-order'>
        <div className='order-details'>
          <h3>SHIPPING ADDRESS</h3>
          <p>
            {shippingAddress.address}, {shippingAddress.city}{' '}
            {shippingAddress.postalCode}, {shippingAddress.country}
          </p>
          <div className='divisor'></div>
          <h3>PAYMENT METHOD</h3>
          <p>{paymentMethod}</p>
          <div className='divisor'></div>
          <h3>ORDER ITEMS</h3>
          {cart.map((product) => (
            <div key={product.productId} className='product-details'>
              <div className='product-image'>
                <img src={product.image} alt={product.name} />
              </div>
              <div className='product-name'>
                <p>{product.brand}</p>
                <Link to={`/product/${product.productId}`}>
                  <p>{product.name}</p>
                </Link>
              </div>
              <div className='product-price'>
                <p>
                  {product.quantity} x ${product.price} = $
                  {(product.quantity * product.price).toFixed(2)}
                </p>
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
              <h4>Items</h4>
              <h4>${itemsAmount}</h4>
            </div>
            <div className='cart-subtotal-content'>
              <p>Standard shipping</p>
              <p>{shippingAmount === 0 && 'FREE'}</p>
            </div>
            <div className='cart-subtotal-content'>
              <p>Tax</p>
              <p>${taxAmount}</p>
            </div>
            <div className='cart-subtotal-content'>
              <h4>Order total</h4>
              <h4>${totalAmount}</h4>
            </div>
          </div>
          <Button onClick={submitOrderHandler}>PLACE ORDER</Button>
        </div>
      </div>
    )
  );
};

export default PlaceOrder;
