import { clinicInfo } from '../../config/clinicInfo';
import './WhatsAppWidget.css';

const normalizeWhatsAppNumber = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) return digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) {
    return `212${digits.slice(1)}`;
  }
  return digits;
};

const buildWhatsAppUrl = () => {
  const normalized = normalizeWhatsAppNumber('0611 280 026');
  if (!normalized) return null;

  const message =
    'Bonjour Dr. Bijarch, je souhaiterais reserver un creneau pour une consultation dentaire. Quelles sont vos prochaines disponibilites ? Merci.';
  const encoded = encodeURIComponent(message);

  return `https://wa.me/${normalized}?text=${encoded}`;
};

function WhatsAppWidget() {
  const url = buildWhatsAppUrl();
  if (!url) return null;

  return (
    <a
      className="whatsapp-widget"
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Rendez-vous WhatsApp"
      title="WhatsApp"
      style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 9999 }}
    >
      <span className="whatsapp-ring" aria-hidden="true"></span>
      <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  );
}

export default WhatsAppWidget;
