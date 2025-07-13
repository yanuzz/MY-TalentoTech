// ===============================================
// SCRIPT.JS - TIENDA ONLINE MATECH
// ===============================================

// Variables globales
let productos = [];
let carrito = [];
let contadorCarrito = 0;

// ===============================================
// CONFIGURACIÓN DE PRODUCTOS A IMPORTAR
// ===============================================

// Configuración para filtrar productos relevantes de la FakeStore API
const configuracionImportacion = {
    // Categorías relevantes para equipos de medición/tecnología
    categoriasRelevantes: ['electronics'],
    
    // Palabras clave para filtrar productos relevantes
    palabrasClave: [
        'electronic', 'digital', 'monitor', 'device', 'sensor', 'meter', 
        'wireless', 'portable', 'precision', 'measurement', 'data', 'smart',
        'cable', 'adapter', 'charger', 'battery', 'power', 'usb', 'bluetooth'
    ],
    
    // Productos específicos por ID que son relevantes
    productosEspecificos: [12, 13, 14],
    
    // Configuración de precios
    precioMinimo: 100,
    precioMaximo: 1000,
    
    // Límite de productos a importar
    limite: 3
};

// ===============================================
// INICIALIZACIÓN
// ===============================================
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

function inicializarApp() {
    cargarCarritoDesdeLocalStorage();
    actualizarContadorCarrito();
    
    // Verificar qué página estamos cargando
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'products.html' || currentPage === '') {
        cargarProductosDesdeAPI();
        configurarEventosProductos();
    }
    
    if (currentPage === 'contact.html') {
        configurarValidacionFormulario();
    }
    
    configurarEventosCarrito();
    configurarNavegacionTeclado();
}

// ===============================================
// GESTIÓN DE PRODUCTOS Y API
// ===============================================

// Datos de productos por defecto (fallback)
const productosDefault = [
    {
        id: 1,
        title: "Datalogger de condiciones ambientales",
        price: 300000,
        image: "./images/datalogger.png",
        category: "dataloggers",
        description: "Dispositivo para monitoreo de temperatura, humedad y presión atmosférica con conectividad WiFi."
    },
    {
        id: 2,
        title: "Dataloggers de variables eléctricas",
        price: 300000,
        image: "./images/datalogger.png",
        category: "dataloggers",
        description: "Equipo especializado para medición de voltaje, corriente y potencia en tiempo real."
    },
    {
        id: 3,
        title: "Calibración de datalogger",
        price: 50000,
        image: "./images/datalogger.png",
        category: "servicios",
        description: "Servicio profesional de calibración para mantener la precisión de tus equipos."
    }
];

// Función para verificar si un producto es relevante
function esProductoRelevante(producto) {
    // Verificar por categoría
    if (configuracionImportacion.categoriasRelevantes.includes(producto.category)) {
        return true;
    }
    
    // Verificar por palabras clave en título o descripción
    const textoCompleto = `${producto.title} ${producto.description}`.toLowerCase();
    return configuracionImportacion.palabrasClave.some(palabra => 
        textoCompleto.includes(palabra.toLowerCase())
    );
}

// Función para adaptar productos de la API al formato local
function adaptarProductoAPI(producto) {
    // Crear títulos más técnicos/relevantes
    const titulosAdaptados = {
        "WD 2TB Elements Portable External Hard Drive - USB 3.0": "Disco duro portátil para almacenamiento de datos",
        "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s": "SSD interno para sistemas de medición",
        "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5": "SSD de alto rendimiento para dataloggers",
        "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive": "Disco externo para respaldo de mediciones",
        "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin": "Monitor LCD para visualización de datos",
        "Samsung 49-Inch CHG90 QLED Gaming Monitor": "Monitor curvo para análisis de datos",
    };
    
    return {
        id: producto.id + 1000, // Evitar conflictos de ID
        title: titulosAdaptados[producto.title] || producto.title,
        price: Math.round(producto.price * 850), // Convertir a pesos argentinos con mejor tasa
        image: producto.image,
        category: producto.category === 'electronics' ? 'equipos-electronicos' : 'accesorios-electronicos',
        description: producto.description
    };
}

