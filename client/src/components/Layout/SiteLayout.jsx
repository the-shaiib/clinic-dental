import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="page-main"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
}

export default SiteLayout;
