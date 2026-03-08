# BUGS TRACKER - Titanes Website (titanes-website)

## Bugs Resueltos

| Fecha | Modulo | Bug | Fix | Commit |
|-------|--------|-----|-----|--------|
| 2026-03-07 | Tienda/Checkout/Cuenta | Navbar y CartDrawer solo se mostraban en la pagina principal (home). En tienda, checkout, auth y cuenta no aparecia el carrito ni el menu de usuario | Agregado `import Navbar` y wrapper `<><Navbar />...</>` en los 9 componentes Client de todas las paginas | pendiente |
| 2026-03-07 | Checkout | `envio.precio_usd.toFixed is not a function` — crash al mostrar opciones de envio porque Django DRF serializa DecimalField como string | Wrapeado con `Number()`: `Number(envio.precio_usd).toFixed(2)` y `Number(selectedShipping?.precio_usd)` | pendiente |
| 2026-03-07 | Auth (Login/Registro) | `Google OAuth components must be used within GoogleOAuthProvider` — crash al cargar login/registro porque GoogleLogin se renderiza sin provider cuando GOOGLE_CLIENT_ID no esta configurado | Wrapeado GoogleLogin en condicional `{process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (...)}` en LoginClient y RegistroClient | pendiente |
| 2026-03-07 | Cuenta/Pedidos | `Cannot read properties of undefined (reading 'toFixed')` — crash en listado de pedidos al mostrar `order.total.toFixed(2)` con datos reales de la API | Wrapeado con `Number(order.total \|\| 0).toFixed(2)` en PedidosClient, CuentaClient y PedidoDetailClient (subtotal, envio, total, precio items) | pendiente |
| 2026-03-07 | Tienda/ProductCard | `product.precio.toFixed(2)` potencial crash con DecimalField string de la API | Wrapeado con `Number(product.precio).toFixed(2)` en ProductCard y pagina de detalle [slug] | pendiente |

## Bugs Pendientes

| Fecha | Modulo | Bug | Prioridad |
|-------|--------|-----|-----------|
| 2026-03-07 | Backend/API | Pedidos creados via web store muestran items sin nombre y total $0.00 (subtotal si llega correcto). El serializer de pedidos no devuelve todos los campos de items ni calcula total | Media |
| 2026-03-07 | Backend/API | `tasa-bcv` endpoint devuelve 401 en paginas autenticadas (console errors en /cuenta/*) — no afecta funcionalidad porque la tasa se obtiene del siteConfig | Baja |

## Notas

- **Patron recurrente**: Django DRF serializa `DecimalField` como string (ej: `"5.00"`). JavaScript `.toFixed()` solo funciona en numeros. Solucion: SIEMPRE usar `Number(valor).toFixed(2)` al mostrar precios de la API.
- El BUGS_TRACKER del ERP principal esta en `C:\wamp64\www\Titanes_dev2\docs\BUGS_TRACKER.md`
