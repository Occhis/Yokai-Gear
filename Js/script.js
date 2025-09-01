// Este archivo solo se encarga de crear y mostrar los productos en la página

async function fetchProducts() {
  const productGrid = document.querySelector('.product-grid');
  const url = "https://fakestoreapi.com/products?limit=20";

  try {
    const response = await fetch(url);
    const products = await response.json();

    products.forEach(product => {
      const productCard = document.createElement('article');
      productCard.classList.add('product-card');

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <span>$${product.price}</span>
        <button class="add-to-cart">Comprar</button>
      `;

      productGrid.appendChild(productCard);
    });

    // Código del IntersectionObserver para la animación
    const cardElements = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    cardElements.forEach(card => {
      observer.observe(card);
    });

  } catch (error) {
    console.error("Error al cargar los productos:", error);
  }
}

fetchProducts();