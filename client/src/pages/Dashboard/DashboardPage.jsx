import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import {
  createBeforeAfter,
  createGalleryItem as createGalleryItemApi,
  createService as createServiceApi,
  deleteBeforeAfter as deleteBeforeAfterApi,
  deleteGalleryItem as deleteGalleryItemApi,
  deleteService as deleteServiceApi,
  fetchBeforeAfter,
  fetchContactRequests,
  fetchGallery,
  fetchServices,
  changePassword,
} from '../../config/api';
import { clearAuthSession } from '../../config/authStorage';
import './DashboardPage.css';

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

const toWhatsappNumber = (raw) => {
  const digits = String(raw ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) {
    return `212${digits.slice(1)}`;
  }
  return digits;
};

const DASHBOARD_SECTION_KEY = 'clinic_dashboard_section';
const allowedSections = new Set([
  'gallery-upload',
  'before-after',
  'contact-requests',
  'services',
  'change-password',
]);

const serviceIconOptions = [
  { value: 'fa-solid fa-tooth', label: 'Tooth' },
  { value: 'fa-solid fa-shield-heart', label: 'Care shield' },
  { value: 'fa-solid fa-wand-magic-sparkles', label: 'Whitening' },
  { value: 'fa-solid fa-teeth', label: 'Orthodontics' },
  { value: 'fa-solid fa-teeth-open', label: 'Smile care' },
  { value: 'fa-solid fa-toothbrush', label: 'Hygiene' },
  { value: 'fa-solid fa-stethoscope', label: 'Consultation' },
  { value: 'fa-solid fa-syringe', label: 'Treatment' },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return 'gallery-upload';
    const stored = window.localStorage.getItem(DASHBOARD_SECTION_KEY);
    return stored && allowedSections.has(stored) ? stored : 'gallery-upload';
  });
  const [beforeAfterItems, setBeforeAfterItems] = useState([]);
  const [services, setServices] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [beforeAfterForm, setBeforeAfterForm] = useState({
    title: '',
    note: '',
    beforeFile: null,
    afterFile: null,
  });
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    tag: '',
    icon: 'fa-solid fa-tooth',
  });
  const galleryFileRef = useRef(null);
  const beforeFileRef = useRef(null);
  const afterFileRef = useRef(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showAdminReset, setShowAdminReset] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ message: '', error: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gallery, beforeAfter, servicesList, contacts] = await Promise.all([
          fetchGallery(),
          fetchBeforeAfter(),
          fetchServices(),
          fetchContactRequests(),
        ]);
        setGalleryItems(gallery);
        setBeforeAfterItems(beforeAfter);
        setServices(servicesList);
        setContactRequests(contacts);
      } catch {
        // Silent fail: API may not be ready yet.
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DASHBOARD_SECTION_KEY, activeSection);
  }, [activeSection]);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/', { replace: true });
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleAddGallery = async (event) => {
    event.preventDefault();
    if (!galleryForm.file) return;

    const title = galleryForm.title.trim();
    const description = galleryForm.description.trim();
    let src = '';
    try {
      src = await readFileAsDataUrl(galleryForm.file);
    } catch {
      return;
    }
    try {
      const created = await createGalleryItemApi({
        title,
        description,
        image: src,
      });
      setGalleryItems((current) => [created, ...current]);
    } catch {
      return;
    }

    setGalleryForm({ title: '', description: '', file: null });
    if (galleryFileRef.current) {
      galleryFileRef.current.value = '';
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    try {
      await deleteGalleryItemApi(id);
      setGalleryItems((current) => current.filter((item) => item._id !== id));
    } catch {
      return;
    }
  };

  const handleAddBeforeAfter = async (event) => {
    event.preventDefault();
    if (!beforeAfterForm.beforeFile || !beforeAfterForm.afterFile) return;

    const title = beforeAfterForm.title.trim();
    const note = beforeAfterForm.note.trim();
    let beforeImage = '';
    let afterImage = '';
    try {
      [beforeImage, afterImage] = await Promise.all([
        readFileAsDataUrl(beforeAfterForm.beforeFile),
        readFileAsDataUrl(beforeAfterForm.afterFile),
      ]);
    } catch {
      return;
    }

    try {
      const created = await createBeforeAfter({
        title,
        note,
        beforeImage,
        afterImage,
      });
      setBeforeAfterItems((current) => [created, ...current]);
    } catch {
      return;
    }

    setBeforeAfterForm({
      title: '',
      note: '',
      beforeFile: null,
      afterFile: null,
    });
    if (beforeFileRef.current) beforeFileRef.current.value = '';
    if (afterFileRef.current) afterFileRef.current.value = '';
  };

  const handleDeleteBeforeAfter = async (id) => {
    try {
      await deleteBeforeAfterApi(id);
      setBeforeAfterItems((current) => current.filter((item) => item._id !== id));
    } catch {
      return;
    }
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    const title = serviceForm.title.trim();
    const description = serviceForm.description.trim();
    const tag = serviceForm.tag.trim();
    if (!title || !description) return;

    try {
      const created = await createServiceApi({
        title,
        description,
        tag,
        icon: serviceForm.icon,
      });
      setServices((current) => [created, ...current]);
    } catch {
      return;
    }
    setServiceForm({
      title: '',
      description: '',
      tag: '',
      icon: serviceIconOptions[0].value,
    });
  };

  const handleDeleteService = async (id) => {
    try {
      await deleteServiceApi(id);
      setServices((current) => current.filter((service) => service._id !== id));
    } catch {
      return;
    }
  };

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ message: '', error: 'Fill every password field.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: '', error: 'New passwords do not match.' });
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ message: 'Password updated successfully.', error: '' });
    } catch (err) {
      setPasswordStatus({
        message: '',
        error: err.response?.data?.message || 'Unable to change password.',
      });
    }
  };

  return (
    <div className="site-shell dashboard-route">
      <Header />
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <aside className="dashboard-sidebar">
            <div className="sidebar-head">
              <span className="sidebar-title">Admin Panel</span>
              <p className="sidebar-subtitle">Simple control center</p>
            </div>

            <nav className="sidebar-nav">
              <button
                type="button"
                className={activeSection === 'gallery-upload' ? 'active' : ''}
                onClick={() => handleSectionChange('gallery-upload')}
              >
                Add gallery image
              </button>
              <button
                type="button"
                className={activeSection === 'before-after' ? 'active' : ''}
                onClick={() => handleSectionChange('before-after')}
              >
                Before / After
              </button>
              <button
                type="button"
                className={activeSection === 'contact-requests' ? 'active' : ''}
                onClick={() => handleSectionChange('contact-requests')}
              >
                Contact requests
              </button>
              <button
                type="button"
                className={activeSection === 'services' ? 'active' : ''}
                onClick={() => handleSectionChange('services')}
              >
                Services
              </button>
              <button
                type="button"
                className={activeSection === 'change-password' ? 'active' : ''}
                onClick={() => handleSectionChange('change-password')}
              >
                Change password
              </button>
            </nav>

            <div className="sidebar-footer">
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </aside>

          <section className="dashboard-content">
            <header className="content-head">
              <p className="section-tag">Dashboard</p>
              <h1>Clinic admin workspace</h1>
              <p className="content-subtitle">Manage gallery, requests, and services in one place.</p>
            </header>

            {activeSection === 'gallery-upload' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Clinic gallery</h2>
                    <p>Upload clinic imagery that appears on the homepage gallery.</p>
                  </div>
                </div>
                <form className="panel-form panel-form-wide" onSubmit={handleAddGallery}>
                  <label>
                    Image title (optional)
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(event) =>
                        setGalleryForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Reception area"
                    />
                  </label>
                  <label>
                    Internal description (optional)
                    <textarea
                      rows="4"
                      value={galleryForm.description}
                      onChange={(event) =>
                        setGalleryForm((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Short internal note for this image."
                    ></textarea>
                  </label>
                  <div className="upload-grid field-wide">
                    <label className="upload-card">
                      <input
                        type="file"
                        accept="image/*"
                        ref={galleryFileRef}
                        className="upload-input"
                        onChange={(event) =>
                          setGalleryForm((current) => ({
                            ...current,
                            file: event.target.files?.[0] ?? null,
                          }))
                        }
                        required
                      />
                      <span className="upload-icon">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </span>
                      <span className="upload-title">Upload gallery image</span>
                      <span className="upload-subtitle">
                        {galleryForm.file ? galleryForm.file.name : 'Click to choose file'}
                      </span>
                    </label>
                  </div>
                  <div className="panel-actions field-wide">
                    <button type="submit" className="btn btn-primary">
                      Upload image
                    </button>
                  </div>
                </form>
                <div className="panel-list gallery-list">
                  {galleryItems.length === 0 ? (
                    <p className="panel-helper">No gallery images yet.</p>
                  ) : (
                    galleryItems.map((item) => (
                      <article key={item._id} className="panel-card gallery-card">
                        <div className="gallery-thumb">
                          <img src={item.image} alt={item.title || 'Gallery item'} loading="lazy" />
                        </div>
                        <div className="gallery-info">
                          <strong>{item.title || 'Untitled image'}</strong>
                          {item.description ? <p>{item.description}</p> : <p className="muted">No description.</p>}
                        </div>
                        <div className="card-actions">
                          <div className="mini-actions">
                            <button type="button" className="danger" onClick={() => handleDeleteGalleryItem(item._id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeSection === 'before-after' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Before &amp; After cases</h2>
                    <p>Upload both images to showcase real transformations.</p>
                  </div>
                </div>
                <form className="panel-form panel-form-wide" onSubmit={handleAddBeforeAfter}>
                  <label>
                    Case title (optional)
                    <input
                      type="text"
                      value={beforeAfterForm.title}
                      onChange={(event) =>
                        setBeforeAfterForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Whitening case"
                    />
                  </label>
                  <label>
                    Case note (optional)
                    <textarea
                      rows="4"
                      value={beforeAfterForm.note}
                      onChange={(event) =>
                        setBeforeAfterForm((current) => ({ ...current, note: event.target.value }))
                      }
                      placeholder="Short summary of the result."
                    ></textarea>
                  </label>
                  <div className="upload-grid field-wide">
                    <label className="upload-card">
                      <input
                        type="file"
                        accept="image/*"
                        ref={beforeFileRef}
                        className="upload-input"
                        onChange={(event) =>
                          setBeforeAfterForm((current) => ({
                            ...current,
                            beforeFile: event.target.files?.[0] ?? null,
                          }))
                        }
                        required
                      />
                      <span className="upload-icon">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </span>
                      <span className="upload-title">Upload before image</span>
                      <span className="upload-subtitle">
                        {beforeAfterForm.beforeFile ? beforeAfterForm.beforeFile.name : 'Click to choose file'}
                      </span>
                    </label>
                    <label className="upload-card">
                      <input
                        type="file"
                        accept="image/*"
                        ref={afterFileRef}
                        className="upload-input"
                        onChange={(event) =>
                          setBeforeAfterForm((current) => ({
                            ...current,
                            afterFile: event.target.files?.[0] ?? null,
                          }))
                        }
                        required
                      />
                      <span className="upload-icon">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                      </span>
                      <span className="upload-title">Upload after image</span>
                      <span className="upload-subtitle">
                        {beforeAfterForm.afterFile ? beforeAfterForm.afterFile.name : 'Click to choose file'}
                      </span>
                    </label>
                  </div>
                  <div className="panel-actions field-wide">
                    <button type="submit" className="btn btn-primary">
                      Upload case
                    </button>
                  </div>
                </form>
                <div className="panel-list">
                  {beforeAfterItems.length === 0 ? (
                    <p className="panel-helper">No cases yet.</p>
                  ) : (
                    beforeAfterItems.map((item) => (
                      <article key={item._id} className="panel-card before-after-card">
                        <div className="before-after-preview">
                          <img
                            src={item.beforeImage}
                            alt={item.title ? `Before ${item.title}` : 'Before case'}
                            loading="lazy"
                          />
                          <img
                            src={item.afterImage}
                            alt={item.title ? `After ${item.title}` : 'After case'}
                            loading="lazy"
                          />
                        </div>
                        <div className="before-after-info">
                          <strong>{item.title || 'Untitled case'}</strong>
                          {item.note ? <p>{item.note}</p> : <p className="muted">No note added.</p>}
                        </div>
                        <div className="card-actions">
                          <div className="mini-actions">
                            <button
                              type="button"
                              className="danger"
                              onClick={() => handleDeleteBeforeAfter(item._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeSection === 'contact-requests' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Contact requests</h2>
                    <p>Latest messages from the appointment form.</p>
                  </div>
                </div>
                <div className="panel-list">
                  {contactRequests.length === 0 ? (
                    <p className="panel-helper">No contact requests yet.</p>
                  ) : (
                    contactRequests.map((request) => (
                      <article key={request._id} className="panel-card request-card">
                        <div className="request-person">
                          <strong className="request-name">{request.name}</strong>
                          {toWhatsappNumber(request.phone) ? (
                            <a
                              className="request-phone"
                              href={`https://wa.me/${toWhatsappNumber(request.phone)}`}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`WhatsApp ${request.phone}`}
                            >
                              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                              <span>{request.phone}</span>
                            </a>
                          ) : (
                            <span className="request-phone">
                              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
                              <span>{request.phone}</span>
                            </span>
                          )}
                        </div>
                        <p className="request-message">{request.message}</p>
                        <small className="request-date">
                          {request.createdAt
                            ? new Date(request.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                              })
                            : ''}
                        </small>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeSection === 'services' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Services</h2>
                    <p>Control how services appear on the homepage. The button always links to contact.</p>
                  </div>
                </div>
                <form className="panel-form panel-form-wide" onSubmit={handleAddService}>
                  <label>
                    Service title
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Root canal therapy"
                      required
                    />
                  </label>
                  <label>
                    Service description
                    <textarea
                      rows="4"
                      value={serviceForm.description}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Short, clear description of the service."
                      required
                    ></textarea>
                  </label>
                  <label>
                    Service category (optional)
                    <input
                      type="text"
                      value={serviceForm.tag}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, tag: event.target.value }))
                      }
                      placeholder="Esthetique du sourire"
                    />
                  </label>
                  <label>
                    Icon style
                    <div className="icon-picker">
                      {serviceIconOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          title={option.label}
                          aria-label={option.label}
                          className={`icon-choice ${serviceForm.icon === option.value ? 'active' : ''}`}
                          onClick={() =>
                            setServiceForm((current) => ({ ...current, icon: option.value }))
                          }
                        >
                          <i className={option.value}></i>
                        </button>
                      ))}
                    </div>
                  </label>
                  <div className="panel-actions field-wide">
                    <button type="submit" className="btn btn-primary">
                      Add service
                    </button>
                  </div>
                </form>
                <div className="panel-list service-list">
                  {services.length === 0 ? (
                    <p className="panel-helper">No services yet.</p>
                  ) : (
                    services.map((service) => (
                      <article key={service._id} className="panel-card service-card">
                        <div className="service-icon">
                          <i className={service.icon || 'fa-solid fa-tooth'}></i>
                        </div>
                        <div className="service-info">
                          <strong>{service.title}</strong>
                          <p>{service.description}</p>
                          {service.tag ? <span className="service-tag">{service.tag}</span> : null}
                        </div>
                        <div className="card-actions">
                          <div className="mini-actions">
                            <button
                              type="button"
                              className="danger"
                              onClick={() => handleDeleteService(service._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            )}

            {activeSection === 'change-password' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Change password</h2>
                    <p>Keep your admin password in sync with the database.</p>
                  </div>
                </div>
                <form className="panel-form" onSubmit={handleChangePasswordSubmit}>
                  <label>
                    Current password
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                      }
                      placeholder="Enter current password"
                      required
                    />
                  </label>
                  <label>
                    New password
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                      }
                      placeholder="Enter new password"
                      required
                    />
                  </label>
                  <label>
                    Confirm new password
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                      placeholder="Confirm new password"
                      required
                    />
                  </label>
                  {passwordStatus.error && <p className="panel-error">{passwordStatus.error}</p>}
                  {passwordStatus.message && <p className="panel-message">{passwordStatus.message}</p>}
                  <div className="panel-actions">
                    <button type="submit" className="btn btn-primary">
                      Update password
                    </button>
                  </div>
                </form>
              </section>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
