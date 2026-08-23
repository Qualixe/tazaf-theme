import { Component } from '@theme/component';
import { RecentlyViewed } from '@theme/recently-viewed-products';
import { sectionRenderer, morphSection } from '@theme/section-renderer';

class RecentlyViewedProduct extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#loadProducts();
  }

  async #loadProducts() {
    const { sectionId, currentProductId } = this.dataset;
    if (!sectionId) return;

    const viewedProducts = RecentlyViewed.getProducts().filter((id) => id !== currentProductId);
    if (viewedProducts.length === 0) return;

    const url = new URL(Theme.routes.search_url, window.location.origin);
    url.searchParams.set('q', viewedProducts.map((/** @type {string} */ id) => `id:${id}`).join(' OR '));
    url.searchParams.set('type', 'product');

    try {
      const html = await sectionRenderer.getSectionHTML(sectionId, false, url);
      await morphSection(sectionId, html, { mode: 'full' });
    } catch (error) {
      console.error('Recently viewed products error:', error);
    }
  }
}

if (!customElements.get('recently-viewed-product')) {
  customElements.define('recently-viewed-product', RecentlyViewedProduct);
}
