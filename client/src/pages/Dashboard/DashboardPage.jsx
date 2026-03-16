import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import {
  createBeforeAfter,
  createGalleryItem as createGalleryItemApi,
  createService as createServiceApi,
  deleteBeforeAfter as deleteBeforeAfterApi,
  deleteGalleryItem as deleteGalleryItemApi,
  deleteContactRequest as deleteContactRequestApi,
  deleteService as deleteServiceApi,
  fetchBeforeAfter,
  fetchContactRequests,
  fetchGallery,
  fetchServices,
  changePassword,
} from '../../config/api';
import { clearAuthSession } from '../../config/authStorage';
import './DashboardPage.css';

const useConfirmDialog = () => {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Oui, supprimer',
    cancelLabel: 'Annuler',
    onConfirm: null,
  });

  const openConfirm = ({ title, message, confirmLabel, cancelLabel, onConfirm }) => {
    setState({
      isOpen: true,
      title,
      message,
      confirmLabel: confirmLabel || 'Oui, supprimer',
      cancelLabel: cancelLabel || 'Annuler',
      onConfirm,
    });
  };

  const closeConfirm = () => {
    setState((current) => ({ ...current, isOpen: false, onConfirm: null }));
  };

  const handleConfirm = () => {
    if (typeof state.onConfirm === 'function') {
      state.onConfirm();
    }
    closeConfirm();
  };

  return {
    confirmState: state,
    openConfirm,
    closeConfirm,
    handleConfirm,
  };
};

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
  { value: 'fa-solid fa-tooth', label: 'Dent' },
  { value: 'fa-solid fa-shield-heart', label: 'Bouclier soin' },
  { value: 'fa-solid fa-wand-magic-sparkles', label: 'Blanchiment' },
  { value: 'fa-solid fa-teeth', label: 'Orthodontie' },
  { value: 'fa-solid fa-teeth-open', label: 'Soin du sourire' },
  { value: 'fa-solid fa-toothbrush', label: 'Hygiene' },
  { value: 'fa-solid fa-stethoscope', label: 'Consultation' },
  { value: 'fa-solid fa-syringe', label: 'Traitement' },
];

