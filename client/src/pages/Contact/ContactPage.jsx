import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import { createContactRequest } from '../../config/api';
import './ContactPage.css';

const issueAdviceMap = {
  'Tooth pain': 'Rinse with warm salt water, avoid very hot or cold foods, and use gentle oral hygiene until your visit.',
  'Broken tooth': 'Keep the area clean, avoid chewing on that side, and store any broken fragment safely if available.',
  'Implant consultation': 'Bring any recent dental X-rays or treatment history so the consultation can stay focused and efficient.',
  'Invisalign or braces': 'Wear your current aligners or retainers as instructed and bring them with you to the appointment.',
  'Teeth whitening': 'Avoid stain-heavy drinks before your visit and let the clinic know if you usually experience sensitivity.',
  'Oral surgery': 'Share your medications and health history in advance so the team can prepare the safest treatment plan.',
  Emergency: 'If you have severe swelling, bleeding, fever, or trauma, call the clinic and come in as soon as possible.',
  'General check-up': 'Brush and floss as usual before your visit and note any sensitivity, bleeding, or discomfort you want to discuss.',
};

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    issue: '',
    preferredSlot: '',
    urgency: 'standard',
    message: '',
  });
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field) => (event) => {
    if (field === 'phone') {
      const digitsOnly = event.target.value.replace(/[^\d+]/g, '').slice(0, 16);
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
    const email = formData.email.trim();
    const issue = formData.issue.trim();
    const preferredSlot = formData.preferredSlot.trim();
    const urgency = formData.urgency.trim();
    const message = formData.message.trim();
    const normalizedPhone = phone.replace(/\D/g, '');

    if (!name || !phone || !email || !issue || normalizedPhone.length < 10) {
      setErrorMessage('Please complete your name, phone, email, and dental issue before sending your request.');
      return;
    }

    let savedRequest = null;
    try {
      savedRequest = await createContactRequest({ name, phone, email, issue, preferredSlot, urgency, message });
    } catch {
      setErrorMessage('We could not send your appointment request. Please try again.');
      return;
    }

    const reference = `RDV-${Date.now().toString().slice(-6)}`;
    const date = new Date(savedRequest.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    const suggestedTimes = preferredSlot
      ? [preferredSlot, ...clinicInfo.availableAppointments.filter((slot) => slot !== preferredSlot).slice(0, 2)]
      : clinicInfo.availableAppointments.slice(0, 3);
    const issueAdvice = issueAdviceMap[issue] || issueAdviceMap['General check-up'];
    const isUrgent = urgency === 'urgent' || issue === 'Emergency';

    setConfirmation({
      name,
      phone,
      email,
      issue,
      message,
      preferredSlot,
      urgency,
      suggestedTimes,
      issueAdvice,
      isUrgent,
      date,
      reference,
    });
    setErrorMessage('');

    setFormData({
      name: '',
      phone: '',
      email: '',
      issue: '',
      preferredSlot: '',
      urgency: 'standard',
      message: '',
    });
  };

  return (
    <section className="contact-page page-section" id="contact">
      <div className="page-header fade-up">
        <p className="section-tag">Appointments and Contact</p>
        <h1>Book an appointment with professional support before you arrive</h1>
        <p className="lead">
          Share your details, tell us your dental concern, and BrightSmile will suggest the best next appointment options.
        </p>
      </div>

      <div className="contact-grid fade-up fade-delay-1">
        <article className="info-card">
          <i className="fa-solid fa-phone-volume"></i>
          <h3>Call the clinic</h3>
          <p>
            <a href={clinicInfo.phonePrimaryHref}>{clinicInfo.phonePrimary}</a>
          </p>
          <p>{clinicInfo.email}</p>
        </article>
        <article className="info-card">
          <i className="fa-solid fa-location-dot"></i>
          <h3>Location</h3>
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
            <p className="section-tag">Assistant booking flow</p>
            <h3>Friendly appointment support for local and international patients</h3>
            <p>
              We collect the essentials, suggest available times, and share simple next-step guidance before your visit.
            </p>
          </div>

          <div className="booking-highlights">
            <span>
              <i className="fa-regular fa-pen-to-square"></i>
              Share your dental issue
            </span>
            <span>
              <i className="fa-regular fa-circle-check"></i>
              Get appointment suggestions
            </span>
            <span>
              <i className="fa-solid fa-triangle-exclamation"></i>
              Urgent cases guided faster
            </span>
          </div>
        </div>

        <form className="contact-form" id="contact-form" onSubmit={handleSubmit}>
          <label className="field">
            Full name
            <input type="text" value={formData.name} onChange={handleChange('name')} placeholder="Your full name" required />
          </label>
          <label className="field">
            Phone number
            <input
              type="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="+1 415 728 5934"
              required
            />
          </label>
          <label className="field">
            Email
            <input type="email" value={formData.email} onChange={handleChange('email')} placeholder="you@example.com" required />
          </label>
          <label className="field">
            Dental issue
            <select value={formData.issue} onChange={handleChange('issue')} required>
              <option value="">Select your dental issue</option>
              <option value="General check-up">General check-up</option>
              <option value="Tooth pain">Tooth pain</option>
              <option value="Broken tooth">Broken tooth</option>
              <option value="Implant consultation">Implant consultation</option>
              <option value="Invisalign or braces">Invisalign or braces</option>
              <option value="Teeth whitening">Teeth whitening</option>
              <option value="Oral surgery">Oral surgery</option>
              <option value="Emergency">Emergency</option>
            </select>
          </label>
          <label className="field">
            Preferred appointment time
            <select value={formData.preferredSlot} onChange={handleChange('preferredSlot')}>
              <option value="">Choose a suggested slot</option>
              {clinicInfo.availableAppointments.map((slot) => (
                <option value={slot} key={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Priority
            <select value={formData.urgency} onChange={handleChange('urgency')}>
              <option value="standard">Standard request</option>
              <option value="urgent">Urgent support needed</option>
            </select>
          </label>
          <label className="field field-wide">
            Symptoms or notes
            <textarea
              rows="5"
              value={formData.message}
              onChange={handleChange('message')}
              placeholder="Tell us about pain, sensitivity, swelling, timing, or any treatment history you want the clinic to know."
            ></textarea>
          </label>
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-calendar-check"></i>
            Send appointment request
          </button>
          {confirmation ? (
            <p className="contact-success">Request sent. Thank you, {confirmation.name}.</p>
          ) : null}
          {errorMessage ? <p className="contact-error">{errorMessage}</p> : null}
        </form>

        {confirmation ? (
          <div className="appointment-confirmation">
            <div className="confirmation-card">
              <div className="confirmation-head">
                <p className="section-tag">Appointment Summary</p>
                <h3>Your request has been prepared for the clinic team</h3>
                <p className="lead">
                  Reference {confirmation.reference} created on {confirmation.date}. BrightSmile will use your details to confirm the best slot.
                </p>
              </div>

              <div className="confirmation-details">
                <span>
                  <i className="fa-solid fa-user"></i>
                  {confirmation.name}
                </span>
                <span>
                  <i className="fa-solid fa-envelope"></i>
                  {confirmation.email}
                </span>
                <span>
                  <i className="fa-solid fa-tooth"></i>
                  {confirmation.issue}
                </span>
              </div>

              <div className="confirmation-message">
                <i className="fa-solid fa-calendar-days"></i>
                <p>Suggested appointment times: {confirmation.suggestedTimes.join(' | ')}</p>
              </div>

              <div className="confirmation-message">
                <i className="fa-solid fa-notes-medical"></i>
                <p>{confirmation.issueAdvice}</p>
              </div>

              {confirmation.isUrgent ? (
                <div className="confirmation-message">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <p>
                    This sounds urgent. Please call <a href={clinicInfo.phonePrimaryHref}>{clinicInfo.phonePrimary}</a> or visit the clinic as soon
                    as possible for immediate support.
                  </p>
                </div>
              ) : null}

              <div className="confirmation-actions">
                <Link className="btn btn-link" to="/">
                  Return to homepage
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="contact-map fade-up fade-delay-2">
        <div className="map-head">
          <h3>Clinic location</h3>
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
            src={clinicInfo.mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </section>
  );
}

export default ContactPage;
