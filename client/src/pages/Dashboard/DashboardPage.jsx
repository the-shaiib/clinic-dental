import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ADMIN_AUTH_KEY } from '../../config/adminAuth';
import servicesData from '../Home/Services/servicesData';
import './DashboardPage.css';

const initialAppointments = [
  {
    id: 'RDV-1041',
    patient: 'Salma B.',
    service: 'Cleaning & Prevention',
    schedule: 'Today | 10:00',
    phone: '0611 280 026',
    status: 'Confirmed',
    source: 'Website',
  },
  {
    id: 'RDV-1042',
    patient: 'Yassine A.',
    service: 'Whitening',
    schedule: 'Today | 14:00',
    phone: '0524 431 150',
    status: 'Pending',
    source: 'Website',
  },
  {
    id: 'RDV-1043',
    patient: 'Imane K.',
    service: 'Orthodontics',
    schedule: 'Tomorrow | 11:00',
    phone: '0600 111 222',
    status: 'Pending',
    source: 'WhatsApp',
  },
  {
    id: 'RDV-1044',
    patient: 'Nadia R.',
    service: 'Implants',
    schedule: 'Friday | 16:30',
    phone: '0600 444 555',
    status: 'Cancelled',
    source: 'Phone',
  },
];

const initialPatients = [
  { id: 'P-101', name: 'Salma B.', phone: '0611 280 026', lastVisit: '04 Mar 2026', nextVisit: 'Today | 10:00' },
  { id: 'P-102', name: 'Yassine A.', phone: '0524 431 150', lastVisit: '28 Feb 2026', nextVisit: 'Today | 14:00' },
  { id: 'P-103', name: 'Imane K.', phone: '0600 111 222', lastVisit: '17 Feb 2026', nextVisit: 'Tomorrow | 11:00' },
  { id: 'P-104', name: 'Nadia R.', phone: '0600 444 555', lastVisit: '09 Feb 2026', nextVisit: 'Pending reschedule' },
];

const initialReviews = [
  { id: 'R-1', name: 'Salma B.', rating: 5, status: 'Pending', text: 'Simple booking process and very professional care.' },
  { id: 'R-2', name: 'Yassine A.', rating: 5, status: 'Approved', text: 'Results and clinic photos helped me trust the clinic before booking.' },
  { id: 'R-3', name: 'Nadia R.', rating: 5, status: 'Pending', text: 'Clean clinic, clear explanations, and reassuring follow-up.' },
];

const initialGallery = [
  { id: 'G-1', title: 'Reception Area', group: 'Clinic', status: 'Published' },
  { id: 'G-2', title: 'Treatment Room', group: 'Clinic', status: 'Published' },
  { id: 'G-3', title: 'Before / After Case 01', group: 'Results', status: 'Published' },
  { id: 'G-4', title: 'Doctor Portrait', group: 'Doctors', status: 'Draft' },
];

const initialFeatures = [
  {
    id: 'F-1',
    icon: 'fa-regular fa-envelope',
    title: 'Email reminders',
    description: 'Ready for backend integration after reservation confirmation.',
    status: 'Ready',
  },
  {
    id: 'F-2',
    icon: 'fa-solid fa-comment-dots',
    title: 'Online chat',
    description: 'Frontend slot prepared for quick patient questions and lead capture.',
    status: 'Ready',
  },
  {
    id: 'F-3',
    icon: 'fa-solid fa-mobile-screen-button',
    title: 'SMS reminders',
    description: 'UI flow planned for appointment reminders and confirmations.',
    status: 'Frontend only',
  },
];

const createServiceCatalog = () =>
  servicesData.map((service, index) => ({
    id: `S-${index + 1}`,
    title: service.title,
    price: service.price,
    status: 'Live',
  }));

