# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Una sola persona: el propietario del proyecto, ingeniero de software con ~3 años de experiencia en Java/Liferay DXP en una consultora, buscando un nuevo puesto en España. Usa la app sobre todo desde escritorio, sentado, para pegar descripciones largas de ofertas, leer fichas extensas y comparar. El móvil debe funcionar bien pero es secundario.

Alcance confirmado: herramienta personal de momento. Si se abre al público más adelante, onboarding y landing se diseñarán entonces.

## Product Purpose

Evaluar y hacer seguimiento de ofertas de empleo. El usuario aporta su perfil (CV, LinkedIn, datos extra), pega la descripción de cada oferta y la app genera un análisis de compatibilidad con ese perfil: score, competencias que coinciden, gaps, ventajas y desventajas. Después mueve cada oferta por las fases Guardada → En curso → Entrevista → Completada / Descartada.

La tarea principal de cada visita es **decidir qué ofertas merecen su tiempo**: ver las ofertas ordenadas por compatibilidad y entender de un vistazo por qué encajan o no. Seguir el pipeline y comparar ofertas son tareas secundarias.

Éxito: descartar pronto lo que no encaja, priorizar bien lo que sí, y no perder el hilo de ninguna candidatura.

## Positioning

A diferencia de un tracker genérico (hoja de cálculo, Notion), cada ficha nace de un análisis contra el perfil real del usuario, con score explicable y gaps concretos, no de campos rellenados a mano.

## Operating Context

- Origen: prototipo HTML estático (`evaluacion_ofertas_3.html`, 17 ofertas semilla) con persistencia frágil, que esta app sustituye.
- El análisis de ofertas lo hace un agente con un LLM que recibe un único contexto del perfil (sin RAG). El contexto se regenera solo cuando el usuario añade o elimina fuentes.
- La investigación de empresas es manual en el MVP (valoración, investigación y fuentes son campos de texto editables).

## Capabilities and Constraints

- Fases fijas: Guardada, En curso, Entrevista, Completada, Descartada. Descartar exige un motivo (lista cerrada con detalle opcional).
- Vistas de ofertas: tarjetas, tabla comparativa y Kanban. Orden por score descendente. Búsqueda por empresa o puesto.
- Estadísticas de cabecera: total de ofertas, match medio, ofertas en proceso.
- Contenido en español, con tono directo y tuteo ("tu perfil").
- Stack existente: Next.js 16, React 19, Tailwind 4, Supabase (auth + Postgres + Storage). Un solo usuario con login.
- Pendiente de decidir: nada que afecte al producto en esta fase.

## Brand Commitments

Nombre: JobTracker. Sin identidad visual previa vinculante.

## Evidence on Hand

- Prototipo `evaluacion_ofertas_3.html` con 17 ofertas reales analizadas (empresa, puesto, score, competencias, gaps, ventajas, desventajas, investigación de empresa y fuentes). No hay testimonios, métricas de uso ni clientes: no inventarlos.

## Product Principles

1. Decidir rápido: lo que ayuda a priorizar (score, encaje, red flags) va antes que el detalle.
2. Todo veredicto es explicable: cada número se apoya en competencias y gaps visibles.
3. El usuario manda: todo campo generado es editable y nada se descarta sin confirmación.
4. Honestidad sobre lo que no se sabe: "No especificado" o "no verificado" antes que inventar.

## Accessibility & Inclusion

Sin requisitos específicos declarados. Línea base: contraste suficiente, uso completo con teclado y respeto de `prefers-reduced-motion`.
