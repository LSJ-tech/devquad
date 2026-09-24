<p align="center">
  <img src="./devquad-logo.svg" alt="DevQuad" width="360" />
</p>

<p align="center">
  <a href="https://devquad.cl"><img alt="Sitio" src="https://img.shields.io/badge/sitio-devquad.cl-142143?style=flat-square" /></a>
  <img alt="Stack" src="https://img.shields.io/badge/stack-HTML%20·%20CSS%20·%20JS-b68e39?style=flat-square" />
  <a href="https://sonarcloud.io/summary/new_code?id=LSJ-tech_devquad"><img alt="Quality Gate" src="https://sonarcloud.io/api/project_badges/measure?project=LSJ-tech_devquad&metric=alert_status" /></a>
</p>

<p align="center"><i>Piensa, desarrolla, ejecuta.</i></p>

---

Landing page de **DevQuad**, equipo de desarrollo de software. Sitio estático en HTML/CSS/JS puro, sin frameworks ni build step, con modo claro/oscuro, formulario funcional y buenas prácticas de SEO y accesibilidad.

## Equipo

Cuatro amigos de primer año de universidad, cada uno responsable de un área:

| Nombre | Área |
|---|---|
| **Logan Silva** | Frontend |
| **Maximiliano Montoya** | Backend & API |
| **Gianni Antonietti** | Infraestructura & Deploy |
| **Camilo Sepúlveda** | QA & Contenido |

## Estructura

```
devquad/
├── index.html              página principal (Hero, Nosotros, Servicios, Equipo, Contacto)
├── privacidad.html         política de privacidad
├── 404.html                página de error personalizada
├── style.css                estilos, modo claro/oscuro vía [data-theme]
├── script.js                menú móvil, nav activo, modo oscuro, formulario, animaciones
├── fonts/                    Inter y Montserrat auto-hospedadas (.woff2)
├── img/                       favicons, íconos PWA, imagen para compartir (og-image.png)
├── devquad-logo(.svg|-dark.svg)  logo para modo claro y oscuro
├── robots.txt, sitemap.xml, site.webmanifest   SEO y PWA
├── .well-known/security.txt   contacto para reportar vulnerabilidades (RFC 9116)
├── _config.yml                 fuerza a Jekyll/GitHub Pages a publicar .well-known/
├── .sonarcloud.properties     configuración de análisis de código
└── worker/                    Cloudflare Worker que envía el formulario de contacto
```

## Ejecutar localmente

No requiere instalación. Basta con abrir `index.html` en el navegador, o levantar un servidor estático simple:

```bash
python -m http.server 8000
```

## Formulario de contacto

Sin servicios de terceros: el envío va por `fetch` a `/api/contact`, una ruta manejada por un [Cloudflare Worker propio](./worker) que manda el correo con el binding `send_email` de Cloudflare — nada se abre externamente, todo queda en la página. Incluye honeypot anti-spam y rate limiting (5 solicitudes/minuto por IP).

## Flujo de contribución

`master` está protegida: nadie pushea directo. El flujo es:

1. Crear una rama (`nombre/lo-que-sea`).
2. Hacer los cambios y subir la rama.
3. Abrir un Pull Request hacia `master`.
4. **Logan** ([@LSJ-tech](https://github.com/LSJ-tech), definido en [`.github/CODEOWNERS`](.github/CODEOWNERS)) tiene que aprobarlo antes de mergear.

## Hosting

| | |
|---|---|
| **DNS y proxy** | Cloudflare (dominio `devquad.cl` registrado en NIC Chile) |
| **Hosting** | GitHub Pages, deploy automático al hacer push a `master` |
| **Cabeceras de seguridad** | HSTS, CSP, X-Frame-Options, etc. — configuradas como Transform Rules en Cloudflare, no en este repositorio |
