import { useState } from 'react';
import { clinicInfo } from '../../config/clinicInfo';
import servicesData from '../Home/Services/servicesData';
import './ContactPage.css';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function ContactPage() {
  const [formData, setFormData] = useState({
    service: servicesData[0]?.title ?? '',
    date: '',
    time: timeSlots[0],
    name: '',
    phone: '',
    email: '',
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

    const reference = `RDV-${Date.now().toString().slice(-6)}`;

    setConfirmation({
      ...formData,
      reference,
    });
  };

  return (
    <section className="contact-page page-section" id="contact">
      <div className="page-header fade-up">
        <p className="section-tag">Appointment & Contact</p>
        <h1>Book quickly without waiting on the phone</h1>
        <p className="lead">
          Choose a service, pick a date and time, and send the request in a few clicks. The frontend is ready for
          confirmation flows, email reminders, and SMS reminders once the backend is connected.
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
          <i className="fa-solid fa-envelope"></i>
          <h3>Email</h3>
          <p>
            <a href={clinicInfo.emailHref}>{clinicInfo.email}</a>
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
            <h3>Easy appointment request</h3>
            <p>
              This booking flow reduces unnecessary calls and gives the admin a cleaner reservation list inside the
              dashboard.
            </p>
          </div>

          <div className="booking-highlights">
            <span>
              <i className="fa-solid fa-tooth"></i>
              Select service
            </span>
            <span>
              <i className="fa-regular fa-calendar"></i>
              Pick date & time
            </span>
            <span>
              <i className="fa-regular fa-circle-check"></i>
              Confirm request
            </span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label className="field">
            Service
            <select value={formData.service} onChange={handleChange('service')} required>
              {servicesData.map((service) => (
                <option key={service.title} value={service.title}>
                  {service.title} - {service.price}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Date
            <input type="date" value={formData.date} onChange={handleChange('date')} required />
          </label>
          <label className="field">
            Time
            <select value={formData.time} onChange={handleChange('time')} required>
              {timeSlots.map((timeSlot) => (
                <option key={timeSlot} value={timeSlot}>
                  {timeSlot}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Full Name
            <input type="text" value={formData.name} onChange={handleChange('name')} placeholder="Your full name" required />
          </label>
          <label className="field">
            Phone
            <input type="tel" value={formData.phone} onChange={handleChange('phone')} placeholder="+212..." required />
          </label>
          <label className="field">
            Email
            <input type="email" value={formData.email} onChange={handleChange('email')} placeholder="you@example.com" required />
          </label>
          <label className="field field-wide">
            Notes
            <textarea
              rows="4"
              value={formData.message}
              onChange={handleChange('message')}
              placeholder="Tell us what you need or what problem you want to solve"
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
                <i className="fa-regular fa-envelope"></i>
                <strong>Email confirmation</strong>
                <p>Prepared for {confirmation.email} once backend delivery is connected.</p>
              </article>
              <article>
                <i className="fa-solid fa-file-lines"></i>
                <strong>Appointment details</strong>
                <p>
                  {confirmation.service} | {confirmation.date || 'Date pending'} | {confirmation.time}
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
