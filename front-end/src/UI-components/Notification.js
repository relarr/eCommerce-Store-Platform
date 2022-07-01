import './Notification.css';

const Notification = (props) => {
  return (
    <div className={props.alert ? 'notification alert' : 'notification'}>
      {props.message}
    </div>
  );
};

export default Notification;
