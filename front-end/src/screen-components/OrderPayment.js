import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrder,
  payOrder,
  orderActions,
  orderIsDelivered,
} from '../store/order';
import { cartActions } from '../store/cart';
import { useParams, Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import axios from 'axios';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import Button from '../UI-components/Button';
import './OrderPayment.css';

const OrderPayment = () => {
  const dispatch = useDispatch();
  const {
    order,
    loading,
    error,
    orderPayLoading,
    orderPaySuccess,
    orderIsDeliveredSuccess,
  } = useSelector((state) => state.order);
  const { oid } = useParams();

  const [paypalSdkReady, setPaypalSdkReady] = useState(false);

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(
        process.env.REACT_APP_BACKEND_URL + '/api/config/paypal'
      );
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setPaypalSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (
      !order ||
      order._id !== oid ||
      orderPaySuccess ||
      orderIsDeliveredSuccess
    ) {
      if (orderPaySuccess) dispatch(cartActions.emptyCart());
      dispatch(orderActions.resetOrderPaySuccess());
      dispatch(getOrder(oid));
      if (orderIsDeliveredSuccess)
        dispatch(orderActions.resetOrderIsDeliveredSuccess());
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setPaypalSdkReady(true);
      }
    }
  }, [dispatch, oid, orderPaySuccess, order, orderIsDeliveredSuccess]);

  const paymentHandler = (paymentResult) => {
    dispatch(payOrder({ orderId: oid, paymentResult }));
  };

  const markAsDeliveredHandler = () => {
    dispatch(orderIsDelivered(order));
  };

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    order && (
      <div className='place-order'>
        <div className='order-details'>
          <h3>Order {order && order._id}</h3>
          <div className='divisor'></div>
          <h3>SHIPPING ADDRESS</h3>
          <p>Name: {order && order.userId.name}</p>
          <p>
            Email:{' '}
            <a href={`mailto:${order.userId.email}`}>{order.userId.email}</a>
          </p>
          <p>
            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          <Notification
            message={
              order.isDelivered
                ? `Delivered on ${order.deliveredAt.substring(1, 10)}`
                : 'Not Delivered'
            }
            alert={!order.isDelivered}
          />
          <div className='divisor'></div>
          <h3>PAYMENT METHOD</h3>
          <p>{order.paymentMethod}</p>
          <Notification
            message={
              order.isPaid
                ? `Paid on ${order.paidAt.substring(1, 10)}`
                : 'Not Paid'
            }
            alert={!order.isPaid}
          />

          <div className='divisor'></div>
          <h3>ORDER ITEMS</h3>
          {order.orderItems.map((product) => (
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
              <p>
                {product.quantity} x ${product.price} = $
                {(product.quantity * product.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className='cart-to-checkout'>
          <h3>Order Summary</h3>
          <div className='cart-subtotal'>
            <div className='cart-subtotal-content'>
              <h4>Items</h4>
              <h4>${order.itemsAmount}</h4>
            </div>
            <div className='cart-subtotal-content'>
              <p>Shipping</p>
              <p>${order.shippingAmount}</p>
            </div>
            <div className='cart-subtotal-content'>
              <p>Tax</p>
              <p>${order.taxAmount}</p>
            </div>
            <div className='cart-subtotal-content'>
              <h4>Total</h4>
              <h4>${order.totalAmount}</h4>
            </div>
            {!order.isPaid && (
              <div>
                {orderPayLoading === 'pending' && <LoadingSpinner asOverlay />}
                {!paypalSdkReady ? (
                  <LoadingSpinner asOverlay />
                ) : (
                  <PayPalButton
                    amount={order.totalAmount}
                    onSuccess={paymentHandler}
                  />
                )}
              </div>
            )}
          </div>
          {order.isPaid && !order.isDelivered && (
            <Button onClick={markAsDeliveredHandler}>MARK AS DELIVERED</Button>
          )}
        </div>
      </div>
    )
  );
};

export default OrderPayment;
