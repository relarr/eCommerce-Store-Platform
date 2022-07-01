import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getSingleProduct,
  createReview,
  productActions,
} from '../store/product';
import AddToCart from '../UI-components/AddToCart';
import RatingStars from '../UI-components/RatingStars';
import Form from '../UI-components/Form';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './Product.css';

const Product = () => {
  const [rating, setRating] = useState(-1);
  const [comment, setComment] = useState('');
  const [commentInputTouched, setCommentInputTouched] = useState(false);

  const dispatch = useDispatch();
  const {
    product,
    loading,
    error,
    loadingReview,
    errorReview,
    reviewCreateSuccess,
  } = useSelector((state) => state.product);
  const { token } = useSelector((state) => state.auth);
  const { pid } = useParams();

  useEffect(() => {
    dispatch(getSingleProduct(pid));
    if (reviewCreateSuccess) dispatch(productActions.resetReviewSuccess());
  }, [dispatch, pid, reviewCreateSuccess]);

  const submitReviewHandler = (event) => {
    event.preventDefault();
    dispatch(createReview({ productId: pid, review: { rating, comment } }));
    setRating(-1);
    setComment('');
    setCommentInputTouched(false);
  };

  return loading === 'pending' ? (
    <LoadingSpinner asOverlay />
  ) : error ? (
    <Notification message={error.message} alert />
  ) : (
    product &&
    product && (
      <div className='product'>
        <div className='product-info'>
          <div className='images'>
            <img src={product.image} alt={product.name} />
          </div>
          <div className='description'>
            <h2>{product.name}</h2>
            <RatingStars rate={product.rating - 1} disabled />
            <p>{product.numReviews} reviews</p>
            <h4>${product.price}</h4>
            <p>{product.description}</p>
            <AddToCart
              stock={[...Array(product.stock + 1).keys()]}
              productId={product.id}
            />
          </div>
        </div>
        <div className='reviews'>
          <h3>
            {product.reviews.length > 0 ? 'CUSTOMER REVIEWS' : 'NO REVIEWS YET'}
          </h3>
          {product.reviews.map((review) => (
            <div key={review._id} className='review'>
              <p>{review.name}</p>
              <RatingStars rate={review.rating - 1} disabled />
              <p>{review.comment}</p>
              <p>{review.createdAt.substring(0, 10)}</p>
            </div>
          ))}

          {token &&
            (loadingReview === 'pending' ? (
              <LoadingSpinner asOverlay />
            ) : errorReview ? (
              <Notification message={errorReview.message} alert />
            ) : (
              <Form title='Leave a review' onSubmit={submitReviewHandler}>
                <RatingStars onInput={(i) => setRating(i + 1)} rate={-1} />
                <label htmlFor='comment'>Your Comment</label>
                <textarea
                  className={
                    comment.length < 3 && commentInputTouched
                      ? 'invalid-input'
                      : ''
                  }
                  type='textarea'
                  rows={4}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  onBlur={() => setCommentInputTouched(true)}
                />
                <Button disabled={rating < 0 || comment.length < 3}>
                  SUBMIT
                </Button>
              </Form>
            ))}
        </div>
      </div>
    )
  );
};

export default Product;
