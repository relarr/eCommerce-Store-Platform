import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSingleProduct,
  updateProduct,
  productActions,
} from '../store/product';
import { useParams, useNavigate } from 'react-router-dom';
import Form from '../UI-components/Form';
import ImageUpload from '../UI-components/ImageUpload';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';

const EditProduct = () => {
  const { pid } = useParams();

  const [name, setName] = useState('');
  const [nameInputTouched, setNameInputTouched] = useState(false);
  const [brand, setBrand] = useState('');
  const [brandInputTouched, setBrandInputTouched] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceInputTouched, setPriceInputTouched] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryInputTouched, setCategoryInputTouched] = useState(false);
  const [stock, setStock] = useState(0);
  const [stockInputTouched, setStockInputTouched] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionInputTouched, setDescriptionInputTouched] = useState(false);
  const [image, setImage] = useState({ value: null, validity: false });

  const dispatch = useDispatch();
  const { product, loading, error, productUpdateSuccess } = useSelector(
    (state) => state.product
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (!product || product._id !== pid || productUpdateSuccess) {
      dispatch(getSingleProduct(pid));

      if (productUpdateSuccess) {
        dispatch(productActions.resetUpdateSuccess());
        navigate('/admin/productslist');
      }
    } else {
      setName(product.name);
      setBrand(product.brand);
      setPrice(product.price);
      setCategory(product.category);
      setStock(product.stock);
      setDescription(product.description);
      setImage({ value: product.image, validity: true });
    }
  }, [dispatch, product, pid, productUpdateSuccess, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(
      updateProduct({
        productId: pid,
        name,
        brand,
        price,
        category,
        stock,
        image: image.value,
        description,
      })
    );
  };

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    product && (
      <div className='edit-form'>
        <Form title='Edit Product' onSubmit={submitHandler}>
          <label htmlFor='name'>Product Name</label>
          <input
            className={
              name.length < 3 && nameInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => setNameInputTouched(true)}
          />
          <label htmlFor='brand'>Product Brand</label>
          <input
            className={
              brand.length < 3 && brandInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            onBlur={() => setBrandInputTouched(true)}
          />
          <label htmlFor='price'>Price</label>
          <input
            className={price <= 0 && priceInputTouched ? 'invalid-input' : ''}
            type='number'
            step={0.1}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            onBlur={() => setPriceInputTouched(true)}
          />
          <label htmlFor='category'>Category</label>
          <input
            className={
              category.length < 3 && categoryInputTouched ? 'invalid-input' : ''
            }
            type='text'
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            onBlur={() => setCategoryInputTouched(true)}
          />
          <label htmlFor='stock'>Stock</label>
          <input
            className={stock < 0 && stockInputTouched ? 'invalid-input' : ''}
            type='number'
            step={1}
            value={stock}
            onChange={(event) => setStock(event.target.value)}
            onBlur={() => setStockInputTouched(true)}
          />
          <label htmlFor='description'>Description</label>
          <textarea
            className={
              description.length < 5 && descriptionInputTouched
                ? 'invalid-input'
                : ''
            }
            type='textarea'
            rows={6}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onBlur={() => setDescriptionInputTouched(true)}
          />
          <ImageUpload
            id='image'
            givenImage={product.image}
            onInput={(value, validity) => setImage({ value, validity })}
          />
          <Button>CONTINUE</Button>
        </Form>
      </div>
    )
  );
};

export default EditProduct;
