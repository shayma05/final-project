// Cart page functionality
class CartPageManager {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  loadCart() {
    const savedCart = localStorage.getItem('maisonCafeCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('maisonCafeCart', JSON.stringify(this.items));
  }

  init() {
    this.renderCart();
  }

  renderCart() {
    if (this.items.length === 0) {
      this.showEmptyCart();
    } else {
      this.showCartWithItems();
    }
  }

  showEmptyCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    
    if (emptyCart) emptyCart.style.display = 'block';
    if (cartWithItems) cartWithItems.style.display = 'none';
  }

  showCartWithItems() {
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartWithItems) cartWithItems.style.display = 'block';
    
    this.renderCartItems();
    this.updateSummary();
  }

  renderCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;

    cartItemsList.innerHTML = this.items.map(item => `
      <div class="cart-item">
        <div class="cart-item-content">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <div class="cart-item-header">
              <div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
              </div>
              <button class="remove-btn" onclick="cartPageManager.removeFromCart(${item.id})">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m3 6 3 18h12l3-18"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
            
            <div class="cart-item-footer">
              <div class="quantity-controls">
                <button class="quantity-btn" onclick="cartPageManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"></path>
                  </svg>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="cartPageManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14m7-7H5"></path>
                  </svg>
                </button>
              </div>
              <div class="item-total">
                ${this.calculateItemTotal(item)} €
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  calculateItemTotal(item) {
    const price = this.parsePrice(item.price);
    return (price * item.quantity).toFixed(2).replace('.', ',');
  }

  parsePrice(priceString) {
    return parseFloat(priceString.replace(',', '.').replace(' €', ''));
  }

  updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
      this.removeFromCart(id);
      return;
    }

    const item = this.items.find(item => item.id === id);
    if (item) {
      item.quantity = newQuantity;
      this.saveCart();
      this.renderCart();
    }
  }

  removeFromCart(id) {
    this.items = this.items.filter(item => item.id !== id);
    this.saveCart();
    this.renderCart();
    this.showToast('Produit retiré du panier');
  }

  clearCart() {
    this.items = [];
    this.saveCart();
    this.renderCart();
    this.showToast('Panier vidé');
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => {
      const price = this.parsePrice(item.price);
      return total + (price * item.quantity);
    }, 0);
  }

  updateSummary() {
    const totalItems = this.getTotalItems();
    const totalPrice = this.getTotalPrice();

    // Update cart title
    const cartTitle = document.getElementById('cartTitle');
    if (cartTitle) {
      cartTitle.textContent = `Votre Panier (${totalItems} article${totalItems > 1 ? 's' : ''})`;
    }

    // Update subtotal
    const subtotalLabel = document.getElementById('subtotalLabel');
    const subtotalAmount = document.getElementById('subtotalAmount');
    if (subtotalLabel && subtotalAmount) {
      subtotalLabel.textContent = `Sous-total (${totalItems} article${totalItems > 1 ? 's' : ''})`;
      subtotalAmount.textContent = `${totalPrice.toFixed(2).replace('.', ',')} €`;
    }

    // Update total
    const totalAmount = document.getElementById('totalAmount');
    if (totalAmount) {
      totalAmount.textContent = `${totalPrice.toFixed(2).replace('.', ',')} €`;
    }
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.innerHTML = `
        <div class="toast-title">Panier mis à jour</div>
        <div class="toast-description">${message}</div>
      `;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }
}

// Global functions
function goHome() {
  window.location.href = 'index.html';
}

function clearCart() {
  if (cartPageManager) {
    cartPageManager.clearCart();
  }
}

function proceedToCheckout() {
  // This would typically integrate with a payment processor
  alert('Fonctionnalité de paiement à implémenter avec votre processeur de paiement préféré.');
}

// Initialize cart page manager
let cartPageManager;

document.addEventListener('DOMContentLoaded', () => {
  cartPageManager = new CartPageManager();
});