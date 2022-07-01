import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NavBar from './nav-components/NavBar';
import Footer from './UI-components/Footer';
import Auth from './users-components/Auth';
import Home from './screen-components/Home';
import Profile from './users-components/Profile';
import ProductsList from './screen-components/ProductsList';
import UsersList from './screen-components/UsersList';
import OrdersList from './screen-components/OrdersList';
import EditProduct from './screen-components/EditProduct';
import EditUser from './screen-components/EditUser';
import NewProduct from './screen-components/NewProduct';
import Product from './screen-components/Product';
import Cart from './screen-components/Cart';
import Shipping from './screen-components/Shipping';
import PlaceOrder from './screen-components/PlaceOrder';
import OrderPayment from './screen-components/OrderPayment';
import { authActions } from './store/auth';
import { getUser, userActions } from './store/user';

let logoutTimer;
const App = () => {
  const dispatch = useDispatch();

  const {
    token: authToken,
    tokenExpiration,
    userId,
  } = useSelector((state) => state.auth);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const dispatchLogout = () => {
      dispatch(authActions.logout());
      dispatch(userActions.resetUser());
    };

    if (authToken && tokenExpiration) {
      const remainingTime =
        new Date(tokenExpiration).getTime() - new Date().getTime();
      logoutTimer = setTimeout(dispatchLogout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [authToken, tokenExpiration, dispatch, user]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      dispatch(
        authActions.login({
          token: storedData.token,
          userId: storedData.userId,
          tokenExpiration: storedData.expiration,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!user && authToken) {
      dispatch(getUser(userId));
    }
  }, [dispatch, user, userId, authToken]);

  let routes;
  if (authToken) {
    routes = (
      <Routes>
        <Route path='/order/:oid' element={<OrderPayment />} />
        <Route path='/placeorder' element={<PlaceOrder />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/cart/:pid' element={<Cart />} />
        <Route path='/:uid/profile' element={<Profile />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/admin/user/:uid/edit' element={<EditUser />} />
        <Route path='/admin/product/:pid/edit' element={<EditProduct />} />
        <Route path='/admin/userslist' element={<UsersList />} />
        <Route path='/admin/productslist' element={<ProductsList />} exact />
        <Route
          path='/admin/productslist/:pageNum'
          element={<ProductsList />}
          exact
        />
        <Route path='/admin/orderslist' element={<OrdersList />} />
        <Route path='/admin/new-product' element={<NewProduct />} exact />
        <Route path='/product/:pid' element={<Product />} />
        <Route path='/search/:keyword' element={<Home />} />
        <Route path='/page/:pageNum' element={<Home />} exact />
        <Route path='/search/:keyword/page/:pageNum' element={<Home />} exact />
        <Route path='/' element={<Home />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path='/cart/:pid' element={<Cart />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:pid' element={<Product />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/search/:keyword' element={<Home />} exact />
        <Route path='/page/:pageNum' element={<Home />} exact />
        <Route path='/search/:keyword/page/:pageNum' element={<Home />} exact />
        <Route path='/' element={<Home />} />
        <Route path='*' element={<Navigate replace to='/' />} />
      </Routes>
    );
  }

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <main>{routes}</main>
        <Footer content='Copyright &copy; ShopMart' />
      </BrowserRouter>
    </>
  );
};

export default App;
