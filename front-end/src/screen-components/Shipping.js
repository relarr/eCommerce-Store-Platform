import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { cartActions } from '../store/cart';
import Form from '../UI-components/Form';
import Button from '../UI-components/Button';
import './Shipping.css';

const Shipping = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  const { cart } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [addressInputTouched, setAddressInputTouched] = useState(false);
  const [city, setCity] = useState(shippingAddress.city || '');
  const [cityInputTouched, setCityInputTouched] = useState(false);
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [postalCodeInputTouched, setPostalCodeInputTouched] = useState(false);
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [countryInputTouched, setCountryInputTouched] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState('');

  const subtotalAmount = cart
    .reduce(
      (subtotal, product) => subtotal + product.quantity * product.price,
      0
    )
    .toFixed(2);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(
      cartActions.storeShippingAddress({ address, city, postalCode, country })
    );
    dispatch(cartActions.savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className='shipping'>
      <div className='shipping-form'>
        <Form title='Shipping' onSubmit={submitHandler}>
          <label htmlFor='adress'>Address</label>
          <input
            className={
              address.length < 3 && addressInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            onBlur={() => setAddressInputTouched(true)}
          />
          <label>City</label>
          <input
            className={
              city.length < 3 && cityInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={city}
            onChange={(event) => setCity(event.target.value)}
            onBlur={() => setCityInputTouched(true)}
          />
          <label>Postal Code</label>
          <input
            className={
              postalCode.length < 5 && postalCodeInputTouched
                ? 'invalid-input'
                : ''
            }
            type='text'
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            onBlur={() => setPostalCodeInputTouched(true)}
          />
          <label>Country</label>
          <input
            className={
              country.length < 3 && countryInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            onBlur={() => setCountryInputTouched(true)}
          />
          <h3>Payment Method</h3>
          <div className='payment-input'>
            <input
              type='radio'
              id='paypal'
              name='paypal'
              value='PayPal'
              onChange={(event) => setPaymentMethod(event.target.value)}
            />
            <label>PayPal</label>
          </div>
          <Button
            disabled={
              address === '' ||
              city === '' ||
              postalCode === '' ||
              country === '' ||
              paymentMethod === ''
            }
          >
            CONTINUE
          </Button>
        </Form>
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
      </div>
    </div>
  );
};

export default Shipping;
