import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, productActions } from '../store/product';
import Form from '../UI-components/Form';
import Input from '../UI-components/Input';
import Button from '../UI-components/Button';
import ImageUpload from '../UI-components/ImageUpload';
import './NewProduct.css';

const NewProduct = () => {
  const [name, setName] = useState('');
  const [nameIsValid, setNameIsValid] = useState(false);
  const [brand, setBrand] = useState('');
  const [bransIsValid, setBrandIsValid] = useState(false);
  const [price, setPrice] = useState(0);
  const [priceIsValid, setPriceIsValid] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryIsValid, setCategoryIsValid] = useState(false);
  const [stock, setStock] = useState(0);
  const [stockIsValid, setStockIsValid] = useState(false);
  const [description, setDescription] = useState('');
  const [descriptionIsValid, setDescriptionIsValid] = useState(false);

  const dispatch = useDispatch();
  const { productCreateSuccess } = useSelector((state) => state.product);

  const { token, userId } = useSelector((state) => state.auth);

  const [image, setImage] = useState({ value: null, validity: false });

  const navigate = useNavigate();
  const submitHandler = (event) => {
    event.preventDefault();

    if (token) {
      dispatch(
        createProduct({
          user: userId,
          name,
          brand,
          price,
          category,
          stock,
          image: image.value,
          description,
        })
      );
    }
  };

  useEffect(() => {
    if (productCreateSuccess) {
      dispatch(productActions.resetCreateSuccess());
      navigate('/admin/productslist');
    }
  }, [dispatch, navigate, productCreateSuccess]);

  return (
    <div className='new-product'>
      <Form title='NEW PRODUCT' onSubmit={submitHandler}>
        <Input
          type='text'
          id='name'
          name='name'
          label='Product Name'
          length={6}
          valid={(validity) => setNameIsValid(validity)}
          value={(curr) => setName(curr)}
        />
        <Input
          type='text'
          id='brand'
          name='brand'
          label='Product Brand'
          length={2}
          valid={(validity) => setBrandIsValid(validity)}
          value={(curr) => setBrand(curr)}
        />
        <Input
          type='number'
          id='price'
          name='price'
          label='Price'
          step={0.1}
          floor={0.1}
          valid={(validity) => setPriceIsValid(validity)}
          value={(curr) => setPrice(curr)}
        />
        <Input
          type='text'
          id='category'
          name='category'
          label='Category'
          length={3}
          valid={(validity) => setCategoryIsValid(validity)}
          value={(curr) => setCategory(curr)}
        />
        <Input
          type='number'
          id='stock'
          name='stock'
          label='Stock'
          step={1}
          floor={1}
          valid={(validity) => setStockIsValid(validity)}
          value={(curr) => setStock(curr)}
        />
        <Input
          inputType='textarea'
          id='description'
          name='description'
          label='Description'
          length={15}
          valid={(validity) => setDescriptionIsValid(validity)}
          value={(curr) => setDescription(curr)}
        />
        <ImageUpload
          id='image'
          onInput={(value, validity) => setImage({ value, validity })}
        />
        <Button
          disabled={
            !nameIsValid ||
            !bransIsValid ||
            !priceIsValid ||
            !categoryIsValid ||
            !stockIsValid ||
            !descriptionIsValid ||
            !image.validity
          }
        >
          ADD NEW PRODUCT
        </Button>
      </Form>
    </div>
  );
};

export default NewProduct;
