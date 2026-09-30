# AGENTS.md — pgone-demos

## Qué es

Showroom estático con 3 demos interactivas de asistentes de WhatsApp (IA) para PG-ONE AI Systems. Cada demo simula un chat real en un mockup de teléfono + un panel lateral que explica el valor comercial paso a paso.

Demo pública: https://pgone-demos.vercel.app

## Marca / naming

| Producto | Vertical | Estado |
|---|---|---|
| **CotizaFlow** | `cotizaflow` | Nombre propio, ya establecido |
| **Maestranza** | `servicios` | Renombrado desde "Servicios Hogar" (2026-09-29) |
| **Velvet Agenda** | `turnos` | Renombrado desde "Turnos & Estética" / "Turnos & Locales" (2026-09-29) |

- Los **negocios simulados dentro del chat** (`Electricista López`, `Studio Urbano`) son ficticios: son el *cliente* que usa el producto, no la marca. No renombrarlos junto con la marca.
- Dominios verificados como libres ese día y **aún sin comprar**: `maestranzaflow.com`, `maestranza.app`, `velvetagenda.com`, `velvetagenda.app`.

## Stack y estructura

Sitio **estático** (sin `package.json`, sin build, sin framework). JS vanilla con ES modules.

```
index.html          Shell único: header, mockup de teléfono, panel del tour
css/styles.css      Estilos base (burbujas de chat, typing dots, quick replies)
js/app.js           ChatEngine (render de burbujas/quick replies/links) + routing por ?vertical=
js/tour-engine.js   Panel lateral explicativo (tag/título/desc/métrica)
js/verticals/       Una clase por vertical, todas con la misma interfaz
supabase/migrations/ Esquema SQL (no se aplica desde acá)
vercel.json         cleanUrls + trailingSlash
```

### Interfaz de una vertical

Cada archivo en `js/verticals/*.js` exporta una clase con:

- `constructor(chatEngine, tourEngine)` — inicializa `this.step` y `this.collected`
- `start()` — limpia el chat, setea header, muestra menú con quick replies
- `handleInput(text)` — máquina de estados; avanza `this.step` y llena `this.collected`
- Métodos auxiliares para cada rama del menú

Convención: `this.step` en MAYÚSCULAS (`ASK_SERVICIO`, `ASK_HORARIO`…), mensajes del bot en español rioplatense con `*asteriscos*` para negrita (`ChatEngine` los convierte a `<strong>`).

### Cómo se elige la vertical

- `?vertical=cotizaflow|servicios|turnos` → aísla la demo y oculta las pestañas
- Sin parámetro → modo showroom con las 3 pestañas navegables

## Verticales y flujos

| Vertical | Archivo | Campos capturados | Integración |
|---|---|---|---|
| **CotizaFlow** (traslados) | `verticals/cotizaflow.js` | 7: origen, destino, fecha, pasajeros, WhatsApp, email, nombre | ✅ webhook Make + cotizador web precargado |
| **Maestranza** (servicios domiciliarios) | `verticals/servicios.js` | 4: consulta, nombre, domicilio, WhatsApp | ✅ botón `wa.me` |
| **Velvet Agenda** (turnos & estética) | `verticals/turnos.js` | 4: servicio, franja horaria, nombre, WhatsApp | — (a propósito, ver abajo) |

- **Naturaleza del proyecto:** los demos son **material de venta**, compartidos como link en publicaciones y mails. **No forman parte del circuito productivo** — no deben escribir en bases de datos ni disparar pipelines de leads. Simulan la experiencia y terminan en un botón `wa.me` / link de "vista del negocio".
- Los datos de contacto se generan en el cliente; **no hay backend propio** y no debería haberlo.
- El webhook de CotizaFlow está hardcodeado en `cotizaflow.js` (`triggerRealMakeWebhook`) y se envía con `mode: "no-cors"`.
- `retail.js` existe pero **no está registrado** en `app.js`.

## Infra

- **Vercel:** team `eric-pesci` · proyecto `pgone-demos` · rama de producción **`main`**
- **Dominio oficial ≠ CLI (regla 2026-09-30):** el dominio oficial de un proyecto se toma del **dashboard de Vercel** (Settings → Domains). El CLI sólo para operaciones (deploy, env, logs): `vercel project ls` lista la URL efírmica por defecto, no el dominio oficial. Ej.: `quantumlabs-admin` → oficial `quantumlabs-admin.vercel.app`; el CLI muestra `quantumlabs-admin-eric-pesci.vercel.app`. No "corregir" documentación hacia el sufijo `-eric-pesci`.
- **Git:** `https://github.com/pgoneaisystems/pgone-demos.git` (cuenta `pgoneaisystems`, **pública**)
- Deploy automático conectado: **`git push` a `main` publica solo**. No hace falta `vercel --prod`.
- Comandos útiles: `vercel whoami`, `vercel git connect <url>`, `vercel logs <url>`
- `.vercel/` está en `.gitignore` (contiene IDs de proyecto). `supabase/.temp/` también.

## Pendiente / roadmap

1. Registrar `retail.js` o eliminarlo.
2. Vercel ↔ GitHub quedó linkeado el 2026-09-29 tras varios intentos por confusión de cuentas Vercel (`pgoneaisystems-6808` = CLI, `pecieric-8772` = navegador). Si vuelve a fallar, revisar **Login Connections** en Settings → Authentication de la cuenta `pgoneaisystems-6808`.

### NO es pendiente (ya se aclaró el 2026-09-29)

- **"Integrar Turnos con Supabase / webhook"** → **no corresponde**. El demo es material de venta, no va al circuito. `turnos.js` no tiene llamadas de red ni debe tenerlas.
- **La tabla `leads_linea_a` sí existe**, pero en la instancia **Línea A** (`uxansewjnpowqrioakxu.supabase.co`, la de `retail-pass-bot`), con datos de prueba. El archivo `supabase/migrations/20260928204021_01_init_leads_linea_a.sql` de este repo documenta el esquema; **no está linkeado a ningún proyecto Supabase** (no hay `config.toml`) y no hace falta ejecutarlo acá.

## Reglas del repo

- Commits en inglés/español con prefijo convencional: `feat(...)`, `fix(...)`, `chore(...)`.
- Rama principal siempre `main` (se renombró desde `master` el 2026-09-29).
- Nunca commitear `.env`, tokens ni la URL del webhook en documentación (ya está expuesta en el código público de CotizaFlow; no duplicarla).
- Repo **público**: no subir datos de clientes, precios internos ni credenciales.
