import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import './DownDrawer.css';

const DownDrawer = (props) => {
  const nodeRef = useRef(null);
  return (
    <CSSTransition
      in={props.show}
      timeout={1000}
      classNames='slide-in'
      mountOnEnter
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div className='down-drawer' ref={nodeRef}>
        {props.children}
      </div>
    </CSSTransition>
  );
};

export default DownDrawer;
