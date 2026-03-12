import { useState } from 'react';
import { clinicInfo } from '../../config/clinicInfo';
import { loadContactRequests, saveContactRequests } from '../../config/contactRequests';
import './ContactPage.css';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [confirmation, setConfirmation] = useState(null);

  const handleChange = (field) => (event) => {
    setFormData((currentState) => ({
      ...currentState,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !phone || !message) {
      return;
    }

    const reference = `RDV-${Date.now().toString().slice(-6)}`;
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const newRequest = {
      id: `C-${Date.now().toString().slice(-6)}`,
      name,
      phone,
      message,
      date,
    };

    const updatedRequests = [newRequest, ...loadContactRequests()];
    saveContactRequests(updatedRequests);

    setConfirmation({
      ...newRequest,
      reference,
    });

    setFormData({
      name: '',
      phone: '',
      message: '',
    });
  };

  return (
    <section className="contact-page page-section" id="contact">
      <div className="page-header fade-up">
        <p className="section-tag">Appointment & Contact</p>
        <h1>Book quickly without waiting on the phone</h1>
        <p className="lead">
          Leave your name, phone number, and a short message. We will contact you to confirm your appointment.
        </p>
      </div>

      <div className="contact-grid fade-up fade-delay-1">
        <article className="info-card">
          <i className="fa-solid fa-phone-volume"></i>
          <h3>Phone Lines</h3>
          <p>
            <a href={clinicInfo.phonePrimaryHref}>{clinicInfo.phonePrimary}</a>
          </p>
          <p>
            <a href={clinicInfo.phoneSecondaryHref}>{clinicInfo.phoneSecondary}</a>
          </p>
        </article>
        <article className="info-card">
          <i className="fa-solid fa-location-dot"></i>
          <h3>Address</h3>
          <p>{clinicInfo.address}</p>
        </article>
        <article className="info-card">
          <i className="fa-solid fa-clock"></i>
          <h3>Hours</h3>
          <p>{clinicInfo.hours}</p>
        </article>
      </div>

      <section className="appointment-panel fade-up fade-delay-2">
        <div className="appointment-intro">
          <div>
            <p className="section-tag">Online Booking</p>
            <h3>Simple appointment request</h3>
            <p>
              A short form that lets us reach you quickly and confirm the right time.
            </p>
          </div>

          <div className="booking-highlights">
            <span>
              <i className="fa-regular fa-pen-to-square"></i>
              Write your need
            </span>
            <span>
              <i className="fa-regular fa-circle-check"></i>
              We confirm fast
            </span>
          </div>
        </div>

        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          <label className="field">
            Full Name
            <input type="text" value={formData.name} onChange={handleChange('name')} placeholder="Your full name" required />
          </label>
          <label className="field">
            Phone
            <input type="tel" value={formData.phone} onChange={handleChange('phone')} placeholder="+212..." required />
          </label>
          <label className="field field-wide">
            Message
            <textarea
              rows="5"
              value={formData.message}
              onChange={handleChange('message')}
              placeholder="Tell us what you need or the problem you want to solve"
              required
            ></textarea>
          </label>
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-calendar-check"></i>
            Confirm Appointment
          </button>
        </form>

        {confirmation ? (
          <aside className="appointment-confirmation fade-up" aria-live="polite">
            <div className="confirmation-head">
              <p className="section-tag">Confirmation</p>
              <h3>Appointment request recorded</h3>
            </div>

            <div className="confirmation-grid">
              <article>
                <i className="fa-regular fa-circle-check"></i>
                <strong>Confirmation message</strong>
                <p>Your request has been captured in the frontend booking flow.</p>
              </article>
              <article>
                <i className="fa-solid fa-file-lines"></i>
                <strong>Message received</strong>
                <p>
                  {confirmation.message || 'We will follow up to confirm details.'}
                </p>
              </article>
            </div>

            <div className="confirmation-summary">
              <span>
                <i className="fa-solid fa-hashtag"></i>
                {confirmation.reference}
              </span>
              <span>
                <i className="fa-solid fa-user"></i>
                {confirmation.name}
              </span>
              <span>
                <i className="fa-solid fa-phone"></i>
                {confirmation.phone}
              </span>
            </div>
          </aside>
        ) : null}
      </section>

      <section className="contact-map fade-up fade-delay-2">
        <div className="map-head">
          <h3>Clinic Location</h3>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(clinicInfo.mapQuery)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-link"
          >
            <i className="fa-solid fa-map-location-dot"></i>
            Open in Maps
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
