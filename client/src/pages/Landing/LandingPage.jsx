import AboutPage from '../About/AboutPage';
import HomePage from '../Home/HomePage';
import ServicesSection from '../Home/Services/ServicesSection';
import ReviewsSection from '../Reviews/ReviewsSection';

function LandingPage() {
  return (
    <>
      <HomePage />
      <AboutPage />
      <ServicesSection
        limit={4}
        label="Dental Specialities"
        title="Selected treatments and everyday dental care"
      />
      <ReviewsSection
        limit={2}
        label="Patient Trust"
        title="Recent patient feedback and care experience"
      />
    </>
  );
}

export default LandingPage;
