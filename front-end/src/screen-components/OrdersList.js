import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../store/order';
import Button from '../UI-components/Button';
import LoadingSpinner from '../UI-components/LoadingSpinner';
import Notification from '../UI-components/Notification';
import './OrdersList.css';

const OrdersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className='orders-list'>
      {loading === 'pending' ? (
        <LoadingSpinner asOverlay />
      ) : error ? (
        <Notification message={error.message} alert />
      ) : allOrders && allOrders.length === 0 ? (
        <h2>There are no orders</h2>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => {
              return (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId.name}</td>
                  <td>{order.createdAt.substring(1, 10)}</td>
                  <td>{order.totalAmount.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      <span className='material-symbols-outlined'>
                        done_outline
                      </span>
                    ) : (
                      <span className='material-symbols-outlined'>close</span>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <span className='material-symbols-outlined'>
                        done_outline
                      </span>
                    ) : (
                      <span className='material-symbols-outlined'>close</span>
                    )}
                  </td>
                  <td>
                    <Button onClick={() => navigate(`/order/${order._id}`)}>
                      DETAILS
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersList;
