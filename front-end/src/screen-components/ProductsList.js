import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, productActions } from '../store/product';
import Button from '../UI-components/Button';
import Pages from '../UI-components/Pages';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './ProductsList.css';

const ProductsList = () => {
  const dispatch = useDispatch();
  const { products, pages, page, loading, error, productDeleteSuccess } =
    useSelector((state) => state.product);
  const navigate = useNavigate();
  const { pageNum } = useParams();

  useEffect(() => {
    dispatch(fetchProducts({ keyword: '', page: pageNum }));
    if (productDeleteSuccess) dispatch(productActions.resetDeleteSuccess());
  }, [dispatch, productDeleteSuccess, pageNum]);

  const deleteProductHandler = (productId) => {
    dispatch(deleteProduct(productId));
  };

  return (
    <div className='products-list'>
      <div className='add-product-button'>
        <Button onClick={() => navigate('/admin/new-product')}>
          ADD A NEW PRODUCT
        </Button>
      </div>
      {loading === 'pending' ? (
        <LoadingSpinner asOverlay />
      ) : error ? (
        <Notification message={error.message} alert />
      ) : (
        products && (
          <table>
            <thead>
              <tr>
                <th>PRODUCT ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>MANAGE</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                return (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <span
                        className='material-symbols-outlined'
                        onClick={() =>
                          navigate(`/admin/product/${product._id}/edit`)
                        }
                      >
                        edit
                      </span>
                      <span
                        className='material-symbols-outlined'
                        onClick={() => deleteProductHandler(product._id)}
                      >
                        delete_forever
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}
      <Pages pages={pages} page={page} isAdmin={true} />
    </div>
  );
};

export default ProductsList;