const statusClassName = (status) => status.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function DashboardPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [patients] = useState(initialPatients);
  const [reviews, setReviews] = useState(initialReviews);
  const [gallery, setGallery] = useState(initialGallery);
  const [serviceCatalog, setServiceCatalog] = useState(createServiceCatalog);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    navigate('/', { replace: true });
  };

  const handleAppointmentStatus = (id, nextStatus) => {
    setAppointments((currentState) =>
      currentState.map((appointment) =>
        appointment.id === id ? { ...appointment, status: nextStatus } : appointment
      )
    );
  };

  const handleDeleteAppointment = (id) => {
    setAppointments((currentState) => currentState.filter((appointment) => appointment.id !== id));
  };

  const handleReviewStatus = (id, nextStatus) => {
    setReviews((currentState) =>
      currentState.map((review) => (review.id === id ? { ...review, status: nextStatus } : review))
    );
  };

  const handleDeleteReview = (id) => {
    setReviews((currentState) => currentState.filter((review) => review.id !== id));
  };

  const handleDeleteGalleryItem = (id) => {
    setGallery((currentState) => currentState.filter((item) => item.id !== id));
  };

  const handleAddGalleryItem = () => {
    setGallery((currentState) => [
      {
        id: `G-${currentState.length + 1}`,
        title: 'New clinic photo draft',
        group: 'Clinic',
        status: 'Draft',
      },
      ...currentState,
    ]);
  };

  const handleToggleServiceStatus = (id) => {
    setServiceCatalog((currentState) =>
      currentState.map((service) =>
        service.id === id
          ? { ...service, status: service.status === 'Live' ? 'Hidden' : 'Live' }
          : service
      )
    );
  };

  const handleDeleteService = (id) => {
    setServiceCatalog((currentState) => currentState.filter((service) => service.id !== id));
  };

  const handleAddService = () => {
    setServiceCatalog((currentState) => [
      {
        id: `S-${currentState.length + 1}`,
        title: 'New service draft',
        price: 'From 0 MAD',
        status: 'Draft',
      },
      ...currentState,
    ]);
  };

  const todayAppointments = appointments.filter((appointment) => appointment.schedule.startsWith('Today')).length;
  const pendingReviews = reviews.filter((review) => review.status === 'Pending').length;

  return (
    <div className="site-shell dashboard-route">
      <Header />
      <main className="dashboard-page">
        <section className="dashboard-shell fade-up">
          <div className="dashboard-top">
            <div>
              <p className="section-tag">Admin Dashboard</p>
              <h1>Clinic command center</h1>
              <p className="dashboard-subtitle">
                Frontend workspace for reservations, patients, reviews, gallery, services, and reminder readiness.
              </p>
            </div>

            <div className="dashboard-top-actions">
              <span className="dashboard-chip">
                <i className="fa-solid fa-layer-group"></i>
                Frontend preview
              </span>
              <button className="btn btn-link" type="button" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </div>
          </div>

          <div className="dashboard-metrics">
            <article className="dashboard-card">
              <p>Total Appointments</p>
              <strong>{appointments.length}</strong>
            </article>
            <article className="dashboard-card">
              <p>Today Appointments</p>
              <strong>{todayAppointments}</strong>
            </article>
            <article className="dashboard-card">
              <p>Total Patients</p>
              <strong>{patients.length}</strong>
            </article>
            <article className="dashboard-card">
              <p>Pending Reviews</p>
              <strong>{pendingReviews}</strong>
            </article>
            <article className="dashboard-card">
              <p>Gallery Assets</p>
              <strong>{gallery.length}</strong>
            </article>
            <article className="dashboard-card">
              <p>Services</p>
              <strong>{serviceCatalog.length}</strong>
            </article>
          </div>

          <div className="dashboard-layout">
            <section className="dashboard-panel dashboard-panel-wide">
              <div className="panel-head">
                <div>
                  <h2>Appointments</h2>
                  <p>Confirm, cancel, or delete reservations from the website and phone channels.</p>
                </div>
              </div>

              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Patient</th>
                      <th>Service</th>
                      <th>Schedule</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>
                          <strong>{appointment.patient}</strong>
                          <span>{appointment.phone}</span>
                        </td>
                        <td>{appointment.service}</td>
                        <td>{appointment.schedule}</td>
                        <td>{appointment.source}</td>
                        <td>
                          <span className={`status-pill status-${statusClassName(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button type="button" onClick={() => handleAppointmentStatus(appointment.id, 'Confirmed')}>
                              Confirm
                            </button>
                            <button type="button" onClick={() => handleAppointmentStatus(appointment.id, 'Cancelled')}>
                              Cancel
                            </button>
                            <button type="button" onClick={() => handleDeleteAppointment(appointment.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h2>Automation</h2>
                  <p>Extra pro features prepared in the frontend experience.</p>
                </div>
              </div>

              <div className="dashboard-stack">
                {initialFeatures.map((feature) => (
                  <article key={feature.id} className="feature-card">
                    <div className="feature-icon">
                      <i className={feature.icon}></i>
                    </div>
                    <div>
                      <strong>{feature.title}</strong>
                      <p>{feature.description}</p>
                    </div>
                    <span className={`status-pill status-${statusClassName(feature.status)}`}>{feature.status}</span>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h2>Patients</h2>
                  <p>Clean list of clients with last and next visit details.</p>
                </div>
              </div>

              <div className="dashboard-stack">
                {patients.map((patient) => (
                  <article key={patient.id} className="data-card">
                    <div>
                      <strong>{patient.name}</strong>
                      <p>{patient.phone}</p>
                    </div>
                    <div className="data-card-meta">
                      <span>Last: {patient.lastVisit}</span>
                      <span>Next: {patient.nextVisit}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h2>Reviews</h2>
                  <p>Approve or delete testimonials before they go live.</p>
                </div>
              </div>

              <div className="dashboard-stack">
                {reviews.map((review) => (
                  <article key={review.id} className="data-card">
                    <div>
                      <strong>{review.name}</strong>
                      <p>{review.text}</p>
                    </div>
                    <div className="data-card-actions">
                      <span className={`status-pill status-${statusClassName(review.status)}`}>{review.status}</span>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleReviewStatus(review.id, 'Approved')}>
                          Approve
                        </button>
                        <button type="button" onClick={() => handleDeleteReview(review.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h2>Gallery</h2>
                  <p>Add or remove clinic, doctor, and before/after images.</p>
                </div>
                <button type="button" className="panel-button" onClick={handleAddGalleryItem}>
                  <i className="fa-solid fa-plus"></i>
                  Add Photo
                </button>
              </div>

              <div className="dashboard-stack">
                {gallery.map((item) => (
                  <article key={item.id} className="data-card">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.group}</p>
                    </div>
                    <div className="data-card-actions">
                      <span className={`status-pill status-${statusClassName(item.status)}`}>{item.status}</span>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleDeleteGalleryItem(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-panel">
              <div className="panel-head">
                <div>
                  <h2>Services</h2>
                  <p>Add, hide, or remove services and price cards.</p>
                </div>
                <button type="button" className="panel-button" onClick={handleAddService}>
                  <i className="fa-solid fa-plus"></i>
                  Add Service
                </button>
              </div>

              <div className="dashboard-stack">
                {serviceCatalog.map((service) => (
                  <article key={service.id} className="data-card">
                    <div>
                      <strong>{service.title}</strong>
                      <p>{service.price}</p>
                    </div>
                    <div className="data-card-actions">
                      <span className={`status-pill status-${statusClassName(service.status)}`}>{service.status}</span>
                      <div className="table-actions">
                        <button type="button" onClick={() => handleToggleServiceStatus(service.id)}>
                          {service.status === 'Live' ? 'Hide' : 'Publish'}
                        </button>
                        <button type="button" onClick={() => handleDeleteService(service.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
