import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

function SiteLayout() {
  const location = useLocation();

  return (
    <div className="site-shell">
      <Header key={location.pathname} />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SiteLayout;
