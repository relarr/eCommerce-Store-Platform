import './DropDown.css';

const DropDown = (props) => {
  return (
    <div className='dropdown'>
      <button className='drop-button'>{props.title}</button>
      <div className='dropdown-content'>{props.children}</div>
    </div>
  );
};

export default DropDown;
