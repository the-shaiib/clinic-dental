import { clinicInfo } from '../../config/clinicInfo';
import './WhatsAppWidget.css';

const normalizeWhatsAppNumber = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('00')) return digits.slice(2);
  return digits;
};

const buildWhatsAppUrl = () => {
  const normalized = normalizeWhatsAppNumber(clinicInfo.whatsappNumber || clinicInfo.phonePrimary);
  if (!normalized) return null;

  const message =
    'Hello Dr. Morgan, I would like to book a dental consultation. Could you please share your next available appointment times?';
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
      aria-label="WhatsApp appointment support"
      title="WhatsApp"
      style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 9999 }}
    >
      <span className="whatsapp-ring" aria-hidden="true"></span>
      <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
    </a>
  );
}

export default WhatsAppWidget;
