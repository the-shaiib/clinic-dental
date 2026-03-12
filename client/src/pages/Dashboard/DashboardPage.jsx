import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ADMIN_AUTH_KEY } from '../../config/adminAuth';
import { CONTACT_REQUESTS_KEY, loadContactRequests } from '../../config/contactRequests';
import { loadGalleryItems, saveGalleryItems } from '../../config/galleryItems';
import { loadBeforeAfterCases, saveBeforeAfterCases } from '../../config/beforeAfterCases';
import './DashboardPage.css';

const initialServices = [
  { id: 'S-1', title: 'Cleaning & Prevention', price: 'From 300 MAD', status: 'Live' },
  { id: 'S-2', title: 'Whitening', price: 'From 1200 MAD', status: 'Live' },
  { id: 'S-3', title: 'Implants', price: 'From 6500 MAD', status: 'Hidden' },
];

const statusClassName = (status) => status.toLowerCase().replace(/[^a-z0-9]+/g, '-');

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

function DashboardPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('gallery-upload');
  const [beforeAfterItems, setBeforeAfterItems] = useState(() => loadBeforeAfterCases());
  const [services, setServices] = useState(initialServices);
  const [contactRequests, setContactRequests] = useState(() => loadContactRequests());
  const [galleryItems, setGalleryItems] = useState(() => loadGalleryItems());
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
  const [serviceForm, setServiceForm] = useState({ title: '', price: '' });
  const galleryFileRef = useRef(null);
  const beforeFileRef = useRef(null);
  const afterFileRef = useRef(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showAdminReset, setShowAdminReset] = useState(false);
  const [adminResetStep, setAdminResetStep] = useState('email');
  const [adminResetValues, setAdminResetValues] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [adminResetMessage, setAdminResetMessage] = useState('');
  const [adminResetError, setAdminResetError] = useState('');

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === CONTACT_REQUESTS_KEY) {
        setContactRequests(loadContactRequests());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    navigate('/', { replace: true });
  };

  const handleAddGallery = async (event) => {
    event.preventDefault();
    if (!galleryForm.file) return;

    const title = galleryForm.title.trim();
    const description = galleryForm.description.trim();
    let src = '';
    try {
      src = await readFileAsDataUrl(galleryForm.file);
    } catch (error) {
      return;
    }
    const newItem = {
      id: `G-${Date.now().toString().slice(-6)}`,
      src,
      title,
      description,
    };
    const updatedItems = [newItem, ...galleryItems];
    setGalleryItems(updatedItems);
    saveGalleryItems(updatedItems);

    setGalleryForm({ title: '', description: '', file: null });
    if (galleryFileRef.current) {
      galleryFileRef.current.value = '';
    }
  };

  const handleDeleteGalleryItem = (id) => {
    setGalleryItems((current) => {
      const updated = current.filter((item) => item.id !== id);
      saveGalleryItems(updated);
      return updated;
    });
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
    } catch (error) {
      return;
    }

    const newCase = {
      id: `BA-${Date.now().toString().slice(-6)}`,
      title,
      note,
      beforeImage,
      afterImage,
      createdAt: new Date().toISOString(),
    };

    setBeforeAfterItems((current) => {
      const updated = [newCase, ...current];
      saveBeforeAfterCases(updated);
      return updated;
    });

    setBeforeAfterForm({
      title: '',
      note: '',
      beforeFile: null,
      afterFile: null,
    });
    if (beforeFileRef.current) beforeFileRef.current.value = '';
    if (afterFileRef.current) afterFileRef.current.value = '';
  };

  const handleDeleteBeforeAfter = (id) => {
    setBeforeAfterItems((current) => {
      const updated = current.filter((item) => item.id !== id);
      saveBeforeAfterCases(updated);
      return updated;
    });
  };

  const handleAddService = (event) => {
    event.preventDefault();
    const title = serviceForm.title.trim();
    const price = serviceForm.price.trim();
    if (!title || !price) return;
    setServices((current) => [
      { id: `S-${current.length + 1}`, title, price, status: 'Draft' },
      ...current,
    ]);
    setServiceForm({ title: '', price: '' });
  };

  const handleToggleService = (id) => {
    setServices((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, status: service.status === 'Live' ? 'Hidden' : 'Live' }
          : service
      )
    );
  };

  const handleDeleteService = (id) => {
    setServices((current) => current.filter((service) => service.id !== id));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const resetAdminFlow = () => {
    setAdminResetValues({
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    });
    setAdminResetMessage('');
    setAdminResetError('');
    setAdminResetStep('email');
  };

  const handleAdminResetStart = () => {
    resetAdminFlow();
    setShowAdminReset(true);
  };

  const handleAdminResetCancel = () => {
    resetAdminFlow();
    setShowAdminReset(false);
  };

  const handleAdminResetBack = () => {
    setAdminResetMessage('');
    setAdminResetError('');
    if (adminResetStep === 'code') {
      setAdminResetStep('email');
      return;
    }
    if (adminResetStep === 'password') {
      setAdminResetStep('code');
    }
  };

  const handleAdminResetSubmit = (event) => {
    event.preventDefault();
    setAdminResetError('');

    if (adminResetStep === 'email') {
      const email = adminResetValues.email.trim();
      if (!email) {
        setAdminResetError('Please enter your admin email.');
        return;
      }
      setAdminResetMessage(`We sent a reset code to ${email}.`);
      setAdminResetStep('code');
      return;
    }

    if (adminResetStep === 'code') {
      const code = adminResetValues.code.trim();
      if (!code) {
        setAdminResetError('Please enter the verification code.');
        return;
      }
      setAdminResetMessage('Code verified. Create a new password.');
      setAdminResetStep('password');
      return;
    }

    if (adminResetStep === 'password') {
      const newPassword = adminResetValues.newPassword.trim();
      const confirmPassword = adminResetValues.confirmPassword.trim();
      if (!newPassword || !confirmPassword) {
        setAdminResetError('Please fill in all fields.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setAdminResetError('Passwords do not match.');
        return;
      }
      setAdminResetMessage('Admin password updated successfully.');
      setAdminResetStep('done');
    }
  };

  const adminResetStepIndex = {
    email: 0,
    code: 1,
    password: 2,
    done: 3,
  }[adminResetStep];

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
                onClick={() => setActiveSection('gallery-upload')}
              >
                Add gallery image
              </button>
              <button
                type="button"
                className={activeSection === 'before-after' ? 'active' : ''}
                onClick={() => setActiveSection('before-after')}
              >
                Before / After
              </button>
              <button
                type="button"
                className={activeSection === 'contact-requests' ? 'active' : ''}
                onClick={() => setActiveSection('contact-requests')}
              >
                Contact requests
              </button>
              <button
                type="button"
                className={activeSection === 'services' ? 'active' : ''}
                onClick={() => setActiveSection('services')}
              >
                Services
              </button>
              <button
                type="button"
                className={activeSection === 'change-password' ? 'active' : ''}
                onClick={() => setActiveSection('change-password')}
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
                      <article key={item.id} className="panel-card gallery-card">
                        <div className="gallery-thumb">
                          <img src={item.src} alt={item.title || 'Gallery item'} loading="lazy" />
                        </div>
                        <div className="gallery-info">
                          <strong>{item.title || 'Untitled image'}</strong>
                          {item.description ? <p>{item.description}</p> : <p className="muted">No description.</p>}
                        </div>
                        <div className="card-actions">
                          <div className="mini-actions">
                            <button type="button" className="danger" onClick={() => handleDeleteGalleryItem(item.id)}>
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
                      <article key={item.id} className="panel-card before-after-card">
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
                              onClick={() => handleDeleteBeforeAfter(item.id)}
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
                      <article key={request.id} className="panel-card request-card">
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
                        <small className="request-date">{request.date}</small>
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
                    <p>Add, hide, or delete services.</p>
                  </div>
                </div>
                <form className="panel-form" onSubmit={handleAddService}>
                  <label>
                    Service name
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Root canal"
                      required
                    />
                  </label>
                  <label>
                    Price
                    <input
                      type="text"
                      value={serviceForm.price}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, price: event.target.value }))
                      }
                      placeholder="From 0 MAD"
                      required
                    />
                  </label>
                  <div className="panel-actions">
                    <button type="submit" className="btn btn-primary">
                      Add service
                    </button>
                  </div>
                </form>
                <div className="panel-list">
                  {services.map((service) => (
                    <article key={service.id} className="panel-card">
                      <div>
                        <strong>{service.title}</strong>
                        <p>{service.price}</p>
                      </div>
                      <div className="card-actions">
                        <span className={`status-pill status-${statusClassName(service.status)}`}>
                          {service.status}
                        </span>
                        <div className="mini-actions">
                          <button type="button" onClick={() => handleToggleService(service.id)}>
                            {service.status === 'Live' ? 'Hide' : 'Publish'}
                          </button>
                          <button type="button" className="danger" onClick={() => handleDeleteService(service.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {activeSection === 'change-password' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Change password</h2>
                    <p>Update your admin password.</p>
                  </div>
                </div>
                {!showAdminReset ? (
                  <>
                    <form className="panel-form" onSubmit={handlePasswordSubmit}>
                      <label>
                        Current password
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(event) =>
                            setPasswordForm((current) => ({
                              ...current,
                              currentPassword: event.target.value,
                            }))
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
                            setPasswordForm((current) => ({
                              ...current,
                              newPassword: event.target.value,
                            }))
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
                            setPasswordForm((current) => ({
                              ...current,
                              confirmPassword: event.target.value,
                            }))
                          }
                          placeholder="Confirm new password"
                          required
                        />
                      </label>
                      <div className="panel-actions">
                        <button type="submit" className="btn btn-primary">
                          Save password
                        </button>
                      </div>
                    </form>
                    <p className="panel-helper">
                      Forgot your admin password?{' '}
                      <button type="button" className="panel-link" onClick={handleAdminResetStart}>
                        Reset with email
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <div className="admin-reset-steps" aria-hidden="true">
                      {['Email', 'Verify', 'New password'].map((label, index) => (
                        <span
                          key={label}
                          className={`admin-reset-step ${adminResetStepIndex >= index ? 'active' : ''}`}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                    <form className="panel-form" onSubmit={handleAdminResetSubmit}>
                      {adminResetStep === 'email' && (
                        <label>
                          Admin email
                          <input
                            type="email"
                            value={adminResetValues.email}
                            onChange={(event) => {
                              setAdminResetValues((current) => ({
                                ...current,
                                email: event.target.value,
                              }));
                              setAdminResetError('');
                            }}
                            placeholder="admin@clinic.com"
                            required
                          />
                        </label>
                      )}
                      {adminResetStep === 'code' && (
                        <label>
                          Verification code
                          <input
                            type="text"
                            value={adminResetValues.code}
                            onChange={(event) => {
                              setAdminResetValues((current) => ({
                                ...current,
                                code: event.target.value,
                              }));
                              setAdminResetError('');
                            }}
                            placeholder="Enter the 6-digit code"
                            required
                          />
                        </label>
                      )}
                      {adminResetStep === 'password' && (
                        <>
                          <label>
                            New password
                            <input
                              type="password"
                              value={adminResetValues.newPassword}
                              onChange={(event) => {
                                setAdminResetValues((current) => ({
                                  ...current,
                                  newPassword: event.target.value,
                                }));
                                setAdminResetError('');
                              }}
                              placeholder="Enter a new password"
                              required
                            />
                          </label>
                          <label>
                            Confirm new password
                            <input
                              type="password"
                              value={adminResetValues.confirmPassword}
                              onChange={(event) => {
                                setAdminResetValues((current) => ({
                                  ...current,
                                  confirmPassword: event.target.value,
                                }));
                                setAdminResetError('');
                              }}
                              placeholder="Confirm new password"
                              required
                            />
                          </label>
                        </>
                      )}
                      {adminResetError && <p className="panel-error">{adminResetError}</p>}
                      {adminResetMessage && <p className="panel-message">{adminResetMessage}</p>}
                      <div className="panel-actions admin-reset-actions">
                        {adminResetStep !== 'email' && adminResetStep !== 'done' && (
                          <button type="button" className="btn btn-link" onClick={handleAdminResetBack}>
                            Back
                          </button>
                        )}
                        {adminResetStep === 'done' ? (
                          <button type="button" className="btn btn-primary" onClick={handleAdminResetCancel}>
                            Done
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-primary">
                            {adminResetStep === 'email' && 'Send reset code'}
                            {adminResetStep === 'code' && 'Verify code'}
                            {adminResetStep === 'password' && 'Set new password'}
                          </button>
                        )}
                      </div>
                    </form>
                    <button type="button" className="panel-link" onClick={handleAdminResetCancel}>
                      Back to change password
                    </button>
                  </>
                )}
              </section>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
