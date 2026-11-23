import { useEffect, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowUpRight, Check, Mail, LockKeyhole } from './shared';
import { email } from '../data/content';
import { trackEvent } from '../lib/tracking';

export const aiConsultingRoles = [
  'Knowledge Management Specialist',
  'Documentation Manager',
  'Operations Manager',
  'Business Analyst',
  'Pre-Sales Executive',
  'Sales Enablement Manager',
  'Other',
];

export function ContactForm() {
  const [params] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const initialDept = params.get('department') || '';
  const matchedRole = aiConsultingRoles.find(r => r.toLowerCase().includes(initialDept.toLowerCase())) || 'Operations Manager';
  const [department, setDepartment] = useState(initialDept ? matchedRole : 'Operations Manager');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    companyWebsite: '',
    country: '',
    jobTitle: '',
    companySize: '',
    message: '',
    consent: false,
    bot_field: '',
  });

  useEffect(() => {
    if (initialDept) {
      const match = aiConsultingRoles.find(r => r.toLowerCase().includes(initialDept.toLowerCase()));
      if (match) setDepartment(match);
    }
  }, [initialDept]);

  const updateField = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setError('');

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid business email.');
      return;
    }
    if (!formData.company.trim() || formData.company.trim().length < 2) {
      setError('Please enter your company name.');
      return;
    }
    if (!formData.companySize) {
      setError('Please select your company size.');
      return;
    }
    if (formData.message.trim().length < 10) {
      setError('Please describe your automation challenge (at least 10 characters).');
      return;
    }
    if (!formData.consent) {
      setError('Please confirm consent to proceed with your enquiry.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        department,
        consent: true,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string; success?: boolean };
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong. Please check your details and try again.');
      }

      setSuccess(true);
      toast.success('Your enterprise enquiry has been received.');

      trackEvent('generate_lead', {
        department,
        company_size: formData.companySize,
        dedup_id: `${formData.email}_${Date.now()}`,
      });

      // Forward directly to webhook
      try {
        fetch('https://jey.ije.mybluehost.me/webhook/c3e348d2-c233-4d71-b076-b3c57529c961', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            submittedAt: new Date().toISOString(),
            source: 'Flowtivo AI Website Form',
          }),
        }).catch(() => {});
      } catch {
        // Safe fallback
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your enquiry. Please try again or email us.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-form-panel">
      {success ? (
        <div className="form-success" role="status">
          <span><Check size={32} /></span>
          <span className="eyebrow">ENQUIRY RECEIVED</span>
          <h2>Enterprise Discovery<br />Initiated.</h2>
          <p>
            Thank you. Your requirements have been forwarded to our enterprise architecture team. We review each enquiry thoroughly and respond within 1 business day.
          </p>
          <a className="text-link" href={`mailto:${email}`}>
            {email}
            <Mail size={16} />
          </a>
          <button
            className="button button-outline"
            onClick={() => {
              setSuccess(false);
              setFormData({
                name: '', email: '', phone: '', company: '', companyWebsite: '',
                country: '', jobTitle: '', companySize: '', message: '', consent: false, bot_field: '',
              });
            }}
          >
            Submit Another Request
            <ArrowUpRight size={16} />
          </button>
        </div>
      ) : (
        <>
          <span className="micro-label">ENTERPRISE QUALIFICATION</span>
          <h3>Send us a message.</h3>
          <p className="form-description">
            Share details on your automation goals and systems to receive a preliminary architecture evaluation.
          </p>

          <form onSubmit={submit}>
            <div className="form-grid">
              <label>
                Full name <span>*</span>
                <input
                  name="name"
                  autoComplete="name"
                  placeholder="Jane Doe"
                  minLength={2}
                  maxLength={100}
                  value={formData.name}
                  onChange={e => updateField('name', e.target.value)}
                  required
                />
              </label>

              <label>
                Work email <span>*</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="j.doe@enterprise.com"
                  maxLength={254}
                  value={formData.email}
                  onChange={e => updateField('email', e.target.value)}
                  required
                />
              </label>

              <label>
                Company <span>*</span>
                <input
                  name="company"
                  autoComplete="organization"
                  placeholder="Organization name"
                  minLength={2}
                  maxLength={150}
                  value={formData.company}
                  onChange={e => updateField('company', e.target.value)}
                  required
                />
              </label>

              <label>
                Company website
                <input
                  name="companyWebsite"
                  type="text"
                  placeholder="https://example.com"
                  maxLength={255}
                  value={formData.companyWebsite}
                  onChange={e => updateField('companyWebsite', e.target.value)}
                />
              </label>

              <label>
                Job title
                <input
                  name="jobTitle"
                  type="text"
                  placeholder="e.g. VP Operations / Head of IT"
                  maxLength={120}
                  value={formData.jobTitle}
                  onChange={e => updateField('jobTitle', e.target.value)}
                />
              </label>

              <label>
                Country
                <input
                  name="country"
                  type="text"
                  placeholder="United States / UK / UAE / India / etc."
                  maxLength={100}
                  value={formData.country}
                  onChange={e => updateField('country', e.target.value)}
                />
              </label>

              <label>
                Company size <span>*</span>
                <select
                  name="companySize"
                  required
                  value={formData.companySize}
                  onChange={e => updateField('companySize', e.target.value)}
                >
                  <option value="" disabled>Select employee count</option>
                  <option value="10000-49999">10,000–49,999 employees (Enterprise)</option>
                  <option value="50000+">50,000+ employees (Multinational)</option>
                  <option value="5000-9999">5,000–9,999 employees</option>
                  <option value="1000-4999">1,000–4,999 employees</option>
                  <option value="1-999">1–999 employees</option>
                </select>
              </label>

              <label>
                Department of interest <span>*</span>
                <select
                  name="department"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                >
                  {aiConsultingRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="message-label" style={{ marginTop: '16px', display: 'block' }}>
              What would you like to improve or automate? <span>*</span>
              <textarea
                name="message"
                placeholder="Describe your workflows, current tools (Salesforce, SAP, Jira, M365, etc.), challenges, or goals..."
                minLength={10}
                maxLength={4000}
                rows={4}
                value={formData.message}
                onChange={e => updateField('message', e.target.value)}
                required
              />
            </label>

            <div className="honeypot" aria-hidden="true" style={{ display: 'none' }}>
              <label>Leave this empty<input name="bot_field" tabIndex={-1} autoComplete="off" /></label>
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>

            <label className="consent" style={{ marginTop: '16px' }}>
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={e => updateField('consent', e.target.checked)}
                required
              />
              <span>I agree that Flowtivo AI may store these details to evaluate and respond to our enquiry.</span>
            </label>

            {error && (
              <div role="alert" className="form-error">
                {error} <a href={`mailto:${email}`}>Email us instead.</a>
              </div>
            )}

            <div style={{ marginTop: '18px' }}>
              <button
                className="button button-primary submit-button"
                disabled={submitting}
                type="submit"
                style={{ width: '100%' }}
              >
                {submitting ? 'Submitting Enquiry…' : 'Submit Enterprise Request'}
                <ArrowUpRight size={17} />
              </button>
            </div>

            <span className="form-note" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <LockKeyhole size={12} /> Confidentiality guaranteed. We never sell data or use enterprise prompts for public model training.
            </span>
          </form>
        </>
      )}
    </div>
  );
}
