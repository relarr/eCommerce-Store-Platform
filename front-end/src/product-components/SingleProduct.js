import { Link } from 'react-router-dom';
import Container from '../UI-components/Container';

const SingleProduct = ({ product }) => {
  return (
    <Container>
      <Link to={`/product/${product.id}`}>
        <img
          /*{/*src={`${process.env.REACT_APP_BACKEND_URL}/${product.image}`}*/
          src={product.image}
          alt={product.name}
        />
      </Link>
      <Link to={`/product/${product.id}`}>
        <h3>{product.name}</h3>
      </Link>
      <h3>${product.price}</h3>
    </Container>
  );
};

export default SingleProduct;
