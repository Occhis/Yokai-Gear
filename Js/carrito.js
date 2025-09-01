// Este archivo se encarga de la lógica del carrito de compras

// Array que guardará los productos que el usuario agregue al carrito
let carrito = [];

// Función para obtener los productos del localStorage al cargar la página
function obtenerCarrito() {
    const carritoJSON = localStorage.getItem('carrito');
    if (carritoJSON) {
        carrito = JSON.parse(carritoJSON);
    }
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para renderizar los productos en el HTML del carrito
function renderizarCarrito() {
    const carritoItemsContainer = document.querySelector('.cart-items-container');
    const cartCountSpan = document.querySelector('.cart-count');
    const totalPriceSpan = document.querySelector('#total-price');

    if (!carritoItemsContainer || !cartCountSpan || !totalPriceSpan) {
        console.error("No se encontraron los elementos del carrito en el DOM.");
        return;
    }

    carritoItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
        carritoItemsContainer.innerHTML = '<p class="empty-cart-message">El carrito está vacío.</p>';
    } else {
        carrito.forEach(producto => {
            const itemCarrito = document.createElement('div');
            itemCarrito.classList.add('item-carrito', 'd-flex', 'align-items-center', 'py-2', 'border-bottom');
            itemCarrito.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}" class="img-fluid me-3" style="width: 60px;">
                <div class="info-item flex-grow-1">
                    <h6>${producto.titulo}</h6>
                    <p class="mb-0">Cantidad: ${producto.cantidad}</p>
                    <p class="mb-0 fw-bold">Precio: $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                </div>
                <button class="btn btn-danger btn-sm remove-item" data-product-title="${producto.titulo}">X</button>
            `;
            carritoItemsContainer.appendChild(itemCarrito);
            total += producto.precio * producto.cantidad;
            totalItems++;
        });
    }

    totalPriceSpan.textContent = total.toFixed(2);
    cartCountSpan.textContent = totalItems;
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.titulo === producto.titulo);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito();
    renderizarCarrito();
    console.log("Carrito actualizado:", carrito);
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(tituloProducto) {
    carrito = carrito.filter(item => item.titulo !== tituloProducto);
    guardarCarrito();
    renderizarCarrito();
    console.log("Producto eliminado. Carrito actualizado:", carrito);
}

// Inicializa los eventos del carrito una vez que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    obtenerCarrito();
    renderizarCarrito();

    // Delegación de eventos para eliminar productos (solo una vez)
    const carritoItemsContainer = document.querySelector('.cart-items-container');
    carritoItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const tituloProducto = event.target.dataset.productTitle;
            eliminarDelCarrito(tituloProducto);
        }
    });

    // Espera un momento para asegurarnos de que los productos estén en el DOM
    setTimeout(() => {
        const botonesComprar = document.querySelectorAll('.add-to-cart');

        botonesComprar.forEach(boton => {
            boton.addEventListener('click', (event) => {
                const tarjetaProducto = event.target.closest('.product-card');
                const titulo = tarjetaProducto.querySelector('h3').textContent;
                const precioTexto = tarjetaProducto.querySelector('span').textContent;
                const imagenSrc = tarjetaProducto.querySelector('img').src;
                const precio = parseFloat(precioTexto.replace('$', ''));

                const productoParaAgregar = {
                    titulo,
                    precio,
                    imagen: imagenSrc
                };

                agregarAlCarrito(productoParaAgregar);
            });
        });
    }, 1000);
});