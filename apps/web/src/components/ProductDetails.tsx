import { useState } from "react";
import type { Product } from "../types/product";
import { EnquiryForm } from "./EnquiryForm";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetails({ product, onBack }: ProductDetailsProps) {
  const [showEnquiry, setShowEnquiry] = useState(false);

  return (
    <section className="details">
      <button className="back-link" onClick={onBack}>← Back to collection</button>
      <div className="details-layout">
        <div className="details-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="details-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.title}</h1>
          <p className="details-rating">★ {product.rating.rate.toFixed(1)} · {product.rating.count} reviews</p>
          <p className="details-price">${product.price.toFixed(2)}</p>
          <p className="details-description">{product.description}</p>
          <button className="primary-button" onClick={() => setShowEnquiry(true)}>
            Enquire about this product
          </button>
        </div>
      </div>
      {showEnquiry && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setShowEnquiry(false);
        }}>
          <div className="modal-panel" role="dialog" aria-modal="true" aria-label="Product enquiry">
            <EnquiryForm product={product} onClose={() => setShowEnquiry(false)} />
          </div>
        </div>
      )}
    </section>
  );
}