async function cargarProductosDesdeAPI() {
    mostrarLoader();
    
    try {
        // Cargar todos los productos de la API
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error('Error al cargar productos desde API');
        }
        
        const todosLosProductos = await response.json();
        
        // Filtrar productos relevantes
        let productosFiltrados = todosLosProductos.filter(producto => {
            // Filtrar por categorías relevantes
            if (configuracionImportacion.categoriasRelevantes.includes(producto.category)) {
                return true;
            }
            
            // Filtrar por IDs específicos (productos que sabemos que son útiles)
            if (configuracionImportacion.productosEspecificos.includes(producto.id)) {
                return true;
            }
            
            // Filtrar por palabras clave
            return esProductoRelevante(producto);
        });
        
        // Filtrar por precio
        productosFiltrados = productosFiltrados.filter(producto => 
            producto.price >= configuracionImportacion.precioMinimo && 
            producto.price <= configuracionImportacion.precioMaximo
        );
        
        // Limitar cantidad y adaptar productos
        productosFiltrados = productosFiltrados
            .slice(0, configuracionImportacion.limite)
            .map(adaptarProductoAPI);
        
        // Combinar productos de API con productos por defecto
        productos = [
            ...productosDefault,
            ...productosFiltrados
        ];
        
        console.log(`Cargados ${productosFiltrados.length} productos relevantes de la API`);
        mostrarProductos(productos);
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensaje('No se pudieron cargar todos los productos. Mostrando productos disponibles.', 'error');
        productos = productosDefault;
        mostrarProductos(productos);
    } finally {
        ocultarLoader();
    }
}

// Función para cargar productos de categorías específicas
async function cargarProductosPorCategoria(categoria) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/category/${categoria}`);
        if (!response.ok) throw new Error('Error al cargar categoría');
        
        const productosCategoria = await response.json();
        return productosCategoria.map(adaptarProductoAPI);
    } catch (error) {
        console.error(`Error al cargar categoría ${categoria}:`, error);
        return [];
    }
}

// Función para cargar productos específicos por ID
async function cargarProductosEspecificos(ids) {
    try {
        const promesas = ids.map(id => 
            fetch(`https://fakestoreapi.com/products/${id}`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null)
        );
        
        const productos = await Promise.all(promesas);
        return productos.filter(producto => producto !== null).map(adaptarProductoAPI);
    } catch (error) {
        console.error('Error al cargar productos específicos:', error);
        return [];
    }
}

function mostrarProductos(productos) {
    const gallery = document.querySelector('.gallery');
    
    if (!gallery) return;
    
    // Limpiar productos existentes (excepto los primeros 3 que ya están en HTML)
    const productosExistentes = gallery.querySelectorAll('.product');
    
    // Actualizar productos existentes con datos y precios
    productosExistentes.forEach((card, index) => {
        if (productos[index]) {
            const producto = productos[index];
            
            // Agregar precio si no existe
            if (!card.querySelector('.product-price')) {
                const priceElement = document.createElement('p');
                priceElement.className = 'product-price';
                priceElement.textContent = `$${producto.price.toLocaleString('es-AR')}`;
                card.querySelector('h3').after(priceElement);
            }
            
            // Actualizar evento del botón
            const btnCarrito = card.querySelector('.add-to-cart');
            btnCarrito.onclick = () => agregarAlCarrito(producto);
            btnCarrito.setAttribute('data-product-id', producto.id);
        }
    });
    
    // Agregar productos adicionales de la API
    productos.slice(3).forEach(producto => {
        const productCard = crearTarjetaProducto(producto);
        gallery.appendChild(productCard);
    });
}

