import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import {
  deleteContactRequest as deleteContactRequestApi,
  fetchContactRequests,
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
  return digits;
};

const DASHBOARD_SECTION_KEY = 'clinic_dashboard_section';
const allowedSections = new Set([
  'contact-requests',
  'change-password',
]);

function DashboardPage() {
  const navigate = useNavigate();
  const { confirmState, openConfirm, closeConfirm, handleConfirm } = useConfirmDialog();
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return 'contact-requests';
    const stored = window.localStorage.getItem(DASHBOARD_SECTION_KEY);
    return stored && allowedSections.has(stored) ? stored : 'contact-requests';
  });
  const [contactRequests, setContactRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmedRequestIds, setConfirmedRequestIds] = useState(() => new Set());
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordStatus, setPasswordStatus] = useState({ message: '', error: '' });

  useEffect(() => {
    const loadData = async () => {
      try {
        const contacts = await fetchContactRequests();
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
                className={activeSection === 'contact-requests' ? 'active' : ''}
                onClick={() => handleSectionChange('contact-requests')}
              >
                Demandes de contact
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
              <h1>Demandes de contact</h1>
              <p className="content-subtitle">Suivez et gerez les messages recus depuis le formulaire.</p>
            </header>

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
                        {request.email ? <p className="request-message">{request.email}</p> : null}
                        {request.issue ? (
                          <p className="request-message">
                            <strong>Issue:</strong> {request.issue}
                          </p>
                        ) : null}
                        {request.preferredSlot ? (
                          <p className="request-message">
                            <strong>Preferred time:</strong> {request.preferredSlot}
                          </p>
                        ) : null}
                        {request.urgency ? (
                          <p className="request-message">
                            <strong>Priority:</strong> {request.urgency}
                          </p>
                        ) : null}
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
