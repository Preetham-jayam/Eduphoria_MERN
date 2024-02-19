import React ,{useState} from 'react'
import { Link } from 'react-router-dom'
import './MainNavbar.css'
import Header from './Header'
import Backdrop from '../../components/FrontendTools/Backdrop'
import NavItems from './NavItems'
import SideOpener from './SideOpener'
import SearchBar from '../../../components/SearchBar/SearchBar'
const MainNavbar = (props) => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };
  return (
    <React.Fragment>
        {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideOpener show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="opener-nav">
          <NavItems />
        </nav>
      </SideOpener>
        <Header>
        <button
          className="hamburger-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="app_name">  
          <Link to='/'>Eduphoria</Link>
        </h1>
        <SearchBar/>
        <nav className='navigation'>
          <div className="nav-container">
              <NavItems />
            </div>
        </nav>
        </Header>
    </React.Fragment>
   
  )
}

export default MainNavbar