function crearTarjetaProducto(producto) {
    const productCard = document.createElement('div');
    productCard.className = 'product';
    productCard.innerHTML = `
        <img src="${producto.image}" alt="${producto.title}" onerror="this.src='./images/datalogger.png'">
        <h3>${producto.title}</h3>
        <p class="product-price">$${producto.price.toLocaleString('es-AR')}</p>
        <p class="product-category">${producto.category}</p>
        <div class="button-container">
            <button class="add-to-cart" data-product-id="${producto.id}" aria-label="Agregar ${producto.title} al carrito">
                <i class="fa-solid fa-cart-shopping"></i> 
            </button>
            <button class="info-btn" onclick="mostrarInfoProducto(${producto.id})">Más información</button>
        </div>
    `;
    
    const btnCarrito = productCard.querySelector('.add-to-cart');
    btnCarrito.onclick = () => agregarAlCarrito(producto);
    
    return productCard;
}

function mostrarInfoProducto(productId) {
    const producto = productos.find(p => p.id === productId);
    if (producto) {
        mostrarMensaje(`${producto.title}: ${producto.description}`, 'info');
    }
}

// ===============================================
// GESTIÓN DEL CARRITO
// ===============================================

function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            title: producto.title,
            price: producto.price,
            image: producto.image,
            cantidad: 1
        });
    }
    
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    mostrarMensaje(`${producto.title} agregado al carrito`, 'success');
}

function eliminarDelCarrito(productId) {
    const index = carrito.findIndex(item => item.id === productId);
    if (index !== -1) {
        const producto = carrito[index];
        carrito.splice(index, 1);
        guardarCarritoEnLocalStorage();
        actualizarContadorCarrito();
        mostrarMensaje(`${producto.title} eliminado del carrito`, 'success');
        mostrarCarrito();
    }
}

function cambiarCantidad(productId, nuevaCantidad) {
    const item = carrito.find(item => item.id === productId);
    if (item && nuevaCantidad > 0) {
        item.cantidad = parseInt(nuevaCantidad);
        guardarCarritoEnLocalStorage();
        actualizarContadorCarrito();
        mostrarCarrito();
    }
}

function vaciarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    mostrarMensaje('Carrito vaciado', 'success');
    cerrarCarrito();
}

function calcularTotal() {
    return carrito.reduce((total, item) => total + (item.price * item.cantidad), 0);
}

function actualizarContadorCarrito() {
    contadorCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const iconoCarrito = document.querySelector('.nav-bar .fa-cart-shopping');
    if (iconoCarrito) {
        // Eliminar contador anterior si existe
        const contadorAnterior = iconoCarrito.parentElement.querySelector('.carrito-contador');
        if (contadorAnterior) {
            contadorAnterior.remove();
        }
        
        // Agregar nuevo contador si hay productos
        if (contadorCarrito > 0) {
            const contador = document.createElement('span');
            contador.className = 'carrito-contador';
            contador.textContent = contadorCarrito;
            iconoCarrito.parentElement.style.position = 'relative';
            iconoCarrito.parentElement.appendChild(contador);
        }
    }
}

// ===============================================
// INTERFAZ DEL CARRITO
// ===============================================

function configurarEventosCarrito() {
    const iconoCarrito = document.querySelector('.nav-bar .fa-cart-shopping');
    if (iconoCarrito) {
        iconoCarrito.parentElement.onclick = mostrarCarrito;
        iconoCarrito.parentElement.style.cursor = 'pointer';
    }
}

