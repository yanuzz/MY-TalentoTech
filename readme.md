# MATech IoT Solutions - Página Web

Este repositorio contiene el código fuente de la página web de **MATech IoT Solutions**. Este proyecto es una página web básica desarrollada como parte de un curso de Front-End. El objetivo es aprender a crear la estructura básica de una tienda online utilizando HTML, CSS y Javascript. Sin fines comerciales.

## Tecnologías utilizadas

Entre las herramientas y lenguajes empleados destacan:

- **HTML**  - Estructura semántica y optimizada.
- **CSS**  - Diseño responsivo con estilos avanzados.
- **GitHub Pages**  - Hosting gratuito y fácil implementación.
- **Formspree** - Para la gestión de envíos de formularios de contacto de manera sencilla.
- **JavaScript** - Para la funcionalidad del carrito de compras.
- **FakeStore** - Para importar productos.

## Características del diseño

Algunas de sus características principales incluyen:

- **Diseño responsivo**  - Adaptación a distintos tamaños de pantalla.
- **Flexbox** - Utilizado para la alineación y distribución eficiente de elementos en contenedores, facilitando el diseño de secciones como la barra de navegación y las tarjetas de productos.
- **Grid** - Implementado para la maquetación de la estructura de la sección de reseñas.
- **Formulario de Contacto** - Inclusión de un formulario de contacto funcional para la interacción con los usuarios, conectado a través de Formspree.
- **Catálogo de productos** - Elementos propios y otros importados de FakeStore.
- **Carrito de compras** - Funcionalidad completa con persistencia en localStorage.
- **Validación de formularios** - Sistema de validación en tiempo real para el formulario de contacto.
- **Integración WhatsApp** - Finalización de compras directa por WhatsApp.
- **Accesibilidad** - Soporte para lectores de pantalla y navegación por teclado.
- **Mensajes dinámicos** - Notificaciones de éxito, error e información.

## Estructura del Proyecto

El proyecto se organiza de la siguiente manera:

```
├── index.html        # Página principal de la tienda
├── products.html     # Página de listado de productos 
├── contact.html      # Página con el formulario de contacto
├── location.html     # Página con la ubicación de la tienda
├── style.css         # Hoja de estilos
├── script.js         # Lógica principal de la aplicación
├── images/           # Carpeta para imágenes, íconos y logos
├── videos/           # Carpeta para vídeos y subtítulos
└── readme.md         # Este archivo
```

## Instalación y Uso
### Requisitos

Navegador web moderno (Chrome, Firefox, Opera, Edge, Brave)

### Instalación

**1. Clona o descarga el proyecto**

git clone [url-del-repositorio]
cd tienda-matech

**2. Abre el proyecto**

Abrí index.html directamente en tu navegador.

**3. Accede a la tienda**

Si abrís directamente: archivo local en el navegador

## Funcionalidades

**Carrito de Compras**

✅ Agregar productos al carrito  
✅ Modificar cantidades  
✅ Eliminar productos  
✅ Vaciar carrito completo  
✅ Persistencia de datos (localStorage)  
✅ Contador visual en el ícono del carrito  

**Productos**

✅ Catálogo de 3 productos predefinidos  
✅ Información detallada de los productos importados  
✅ Precios en pesos argentinos  
✅ Imágenes de productos  

**Formulario de Contacto**

✅ Validación en tiempo real  
✅ Validación de email  
✅ Validación de teléfono  
✅ Mensajes de error específicos  

**Finalización de Compra** 

✅ Resumen de compra  
✅ Cálculo automático del total  
✅ Integración con WhatsApp  
✅ Mensaje automático con el total de la compra  

## Compatibilidad

Navegadores: Chrome, Firefox, Opera, Edge, Brave  
Dispositivos: Desktop, tablet, móvil  
Resoluciones: Diseño responsivo desde 600px hasta 1024px+  

## Comentarios

No se ha logrado implementar el diseño responsivo de la manera deseada por la desarrolladora.  
El logo de WhatsApp no se ubica en el mismo lugar para cualquier resolución de pantalla. 
