import mainImage from '../../assets/mainimg.png';
import GallerySection from '../Gallery/GallerySection';
import ReviewsSection from '../Reviews/ReviewsSection';
import AboutPage from './AboutPage';

const clinicGalleryItems = [
  {
    imageUrl: mainImage,
    description: 'A welcoming clinic identity built around calm and confidence.',
    alt: 'Dental clinic front portrait',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80',
    description: 'Professional care moments inside a modern and patient-first setting.',
    alt: 'Dentist inside a modern clinic',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
    description: 'Clean treatment spaces designed for daily appointments and precision.',
    alt: 'Treatment room inside the clinic',
  },
];

function AboutRoutePage() {
  return (
    <>
      <AboutPage />
      <GallerySection
        items={clinicGalleryItems}
        sectionId="clinic-showcase"
        label="Clinic & Doctors"
        title="A closer look at the clinic experience"
      />
      <ReviewsSection
        label="Patient Trust"
        title="What patients say after their visit"
      />
    </>
  );
}

export default AboutRoutePage;