function mostrarCarrito() {
    // Eliminar carrito existente si hay uno
    const carritoExistente = document.getElementById('carrito-modal');
    if (carritoExistente) {
        carritoExistente.remove();
    }
    
    // Crear modal del carrito
    const carritoModal = document.createElement('div');
    carritoModal.id = 'carrito-modal';
    carritoModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const carritoContenido = document.createElement('div');
    carritoContenido.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 10px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    carritoContenido.innerHTML = `
        <h2 style="color: #228e30; margin-bottom: 20px;">Carrito de Compras</h2>
        <button onclick="cerrarCarrito()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        <div id="carrito-items"></div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #228e30;">
            <div id="carrito-total" style="font-size: 18px; font-weight: bold; color: #228e30; margin-bottom: 15px;"></div>
            <div style="display: flex; gap: 10px; justify-content: space-between;">
                <button onclick="vaciarCarrito()" style="background-color: #f44336; flex: 1;">Vaciar Carrito</button>
                <button onclick="finalizarCompra()" style="background-color: #228e30; flex: 2;">Finalizar Compra</button>
            </div>
        </div>
    `;
    
    carritoModal.appendChild(carritoContenido);
    document.body.appendChild(carritoModal);
    
    // Llenar items del carrito
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align: center; color: #666;">El carrito está vacío</p>';
        carritoTotal.textContent = 'Total: $0';
    } else {
        carritoItems.innerHTML = carrito.map(item => `
            <div class="carrito-item" style="display: flex; align-items: center; padding: 10px; border-bottom: 1px solid #eee;">
                <img src="${item.image}" alt="${item.title}" class="carrito-item-imagen" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;" onerror="this.src='./images/datalogger.png'">
                <div style="flex: 1;">
                    <h4 style="margin: 0; color: #333;">${item.title}</h4>
                    <p style="margin: 5px 0; color: #666;">$${item.price.toLocaleString('es-AR')}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <input type="number" value="${item.cantidad}" min="1" max="99" 
                           onchange="cambiarCantidad(${item.id}, this.value)"
                           style="width: 60px; text-align: center;">
                    <button onclick="eliminarDelCarrito(${item.id})" 
                            style="background-color: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        carritoTotal.textContent = `Total: $${calcularTotal().toLocaleString('es-AR')}`;
    }
    
    // Cerrar modal al hacer clic fuera
    carritoModal.onclick = function(e) {
        if (e.target === carritoModal) {
            cerrarCarrito();
        }
    };
}

function cerrarCarrito() {
    const carritoModal = document.getElementById('carrito-modal');
    if (carritoModal) {
        carritoModal.remove();
    }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito está vacío', 'error');
        return;
    }
    
    const total = calcularTotal();
    const mensaje = `¡Compra realizada con éxito! Total: $${total.toLocaleString('es-AR')}`;
    
    // Vaciar carrito
    carrito = [];
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
    
    mostrarMensaje(mensaje, 'success');
    cerrarCarrito();
    
    // Redireccionar a WhatsApp para completar la compra
    setTimeout(() => {
        const whatsappUrl = `https://api.whatsapp.com/send?phone=5491140835748&text=Hola%20MATech,%20quiero%20finalizar%20mi%20compra%20por%20un%20total%20de%20$${total.toLocaleString('es-AR')}`;
        window.open(whatsappUrl, '_blank');
    }, 2000);
}

// ===============================================
// GESTIÓN DE LOCALSTORAGE
// ===============================================

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carritoMATech', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carritoMATech');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// ===============================================
// VALIDACIÓN DE FORMULARIOS
// ===============================================

function configurarValidacionFormulario() {
    const form = document.querySelector('form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validarCampo.call(this);
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        validarFormulario(this);
    });
}

