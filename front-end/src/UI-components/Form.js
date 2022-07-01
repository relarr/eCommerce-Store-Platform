import './Form.css';

const Form = (props) => {
  return (
    <form className='form' onSubmit={props.onSubmit}>
      <h3>{props.title}</h3>
      <>{props.children}</>
    </form>
  );
};

export default Form;
