// Cart functionality
class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.updateCartUI();
  }

  loadCart() {
    const savedCart = localStorage.getItem('maisonCafeCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  saveCart() {
    localStorage.setItem('maisonCafeCart', JSON.stringify(this.items));
  }

  addToCart(product) {
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    
    this.saveCart();
    this.updateCartUI();
    this.showToast(`${product.name} ajouté au panier`);
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = this.getTotalItems();
    
    if (cartCount) {
      cartCount.textContent = totalItems;
      cartCount.classList.toggle('hidden', totalItems === 0);
    }
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.innerHTML = `
        <div class="toast-title">Produit ajouté au panier</div>
        <div class="toast-description">${message}</div>
      `;
      toast.classList.add('show');
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }
}


const cartManager = new CartManager();

const products = [
  {
    id: 1,
    name: "Cafés filtres",
    description: "Le Noir, l’Aroma ou le Fifty, des cafés qui offrent un moment de plaisir intense lors de la dégustation.",
    image: "",
    price: "€"
  },
  {
    id: 2,
    name: "Cafés 100% Arabica",
    description: "Découvrez la meilleure sélection de café 100% faite par les experts BONDIN issu des meilleures origines du monde.",
    image: "",
    price: "€"
  },
  {
    id: 3,
    name: "Cafés turcs",
    description: "Le café turc classique se distingue par sa torréfaction poussée et sa mouture fine. Le café turc mélangé est quant à lui tempéré par la saveur de l’orge, il est faible en caféine.",
    image: "",
    price: "€"
  },
  {
    id: 4,
    name: "Cafés en grains",
    description: "BONDIN vous offre la possibilité de moudre vous même votre café, et ainsi déguster un café aromatisé et intense en goût.",
    image: "",
    price: "€"
  },
  {
    id: 5,
    name: "Cafés solubles",
    description: "Un café facile à préparer, bien adapté pour un petit déjeuner rapide. Découvrez la légèreté et la saveur d’un café 100% Brésilien.",
    image: "",
    price: "€"
  },
  {
    id: 6,
    name: "Cafés pour les professionnels",
    description: "La gamme professionnelle avec des contenances adaptées et une grande variété est aussi disponible pour satisfaire tous les besoins.",
    image: "",
    price: "€"
  }
];

// Add to cart function
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cartManager.addToCart(product);
    // Navigate to cart after adding
    setTimeout(() => {
      goToCart();
    }, 1000);
  }
}

// Navigation functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
}

function goToCart() {
  window.location.href = 'cart.html';
}

function goHome() {
  window.location.href = 'index.html';
}

// Contact form handling
function handleContactForm() {
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Simulate form submission
      cartManager.showToast('Message envoyé avec succès!');
      form.reset();
    });
  }
}

// Smooth scrolling for navigation links
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

// Scroll Reveal on scroll
function initializeScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      } else {
        entry.target.classList.remove('animated'); // Optional: animate out when not in view
      }
    });
  }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

  document.querySelectorAll('.scroll-reveal').forEach((element) => {
    observer.observe(element);
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeNavigation();
  handleContactForm();
  initializeScrollReveal();
});