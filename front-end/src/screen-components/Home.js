import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, productActions } from '../store/product';
import SingleProduct from '../product-components/SingleProduct';
import Pages from '../UI-components/Pages';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const { products, pages, page, loading, error, errorReview } = useSelector(
    (state) => state.product
  );

  const { keyword } = useParams();
  const { pageNum } = useParams() || 1;

  useEffect(() => {
    if (errorReview) dispatch(productActions.resetErrorReview());
    dispatch(fetchProducts({ keyword, page: pageNum }));
  }, [dispatch, keyword, pageNum, errorReview]);

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    products && (
      <div className='home'>
        <div className='products'>
          {products.map((product) => (
            <SingleProduct key={product.id} product={product} />
          ))}
        </div>
        <Pages pages={pages} page={page} keyword={keyword ? keyword : ''} />
      </div>
    )
  );
};

export default Home;