function validarCampo() {
    const valor = this.value.trim();
    const tipo = this.type;
    const nombre = this.name;
    
    let esValido = true;
    let mensaje = '';
    
    if (valor === '') {
        esValido = false;
        mensaje = 'Este campo es requerido';
    } else if (tipo === 'email' && !validarEmail(valor)) {
        esValido = false;
        mensaje = 'Ingresa un email válido';
    } else if (nombre === 'telefono' && !validarTelefono(valor)) {
        esValido = false;
        mensaje = 'Ingresa un teléfono válido';
    }
    
    if (esValido) {
        this.classList.remove('error');
        eliminarMensajeError(this);
    } else {
        this.classList.add('error');
        mostrarMensajeError(this, mensaje);
    }
    
    return esValido;
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefono(telefono) {
    const regex = /^[\d\s\-\+\(\)]{8,}$/;
    return regex.test(telefono);
}

function validarFormulario(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let formularioValido = true;
    
    inputs.forEach(input => {
        if (!validarCampo.call(input)) {
            formularioValido = false;
        }
    });
    
    if (formularioValido) {
        mostrarMensaje('Formulario enviado correctamente', 'success');
        form.submit();
    } else {
        mostrarMensaje('Por favor, corrige los errores en el formulario', 'error');
    }
}

function mostrarMensajeError(input, mensaje) {
    eliminarMensajeError(input);
    
    const mensajeError = document.createElement('div');
    mensajeError.className = 'mensaje-error-campo';
    mensajeError.textContent = mensaje;
    mensajeError.style.cssText = `
        color: #f44336;
        font-size: 14px;
        margin-top: 5px;
        display: block;
    `;
    
    input.parentNode.insertBefore(mensajeError, input.nextSibling);
}

function eliminarMensajeError(input) {
    const mensajeError = input.parentNode.querySelector('.mensaje-error-campo');
    if (mensajeError) {
        mensajeError.remove();
    }
}

// ===============================================
// CONFIGURACIÓN DE EVENTOS
// ===============================================

function configurarEventosProductos() {
    const botonesCarrito = document.querySelectorAll('.add-to-cart');
    
    botonesCarrito.forEach(boton => {
        boton.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                const producto = productos.find(p => p.id == productId);
                if (producto) {
                    agregarAlCarrito(producto);
                }
            }
        });
    });
}

function configurarNavegacionTeclado() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarCarrito();
        }
    });
    
    // Hacer elementos focusables con teclado
    const elementos = document.querySelectorAll('button, .add-to-cart, .info-btn');
    elementos.forEach(elemento => {
        elemento.setAttribute('tabindex', '0');
    });
}

// ===============================================
// UTILIDADES Y MENSAJES
// ===============================================

function mostrarMensaje(texto, tipo = 'info') {
    // Eliminar mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    const mensaje = document.createElement('div');
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.textContent = texto;
    
    // Estilos según el tipo
    const estilos = {
        success: 'background-color: #4CAF50; color: white;',
        error: 'background-color: #f44336; color: white;',
        info: 'background-color:rgb(2, 162, 58); color: white;'
    };
    
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${estilos[tipo]}
    `;
    
    document.body.appendChild(mensaje);
    
    // Mostrar mensaje
    setTimeout(() => {
        mensaje.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        mensaje.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (mensaje.parentNode) {
                mensaje.remove();
            }
        }, 300);
    }, 3000);
}

function mostrarLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;
    loader.innerHTML = `
        <div style="
            border: 4px solid #f3f3f3;
            border-top: 4px solid #228e30;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        "></div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    document.body.appendChild(loader);
}

function ocultarLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
    }
}

// ===============================================
// ACCESIBILIDAD
// ===============================================

// Mejorar accesibilidad para lectores de pantalla
function mejorarAccesibilidad() {
    // Agregar atributos ARIA
    const iconoCarrito = document.querySelector('.nav-bar .fa-cart-shopping');
    if (iconoCarrito) {
        iconoCarrito.parentElement.setAttribute('aria-label', 'Abrir carrito de compras');
        iconoCarrito.parentElement.setAttribute('role', 'button');
    }
    
    // Agregar descripciones a imágenes
    const imagenes = document.querySelectorAll('img:not([alt])');
    imagenes.forEach(img => {
        img.setAttribute('alt', 'Imagen del producto');
    });
}

// Ejecutar mejoras de accesibilidad cuando se carga la página
document.addEventListener('DOMContentLoaded', mejorarAccesibilidad);

// ===============================================
// EXPOSICIÓN DE FUNCIONES GLOBALES
// ===============================================

// Funciones que necesitan ser accesibles desde el HTML
window.mostrarInfoProducto = mostrarInfoProducto;
window.agregarAlCarrito = agregarAlCarrito;
window.eliminarDelCarrito = eliminarDelCarrito;
window.cambiarCantidad = cambiarCantidad;
window.vaciarCarrito = vaciarCarrito;
window.finalizarCompra = finalizarCompra;
window.cerrarCarrito = cerrarCarrito;
window.mostrarCarrito = mostrarCarrito;