# Hackathón — Formulario de Registro

Aplicación web para el registro de participantes a una Hackathón. Construida con React 19, Vite 7 y Tailwind CSS 4.

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm v9 o superior (incluido con Node.js)

## Instalación

Clona el repositorio e instala las dependencias:

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173`. La aplicación se recarga automáticamente al guardar cambios.

## Compilar para producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `dist/`.

## Vista previa del build de producción

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Tecnologías utilizadas

| Tecnología | Versión |
|---|---|
| React | 19 |
| Vite | 7 |
| Tailwind CSS | 4 |
| PostCSS | 8 |

## Funcionalidades del formulario

- Campos: Nombres, Apellidos, Nro. de C.I., Lugar de expedición, Nro. de Celular, Dirección, Usuario de GitHub y Fecha de nacimiento
- Validación de edad: solo pueden registrarse desarrolladores **menores de 30 años**
- Integración con la API pública de GitHub para listar repositorios públicos del usuario
- Selección de hasta **2 repositorios** para enviar con la postulación
- Modo oscuro / claro con toggle
- Diseño responsivo

## Notas

> Este prototipo es para evaluación en el proceso de selección. No existe relación directa entre el Banco y la Universidad del Rosario de Colombia. La Hackathon es solo ilustrativa.
