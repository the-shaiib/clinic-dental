import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Seo from '../SEO/Seo';
import WhatsAppWidget from '../WhatsApp/WhatsAppWidget';

function SiteLayout() {
  const location = useLocation();

  return (
    <div className="site-shell">
      <Seo />
      <Header key={location.pathname} />
      <main className="page-main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

export default SiteLayout;
