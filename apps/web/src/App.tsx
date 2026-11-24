import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetails } from "./components/ProductDetails";
import { productApi } from "./services/product-api";
import type { Product } from "./types/product";

type View = "home" | "category" | "search" | "details";

export default function App() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("home");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([productApi.getFeatured(), productApi.getCategories()])
      .then(([featuredProducts, productCategories]) => {
        if (!active) return;
        setFeatured(featuredProducts);
        setCategories(productCategories);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Unable to load catalogue.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const pageTitle = useMemo(() => {
    if (view === "category") return selectedCategory ?? "Category";
    if (view === "search") return `Search results for "${query}"`;
    return "All products";
  }, [view, selectedCategory, query]);

  async function openCategory(category: string) {
    setSelectedCategory(category);
    setSelectedProduct(null);
    setView("category");
    setLoading(true);
    setError(null);
    try {
      setProducts(await productApi.getByCategory(category));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load category.");
    } finally {
      setLoading(false);
    }
  }

  async function searchProducts(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    setView("search");
    setSelectedProduct(null);
    setLoading(true);
    setError(null);
    try {
      setProducts(await productApi.search(term));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  async function selectProduct(product: Product) {
    setLoading(true);
    setError(null);
    try {
      const details = await productApi.getById(product.id);
      setSelectedProduct(details);
      setView("details");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load product.");
    } finally {
      setLoading(false);
    }
  }

  function goHome() {
    setView("home");
    setSelectedProduct(null);
    setSelectedCategory(null);
    setQuery("");
    setError(null);
  }

  return (
    <main className="page">
      <header className="header">
        <button className="brand" onClick={goHome}>northstar<span>.</span></button>
        <form className="header-search" onSubmit={searchProducts} role="search">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search products..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit" aria-label="Submit search">Search</button>
        </form>
      </header>

      <nav className="category-nav" aria-label="Product categories">
        <button className={view === "home" ? "active" : ""} onClick={goHome}>Discover</button>
        {categories.map((category) => (
          <button
            key={category}
            className={view === "category" && selectedCategory === category ? "active" : ""}
            onClick={() => openCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <section className="collection-intro">
        <div>
          <p className="eyebrow">OBJECTS FOR EVERYDAY LIVING</p>
          <h1>Find something worth keeping.</h1>
        </div>
        <p className="intro">A considered collection of products, selected to make everyday moments a little better.</p>
      </section>

      {error && <div className="error-banner" role="alert">{error}</div>}

      {view === "details" && selectedProduct ? (
        <ProductDetails product={selectedProduct} onBack={() => {
          if (selectedCategory) setView("category");
          else setView("home");
          setSelectedProduct(null);
        }} />
      ) : (
        <>
          {view === "home" ? (
            <>
              <section className="section-heading">
                <div>
                  <p className="eyebrow">CURATED FOR YOU</p>
                  <h2>Top rated</h2>
                </div>
                <span className="section-caption">Our five highest-rated finds</span>
              </section>
              {loading ? <div className="loading">Loading collection...</div> :
                <ProductGrid products={featured} onSelect={selectProduct} />}
            </>
          ) : (
            <>
              <section className="section-heading">
                <div>
                  <p className="eyebrow">{view === "search" ? "YOUR SEARCH" : "EXPLORE THE COLLECTION"}</p>
                  <h2>{pageTitle}</h2>
                </div>
                <span className="section-caption">{products.length} products</span>
              </section>
              {loading ? <div className="loading">Loading products...</div> :
                <ProductGrid products={products} onSelect={selectProduct} />}
            </>
          )}
        </>
      )}

      <footer className="footer">NORTHSTAR · A BETTER WAY TO DISCOVER</footer>
    </main>
  );
}