# 🍽️ Sistema de Gestión de Comandas para Restaurantes
### Proyecto de Fin de Grado — Antonio José Pérez

## 📌 Descripción del Proyecto
Este proyecto consiste en el desarrollo de una aplicación web orientada a la **gestión integral de comandas en un restaurante**, optimizando la operativa entre camareros, cocina, barra y administración mediante tecnologías modernas y escalables. Está diseñado para funcionar en tiempo real y ser extensible.

El sistema permite a los camareros registrar pedidos desde sus dispositivos móviles o tablets, enviar automáticamente las bebidas a la pantalla de barra y los platos a la pantalla de cocina, controlar el estado de las mesas, generar facturas simplificadas y gestionar pagos, incluso con tarjeta. Además, incluye un sistema de roles (administrador, encargado, camarero) para definir permisos de acciones como eliminar productos o crear nuevos.

## 🧱 Tecnologías utilizadas

### 🔧 Backend
- **Node.js + Express.js** – Para el desarrollo del servidor y API REST.
- **MongoDB + Mongoose** – Base de datos NoSQL para modelado flexible de documentos.
- **Socket.IO** – Para la sincronización en tiempo real entre dispositivos.
- **JWT (JSON Web Tokens)** – Para la autenticación de usuarios con diferentes roles.
- **Docker** – Contenedorización del backend y servicios para despliegue sencillo.

### 🎨 Frontend
- **React (con Vite)** – SPA moderna, rápida y eficiente.
- **Tailwind CSS** – Framework CSS para diseño rápido y limpio.
- **React Context** – Gestión de estado entre componentes según la escala.

## 🧩 Estructura Lógica y Funcionalidades

### 🎯 Funciones clave

#### ✅ Camareros
- Añadir bebidas y comidas a una mesa (comanda).
- Ver en tiempo real los cambios en otras mesas.
- Mover comandas de una mesa a otra.
- Ver el total de la cuenta (factura simplificada).

#### ✅ Encargado
- Eliminar productos de una comanda (acciones restringidas).
- Supervisar el estado de todas las mesas.

#### ✅ Administrador
- Añadir nuevas bebidas y comidas.
- Gestionar categorías de productos (copas, carnes, cocktails...).
- Controlar todo el sistema desde un panel general.

### 🔁 Flujo de la comanda

1. El camarero selecciona una mesa y añade productos.
2. Se crea una comanda que se guarda en la base de datos.
3. Socket.IO emite a todos los dispositivos el cambio.
4. La comanda se refleja en la vista Window y es aceptada por un usuario.
5. Cuando el cliente pide la cuenta, se genera una factura simplificada.

## 🧠 Diseño lógico de base de datos

### 📦 Entidades principales:

- **Usuarios**: con roles (administrador, encargado, camarero).
- **Mesas**: con estado (`libre`, `ocupada`, `cerrada`).
- **Productos**: clasificados por tipo y subcategoría.
- **Comandas**: colección de productos con timestamps, impresiones, mesa asociada.
- **Facturas**: resumen final de lo consumido, vinculada a la mesa y comanda.
- **Historial de acciones**: para registrar cambios como productos eliminados.

> Nota: se ha eliminado la gestión de `stock` y `fecha de creación` en productos por ser innecesarios en este contexto.

## 🔄 Arquitectura y flujo en tiempo real

```plaintext
Camarero (React)
     ↓
Socket.IO (emit)
     ↓
Backend (Node.js)
     ↓
Base de datos (MongoDB)
```

## 🔐 Seguridad

- **Autenticación con JWT**.
- **Control de permisos por rol**.
- **Validación de entrada con middlewares**.
- **Registros de acciones sensibles** (ej: eliminar productos de comandas).

## 📂 Estructura del proyecto (backend)

```
src/
├── config/           # Conexión MongoDB, Redis, etc.
├── controllers/      # Lógica de cada entidad
├── models/           # Esquemas de Mongoose
├── routes/           # Definición de rutas REST
├── services/         # Lógica de impresión, colas, pagos
├── middlewares/      # Autenticación y validaciones
├── sockets/          # Lógica WebSocket con Socket.IO
├── queues/           # Configuración BullMQ
├── app.js            # Config principal Express
└── server.js         # Arranque y socket setup
```

## 🌐 Despliegue

- Compatible con Docker.
