import { Link } from 'react-router-dom';
import './Pages.css';

const Pages = ({ keyword = '', pages, page, isAdmin = false }) => {
  return (
    pages > 1 && (
      <div className='pages'>
        {[...Array(pages).keys()].map((currPage) => (
          <Link
            key={currPage + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${currPage + 1}`
                  : `/page/${currPage + 1}`
                : `/admin/productslist/${currPage + 1}`
            }
          >
            <span className={currPage + 1 === page ? 'curr-active' : ''}>
              {currPage + 1}
            </span>
          </Link>
        ))}
      </div>
    )
  );
};

export default Pages;
