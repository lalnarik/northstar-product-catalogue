import { useState } from "react";
import type { FormEvent } from "react";
import type { Product } from "../types/product";

interface EnquiryFormProps {
  product: Product;
  onClose: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export function EnquiryForm({ product, onClose }: EnquiryFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name,
          email,
          phone: phone || undefined,
          message: message || undefined
        })
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? "Unable to submit your enquiry.");
      }
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit your enquiry.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="enquiry-success" role="status">
        <span className="success-mark">✓</span>
        <h3>Thank you!</h3>
        <p>Your enquiry for {product.title} has been sent to our sales team.</p>
        <button className="primary-button" onClick={onClose}>Done</button>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit}>
      <div className="form-heading">
        <div>
          <p className="eyebrow">LET'S TALK</p>
          <h3>Enquire about this product</h3>
          <p className="form-product">{product.title}</p>
        </div>
        <button type="button" className="modal-close" aria-label="Close enquiry form" onClick={onClose}>×</button>
      </div>
      <label>
        Your name *
        <input required minLength={2} maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Email address *
        <input required type="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label>
        Phone number
        <input type="tel" maxLength={30} value={phone} onChange={(event) => setPhone(event.target.value)} />
      </label>
      <label>
        Message
        <textarea rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button submit-button" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Send enquiry"}
      </button>
      <p className="form-footnote">Fields marked * are required.</p>
    </form>
  );
}