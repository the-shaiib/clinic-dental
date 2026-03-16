import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import { createContactRequest } from '../../config/api';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field) => (event) => {
    if (field === 'phone') {
      const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
      setFormData((currentState) => ({
        ...currentState,
        phone: digitsOnly,
      }));
      return;
    }

    setFormData((currentState) => ({
      ...currentState,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !phone || !message || phone.length !== 10) {
      return;
    }

    let savedRequest = null;
    try {
      savedRequest = await createContactRequest({ name, phone, message });
    } catch {
      setErrorMessage('Nous ne pouvons pas envoyer votre demande. Veuillez reessayer.');
      return;
    }

    const reference = `RDV-${Date.now().toString().slice(-6)}`;
    const date = new Date(savedRequest.createdAt || Date.now()).toLocaleDateString('fr-FR', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    setConfirmation({
      name,
      phone,
      message,
      date,
      reference,
    });
    setErrorMessage('');

    setFormData({
      name: '',
      phone: '',
      message: '',
    });
  };

  return (
    <section className="contact-page page-section" id="contact">
      <div className="page-header fade-up">
        <p className="section-tag">Rendez-vous & Contact</p>
        <h1>Prenez rendez-vous rapidement sans attendre au telephone</h1>
        <p className="lead">
          Laissez votre nom, votre numero de telephone, et un court message. Nous vous contacterons pour confirmer votre rendez-vous.
        </p>
      </div>

      <div className="contact-grid fade-up fade-delay-1">
        <article className="info-card">
          <i className="fa-solid fa-phone-volume"></i>
          <h3>Lignes telephoniques</h3>
          <p>
            <a href={clinicInfo.phonePrimaryHref}>{clinicInfo.phonePrimary}</a>
          </p>
          <p>
            <a href={clinicInfo.phoneSecondaryHref}>{clinicInfo.phoneSecondary}</a>
          </p>
        </article>
        <article className="info-card">
          <i className="fa-solid fa-location-dot"></i>
          <h3>Adresse</h3>
          <p>{clinicInfo.address}</p>
        </article>
        <article className="info-card">
          <i className="fa-solid fa-clock"></i>
          <h3>Horaires</h3>
          <p>{clinicInfo.hours}</p>
        </article>
      </div>

      <section className="appointment-panel fade-up fade-delay-2">
        <div className="appointment-intro">
          <div>
            <p className="section-tag">Reservation en ligne</p>
            <h3>Demande de rendez-vous simple</h3>
            <p>
              Un court formulaire qui nous permet de vous joindre rapidement et de confirmer le bon horaire.
            </p>
          </div>

          <div className="booking-highlights">
            <span>
              <i className="fa-regular fa-pen-to-square"></i>
              Ecrivez votre besoin
            </span>
            <span>
              <i className="fa-regular fa-circle-check"></i>
              Confirmation rapide
            </span>
          </div>
        </div>

        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          <label className="field">
            Nom complet
            <input type="text" value={formData.name} onChange={handleChange('name')} placeholder="Votre nom complet" required />
          </label>
          <label className="field">
            Telephone
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="Votre numero de telephone"
              required
            />
          </label>
          <label className="field field-wide">
            Message
            <textarea
              rows="5"
              value={formData.message}
              onChange={handleChange('message')}
              placeholder="Dites-nous votre besoin ou le probleme a traiter"
              required
            ></textarea>
          </label>
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-calendar-check"></i>
            Confirmer le rendez-vous
          </button>
          {confirmation ? (
            <p className="contact-success">Envoye. Merci {confirmation.name}.</p>
          ) : null}
          {errorMessage ? <p className="contact-error">{errorMessage}</p> : null}
        </form>
      </section>

      <section className="contact-map fade-up fade-delay-2">
        <div className="map-head">
          <h3>Localisation de la clinique</h3>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(clinicInfo.mapQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-link"
          >
            <i className="fa-solid fa-map-location-dot"></i>
            Ouvrir dans Maps
          </a>
        </div>

        <div className="map-frame">
          <iframe
            title={clinicInfo.mapTitle}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.8242880793878!2d-8.011868325603135!3d31.638661041290472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafed04882e3a29%3A0xe5af07cf82fc9fdf!2sCabinet%20dentaire%20Dr%20Bijarch%20Latifa!5e0!3m2!1sen!2sma!4v1772744610697!5m2!1sen!2sma"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </section>
  );
}

export default ContactPage;