function DashboardPage() {
  const navigate = useNavigate();
  const { confirmState, openConfirm, closeConfirm, handleConfirm } = useConfirmDialog();
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return 'gallery-upload';
    const stored = window.localStorage.getItem(DASHBOARD_SECTION_KEY);
    return stored && allowedSections.has(stored) ? stored : 'gallery-upload';
  });
  const [beforeAfterItems, setBeforeAfterItems] = useState([]);
  const [services, setServices] = useState([]);
  const [contactRequests, setContactRequests] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmedRequestIds, setConfirmedRequestIds] = useState(() => new Set());
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
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const staggerGrid = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DASHBOARD_SECTION_KEY, activeSection);
  }, [activeSection]);

  const handleLogout = () => {
    openConfirm({
      title: 'Confirmer la deconnexion',
      message: 'Voulez-vous vraiment vous deconnecter du tableau de bord admin ?',
      confirmLabel: 'Oui, se deconnecter',
      cancelLabel: 'Annuler',
      onConfirm: () => {
        clearAuthSession();
        navigate('/', { replace: true });
      },
    });
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
    openConfirm({
      title: 'Supprimer l image de la galerie',
      message: 'Cette image sera retiree du site. Etes-vous sur ?',
      confirmLabel: 'Oui, supprimer',
      cancelLabel: 'Annuler',
      onConfirm: async () => {
        try {
          await deleteGalleryItemApi(id);
          setGalleryItems((current) => current.filter((item) => item._id !== id));
        } catch {
          return;
        }
      },
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
    openConfirm({
      title: 'Supprimer un cas avant/apres',
      message: 'Ce cas sera retire du site. Etes-vous sur ?',
      confirmLabel: 'Oui, supprimer',
      cancelLabel: 'Annuler',
      onConfirm: async () => {
        try {
          await deleteBeforeAfterApi(id);
          setBeforeAfterItems((current) => current.filter((item) => item._id !== id));
        } catch {
          return;
        }
      },
    });
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
    openConfirm({
      title: 'Supprimer le service',
      message: 'Ce service sera retire du site. Etes-vous sur ?',
      confirmLabel: 'Oui, supprimer',
      cancelLabel: 'Annuler',
      onConfirm: async () => {
        try {
          await deleteServiceApi(id);
          setServices((current) => current.filter((service) => service._id !== id));
        } catch {
          return;
        }
      },
    });
  };

  const handleConfirmRequest = (id) => {
    openConfirm({
      title: 'Confirmer la demande',
      message: 'Voulez-vous confirmer cette demande de contact ?',
      confirmLabel: 'Oui, confirmer',
      cancelLabel: 'Annuler',
      onConfirm: () => {
        setConfirmedRequestIds((current) => {
          const next = new Set(current);
          next.add(id);
          return next;
        });
      },
    });
  };

  const handleDeleteContactRequest = async (id) => {
    openConfirm({
      title: 'Supprimer la demande',
      message: 'Cette demande sera supprimee. Etes-vous sur ?',
      confirmLabel: 'Oui, supprimer',
      cancelLabel: 'Annuler',
      onConfirm: async () => {
        try {
          await deleteContactRequestApi(id);
          setContactRequests((current) => current.filter((request) => request._id !== id));
        } catch {
          return;
        }
      },
    });
  };

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    const currentPassword = passwordForm.currentPassword.trim();
    const newPassword = passwordForm.newPassword.trim();
    const confirmPassword = passwordForm.confirmPassword.trim();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordStatus({ message: '', error: 'Remplissez tous les champs de mot de passe.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ message: '', error: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStatus({ message: 'Mot de passe mis a jour avec succes.', error: '' });
    } catch (err) {
      setPasswordStatus({
        message: '',
        error: err.response?.data?.message || 'Impossible de changer le mot de passe.',
      });
    }
  };

  return (
    <div className="site-shell dashboard-route">
      <Header />
      <main className="dashboard-page">
        <motion.div
          className="dashboard-shell"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <aside className="dashboard-sidebar">
            <div className="sidebar-head">
              <span className="sidebar-title">Panneau admin</span>
              <p className="sidebar-subtitle">Centre de controle simple</p>
            </div>

            <nav className="sidebar-nav">
              <button
                type="button"
                className={activeSection === 'gallery-upload' ? 'active' : ''}
                onClick={() => handleSectionChange('gallery-upload')}
              >
                Ajouter une image a la galerie
              </button>
              <button
                type="button"
                className={activeSection === 'before-after' ? 'active' : ''}
                onClick={() => handleSectionChange('before-after')}
              >
                Avant / Apres
              </button>
              <button
                type="button"
                className={activeSection === 'contact-requests' ? 'active' : ''}
                onClick={() => handleSectionChange('contact-requests')}
              >
                Demandes de contact
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
                Changer le mot de passe
              </button>
            </nav>

            <div className="sidebar-footer">
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Deconnexion
              </button>
            </div>
          </aside>

          <section className="dashboard-content">
            <header className="content-head">
              <p className="section-tag">Tableau de bord</p>
              <h1>Espace admin de la clinique</h1>
              <p className="content-subtitle">Gerez galerie, demandes et services en un seul endroit.</p>
            </header>

            {activeSection === 'gallery-upload' && (
              <section className="dashboard-panel">
                <div className="panel-head">
                  <div>
                    <h2>Galerie de la clinique</h2>
                    <p>Televersez des images qui apparaissent sur la galerie de la page d accueil.</p>
                  </div>
                </div>
                <form className="panel-form panel-form-wide" onSubmit={handleAddGallery}>
                  <label>
                    Titre de l image (optionnel)
                    <input
                      type="text"
                      value={galleryForm.title}
                      onChange={(event) =>
                        setGalleryForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Espace accueil"
                    />
                  </label>
                  <label>
                    Description interne (optionnel)
                    <textarea
                      rows="4"
                      value={galleryForm.description}
                      onChange={(event) =>
                        setGalleryForm((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Note interne pour cette image."
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
                      <span className="upload-title">Televerser une image de galerie</span>
                      <span className="upload-subtitle">
                        {galleryForm.file ? galleryForm.file.name : 'Cliquez pour choisir un fichier'}
                      </span>
                    </label>
                  </div>
                  <div className="panel-actions field-wide">
                    <button type="submit" className="btn btn-primary">
                      Televerser l image
                    </button>
                  </div>
                </form>
                <div className="panel-list gallery-list">
                  {isLoading ? (
                    <motion.div variants={staggerGrid} initial="hidden" animate="visible">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <motion.article
                          key={`gallery-skeleton-${index}`}
                          className="panel-card gallery-card skeleton-card"
                          variants={staggerItem}
                        >
                          <div className="gallery-thumb">
                            <Skeleton height={80} />
                          </div>
                          <div className="gallery-info">
                            <Skeleton width="60%" />
                            <Skeleton width="80%" />
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>
                  ) : galleryItems.length === 0 ? (
                    <p className="panel-helper">Aucune image pour le moment.</p>
                  ) : (
                    galleryItems.map((item) => (
                      <article key={item._id} className="panel-card gallery-card">
                        <div className="gallery-thumb">
                          <img src={item.image} alt={item.title || 'Element de galerie'} loading="lazy" />
                        </div>
                        <div className="gallery-info">
                          <strong>{item.title || 'Image sans titre'}</strong>
                          {item.description ? <p>{item.description}</p> : <p className="muted">Aucune description.</p>}
                        </div>
                        <div className="card-actions">
                          <div className="mini-actions">
                            <button type="button" className="danger" onClick={() => handleDeleteGalleryItem(item._id)}>
                              Supprimer
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
                    <h2>Cas avant / apres</h2>
                    <p>Televersez les deux images pour montrer des transformations reelles.</p>
                  </div>
                </div>
                <form className="panel-form panel-form-wide" onSubmit={handleAddBeforeAfter}>
                  <label>
                    Titre du cas (optionnel)
                    <input
                      type="text"
                      value={beforeAfterForm.title}
                      onChange={(event) =>
                        setBeforeAfterForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Cas de blanchiment"
                    />
                  </label>
                  <label>
                    Note du cas (optionnel)
                    <textarea
                      rows="4"
                      value={beforeAfterForm.note}
                      onChange={(event) =>
                        setBeforeAfterForm((current) => ({ ...current, note: event.target.value }))
                      }
                      placeholder="Court resume du resultat."
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
                      <span className="upload-title">Televerser image avant</span>
                      <span className="upload-subtitle">
                        {beforeAfterForm.beforeFile ? beforeAfterForm.beforeFile.name : 'Cliquez pour choisir un fichier'}
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
                      <span className="upload-title">Televerser image apres</span>
                      <span className="upload-subtitle">
                        {beforeAfterForm.afterFile ? beforeAfterForm.afterFile.name : 'Cliquez pour choisir un fichier'}
                      </span>
                    </label>
                  </div>
                  <div className="panel-actions field-wide">
                    <button type="submit" className="btn btn-primary">
                      Televerser le cas
                    </button>
                  </div>
                </form>
                <div className="panel-list">
                  {isLoading ? (
                    <motion.div variants={staggerGrid} initial="hidden" animate="visible">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <motion.article
                          key={`before-after-skeleton-${index}`}
                          className="panel-card before-after-card skeleton-card"
                          variants={staggerItem}
                        >
                          <div className="before-after-preview">
                            <Skeleton height={90} />
                            <Skeleton height={90} />
                          </div>
                          <div className="before-after-info">
                            <Skeleton width="55%" />
                            <Skeleton width="75%" />
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>
                  ) : beforeAfterItems.length === 0 ? (
                    <p className="panel-helper">Aucun cas pour le moment.</p>
                  ) : (
                    beforeAfterItems.map((item) => (
                      <article key={item._id} className="panel-card before-after-card">
                        <div className="before-after-preview">
                          <img
                            src={item.beforeImage}
                            alt={item.title ? `Avant ${item.title}` : 'Cas avant'}
                            loading="lazy"
                          />
                          <img
                            src={item.afterImage}
                            alt={item.title ? `Apres ${item.title}` : 'Cas apres'}
                            loading="lazy"
                          />
                        </div>
                        <div className="before-after-info">
                          <strong>{item.title || 'Cas sans titre'}</strong>
                          {item.note ? <p>{item.note}</p> : <p className="muted">Aucune note ajoutee.</p>}
                        </div>
                        <div className="card-actions">
                          <div className="mini-actions">
                            <button
                              type="button"
                              className="danger"
                              onClick={() => handleDeleteBeforeAfter(item._id)}
                            >
                              Supprimer
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
                    <h2>Demandes de contact</h2>
                    <p>Derniers messages du formulaire de rendez-vous.</p>
                  </div>
                </div>
                <div className="panel-list">
                  {isLoading ? (
                    <motion.div variants={staggerGrid} initial="hidden" animate="visible">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <motion.article
                          key={`contact-skeleton-${index}`}
                          className="panel-card request-card skeleton-card"
                          variants={staggerItem}
                        >
                          <div className="request-person">
                            <Skeleton width={120} />
                            <Skeleton width={90} />
                          </div>
                          <Skeleton count={2} />
                          <Skeleton width={80} />
                        </motion.article>
                      ))}
                    </motion.div>
                  ) : contactRequests.length === 0 ? (
                    <p className="panel-helper">Aucune demande pour le moment.</p>
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
                            ? new Date(request.createdAt).toLocaleDateString('fr-FR', {
                                month: 'short',
                                day: '2-digit',
                                year: 'numeric',
                              })
                            : ''}
                        </small>
                        <div className="request-actions mini-actions">
                          <button
                            type="button"
                            onClick={() => handleConfirmRequest(request._id)}
                            disabled={confirmedRequestIds.has(request._id)}
                            className={confirmedRequestIds.has(request._id) ? 'success' : undefined}
                          >
                            {confirmedRequestIds.has(request._id) ? (
                              <>
                                <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                                Confirmee
                              </>
                            ) : (
                              'Confirmer'
                            )}
                          </button>
                          <button
                            type="button"
                            className="danger"
                            onClick={() => handleDeleteContactRequest(request._id)}
                          >
                            Supprimer
                          </button>
                        </div>
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
                    <p>Gerez l affichage des services sur la page d accueil. Le bouton renvoie toujours vers contact.</p>
                  </div>
                </div>
                <form className="panel-form panel-form-wide" onSubmit={handleAddService}>
                  <label>
                    Titre du service
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, title: event.target.value }))
                      }
                      placeholder="Traitement de canal"
                      required
                    />
                  </label>
                  <label>
                    Description du service
                    <textarea
                      rows="4"
                      value={serviceForm.description}
                      onChange={(event) =>
                        setServiceForm((current) => ({ ...current, description: event.target.value }))
                      }
                      placeholder="Description courte et claire du service."
                      required
                    ></textarea>
                  </label>
                  <label>
                    Categorie du service (optionnel)
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
                    Style d icone
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
                      Ajouter le service
                    </button>
                  </div>
                </form>
                <div className="panel-list service-list">
                  {isLoading ? (
                    <motion.div variants={staggerGrid} initial="hidden" animate="visible">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <motion.article
                          key={`service-skeleton-${index}`}
                          className="panel-card service-card skeleton-card"
                          variants={staggerItem}
                        >
                          <div className="service-icon">
                            <Skeleton height={34} width={34} />
                          </div>
                          <div className="service-info">
                            <Skeleton width="60%" />
                            <Skeleton count={2} />
                          </div>
                        </motion.article>
                      ))}
                    </motion.div>
                  ) : services.length === 0 ? (
                    <p className="panel-helper">Aucun service pour le moment.</p>
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
                              Supprimer
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
                    <h2>Changer le mot de passe</h2>
                    <p>Gardez le mot de passe admin synchronise avec la base.</p>
                  </div>
                </div>
                <form className="panel-form" onSubmit={handleChangePasswordSubmit}>
                  <label>
                    Mot de passe actuel
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, currentPassword: event.target.value }))
                      }
                      placeholder="Saisir le mot de passe actuel"
                      required
                    />
                  </label>
                  <label>
                    Nouveau mot de passe
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, newPassword: event.target.value }))
                      }
                      placeholder="Saisir le nouveau mot de passe"
                      required
                    />
                  </label>
                  <label>
                    Confirmer le nouveau mot de passe
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                      placeholder="Confirmer le nouveau mot de passe"
                      required
                    />
                  </label>
                  {passwordStatus.error && <p className="panel-error">{passwordStatus.error}</p>}
                  {passwordStatus.message && <p className="panel-message">{passwordStatus.message}</p>}
                  <div className="panel-actions">
                    <button type="submit" className="btn btn-primary">
                      Mettre a jour le mot de passe
                    </button>
                  </div>
                </form>
              </section>
            )}
          </section>
        </motion.div>
      </main>
      {confirmState.isOpen && typeof document !== 'undefined'
        ? createPortal(
            <div className="confirm-overlay" role="dialog" aria-modal="true">
              <div className="confirm-modal">
                <div className="confirm-head">
                  <h3>{confirmState.title}</h3>
                  <p>{confirmState.message}</p>
                </div>
                <div className="confirm-actions">
                  <button type="button" className="btn btn-link" onClick={closeConfirm}>
                    {confirmState.cancelLabel}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleConfirm}>
                    {confirmState.confirmLabel}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

export default DashboardPage;
