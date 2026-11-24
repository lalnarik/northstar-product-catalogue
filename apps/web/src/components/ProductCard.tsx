import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const isTopRated = product.rating.rate >= 4.5;

  return (
    <button
      className="product-card"
      onClick={() => onSelect(product)}
      aria-label={`View ${product.title}, $${product.price.toFixed(2)}`}
    >
      <span className="product-image-wrap">
        {isTopRated && <span className="product-featured-badge">Top rated</span>}
        <img src={product.image} alt={product.title} loading="lazy" />
      </span>

      <span className="product-card-content">
        <span className="product-category">{product.category}</span>
        <span className="product-title">{product.title}</span>
        <span className="product-card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <span className="product-rating" aria-label={`${product.rating.rate.toFixed(1)} out of 5, ${product.rating.count} reviews`}>
            <span className="rating-star">★</span>
            <strong>{product.rating.rate.toFixed(1)}</strong>
            <span className="rating-count">({product.rating.count})</span>
          </span>
        </span>
        <span className="product-card-action">View details <span aria-hidden="true">→</span></span>
      </span>
    </button>
  );
}
