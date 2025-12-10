# TicketAR - Sistema de Gestión de Estacionamientos

Sistema completo para la gestión de estacionamientos con control de ingresos/egresos, tarifas dinámicas, abonos mensuales, reportes y actualizaciones en tiempo real.

## 🚀 Stack Tecnológico

### Backend
- **Framework**: NestJS 10.x (TypeScript)
- **ORM**: Prisma 5.x
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT + Passport
- **WebSockets**: Socket.IO
- **Validación**: class-validator + class-transformer
- **Reportes**: ExcelJS + CSV

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI**: TailwindCSS
- **Estado Global**: Zustand
- **Formularios**: React Hook Form
- **Routing**: React Router v6
- **Gráficos**: Recharts
- **WebSocket Client**: Socket.IO Client

## 📁 Estructura del Proyecto

```
TicketAR/
├── backend/              # API NestJS
│   ├── src/
│   │   ├── auth/         # Autenticación JWT
│   │   ├── users/        # Gestión de usuarios
│   │   ├── vehicles/     # CRUD de vehículos
│   │   ├── tickets/      # Ingreso/egreso de vehículos
│   │   ├── rates/        # Gestión de tarifas
│   │   ├── abonos/       # Abonos mensuales
│   │   ├── dashboard/    # Estadísticas y métricas
│   │   ├── reports/      # Generación de reportes
│   │   ├── realtime/     # WebSocket Gateway
│   │   ├── config/       # Configuración del sistema
│   │   └── prisma/       # Servicio Prisma
│   └── prisma/
│       ├── schema.prisma # Esquema de base de datos
│       └── seed.ts       # Datos iniciales
├── frontend/             # Aplicación React
│   └── src/
│       ├── pages/        # Páginas de la aplicación
│       ├── components/   # Componentes reutilizables
│       ├── services/     # Servicios API
│       └── store/        # Estado global (Zustand)
└── package.json          # Workspace root
```

## ⚙️ Configuración Inicial

### Prerrequisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm o yarn

### 1. Instalar Dependencias

```bash
# Instalar dependencias del workspace
npm install

# O instalar por separado
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configurar Base de Datos

```bash
cd backend

# Crear archivo .env (o copiar desde .env.example)
# Editar con tus credenciales de PostgreSQL
DATABASE_URL="postgresql://usuario:password@localhost:5432/ticketar?schema=public"
JWT_SECRET="tu-secret-key-segura"
JWT_EXPIRES_IN="24h"
PORT=3000
FRONTEND_URL="http://localhost:5173"
MAX_PARKING_SPACES=100
```

### 3. Configurar Base de Datos

```bash
cd backend

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos con datos iniciales
npm run prisma:seed
```

### 4. Iniciar Servidores

```bash
# Opción 1: Iniciar ambos simultáneamente (desde root)
npm run dev

# Opción 2: Iniciar por separado
# Terminal 1 - Backend
cd backend && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🔐 Credenciales por Defecto

Después de ejecutar el seeder, puedes usar:

- **Administrador**: 
  - Email: `admin@ticketar.com`
  - Password: `admin123`
  - Permisos: Acceso completo al sistema

- **Operador**: 
  - Email: `operador@ticketar.com`
  - Password: `operador123`
  - Permisos: Operaciones básicas (ingreso/egreso)

## ✨ Funcionalidades Implementadas

### 🔑 Autenticación y Autorización
- ✅ Login con JWT
- ✅ Roles y permisos (ADMIN / OPERATOR)
- ✅ Guards para proteger rutas
- ✅ Persistencia de sesión en localStorage
- ✅ Interceptores para manejo automático de tokens

### 🚗 Gestión de Vehículos
- ✅ Registro de vehículos (patente, tipo)
- ✅ Búsqueda por patente
- ✅ Tipos de vehículos: Auto, Moto, Camión, Otro
- ✅ Validación de patentes únicas

### 🎫 Gestión de Tickets
- ✅ **Registro de Ingreso**
  - Validación de vehículos duplicados
  - Asignación automática de timestamp
  - Registro de operador responsable
  
- ✅ **Registro de Egreso**
  - Cálculo automático de tiempo estacionado
  - Aplicación de tarifas según reglas
  - Verificación de abonos activos
  - Cálculo de monto final

- ✅ **Estados de Ticket**
  - ACTIVO: Vehículo dentro del estacionamiento
  - FINALIZADO: Egreso registrado
  - CANCELADO: Ticket cancelado

### 💰 Sistema de Tarifas Dinámicas
- ✅ **Tipos de Tarifas**
  - **Por Hora**: Cálculo por horas completas
  - **Por Fracción**: Cálculo por fracciones de tiempo (ej: 15 min)
  - **Por Estadía**: Precio fijo independiente del tiempo
  - **Mensual**: Para abonos

- ✅ **Configuración Avanzada**
  - Tarifas por día de la semana (0=Domingo, 6=Sábado)
  - Tarifas por horario (hora inicio/fin)
  - Múltiples tarifas activas simultáneamente
  - Selección automática de tarifa aplicable

### 📅 Abonos Mensuales
- ✅ Registro de abonos por vehículo
- ✅ Asociación con usuarios
- ✅ Períodos de vigencia (fecha inicio/fin)
- ✅ Validación de solapamiento de fechas
- ✅ Aplicación automática en egresos (monto = 0)

### 📊 Dashboard en Tiempo Real
- ✅ **Métricas Principales**
  - Ocupación actual del estacionamiento
  - Total de plazas disponibles
  - Porcentaje de ocupación
  - Tickets emitidos hoy
  - Ingresos del día, semana y mes

- ✅ **Visualizaciones**
  - Gráficos de ingresos (Recharts)
  - Listado de tickets recientes
  - Actualizaciones en tiempo real vía WebSockets

### 🚦 Control de Ocupación
- ✅ Monitoreo en tiempo real de vehículos dentro
- ✅ Listado de vehículos activos
- ✅ Cálculo de tiempo estacionado
- ✅ Alertas de capacidad máxima
- ✅ Actualizaciones instantáneas vía WebSockets

### 📄 Reportes y Exportación
- ✅ **Tipos de Reportes**
  - Movimientos (todos los tickets en un período)
  - Ingresos (tickets finalizados con monto)
  - Abonos (todos los abonos registrados)

- ✅ **Formatos de Exportación**
  - Excel (.xlsx) con formato estructurado
  - CSV para importación en otras herramientas

- ✅ **Filtros**
  - Rango de fechas personalizable
  - Exportación completa o por período

### 👥 Gestión de Usuarios (Solo Admin)
- ✅ CRUD completo de usuarios
- ✅ Asignación de roles
- ✅ Activación/desactivación de usuarios
- ✅ Cambio de contraseñas
- ✅ Validación de emails únicos

### ⚙️ Configuración del Sistema (Solo Admin)
- ✅ Gestión de parámetros del sistema
- ✅ Configuración de capacidad máxima
- ✅ Variables configurables vía API

### 🔄 Actualizaciones en Tiempo Real
- ✅ WebSocket Gateway (Socket.IO)
- ✅ Notificaciones de cambios en ocupación
- ✅ Actualización automática del dashboard
- ✅ Sincronización multi-usuario

## 🎨 Interfaz de Usuario

### Páginas Implementadas

1. **Login** (`/login`)
   - Formulario de autenticación
   - Manejo de errores
   - Redirección automática

2. **Dashboard** (`/`)
   - Métricas principales
   - Gráficos de ingresos
   - Tickets recientes
   - Actualización en tiempo real

3. **Ingreso/Egreso** (`/entry-exit`)
   - Registro rápido de ingresos
   - Registro de egresos con cálculo automático
   - Validación de vehículos
   - Mensajes de confirmación

4. **Vehículos Dentro** (`/vehicles-inside`)
   - Listado en tiempo real
   - Información de cada vehículo
   - Tiempo estacionado calculado
   - Operador responsable

5. **Tarifas** (`/rates`)
   - Listado de tarifas activas
   - Creación de nuevas tarifas
   - Configuración de reglas
   - Activación/desactivación

6. **Abonos** (`/abonos`)
   - Gestión de abonos mensuales
   - Asociación vehículo-usuario
   - Períodos de vigencia
   - Estado activo/inactivo

7. **Usuarios** (`/users`) - Solo Admin
   - CRUD completo
   - Gestión de roles
   - Control de acceso

8. **Reportes** (`/reports`)
   - Generación de reportes
   - Selección de formato
   - Filtros por fecha
   - Descarga directa

## 🔌 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión

### Vehículos
- `GET /vehicles` - Listar todos
- `POST /vehicles` - Crear vehículo
- `GET /vehicles/:id` - Obtener por ID
- `PATCH /vehicles/:id` - Actualizar
- `DELETE /vehicles/:id` - Eliminar

### Tickets
- `POST /tickets/entry` - Registrar ingreso
- `POST /tickets/exit` - Registrar egreso
- `GET /tickets` - Listar todos
- `GET /tickets/active` - Listar activos
- `GET /tickets/:id` - Obtener por ID

### Tarifas
- `GET /rates` - Listar activas
- `POST /rates` - Crear tarifa
- `GET /rates/:id` - Obtener por ID
- `PATCH /rates/:id` - Actualizar
- `DELETE /rates/:id` - Desactivar

### Abonos
- `GET /abonos` - Listar todos
- `GET /abonos/active` - Listar activos
- `POST /abonos` - Crear abono
- `GET /abonos/:id` - Obtener por ID
- `PATCH /abonos/:id` - Actualizar
- `DELETE /abonos/:id` - Desactivar

### Dashboard
- `GET /dashboard/stats` - Estadísticas generales
- `GET /dashboard/recent-tickets` - Tickets recientes

### Reportes
- `GET /reports/movements?startDate&endDate&format` - Movimientos
- `GET /reports/revenue?startDate&endDate&format` - Ingresos
- `GET /reports/abonos?format` - Abonos

### Usuarios (Solo Admin)
- `GET /users` - Listar todos
- `POST /users` - Crear usuario
- `GET /users/:id` - Obtener por ID
- `PATCH /users/:id` - Actualizar
- `DELETE /users/:id` - Eliminar

### Configuración (Solo Admin)
- `GET /config` - Listar configuraciones
- `POST /config` - Crear configuración
- `GET /config/:key` - Obtener por clave
- `PATCH /config/:key` - Actualizar
- `DELETE /config/:key` - Eliminar

## 📦 Scripts Disponibles

### Root
```bash
npm run dev              # Inicia backend y frontend simultáneamente
npm run install:all      # Instala dependencias de ambos proyectos
```

### Backend
```bash
npm run start:dev        # Modo desarrollo con hot-reload
npm run build            # Compilar para producción
npm run start:prod       # Ejecutar versión compilada
npm run prisma:generate  # Generar Prisma Client
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Poblar base de datos
npm run prisma:studio    # Abrir Prisma Studio (GUI)
```

### Frontend
```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build de producción
npm run lint             # Linter
```

## 🗄️ Modelo de Datos

### Entidades Principales

- **User**: Usuarios del sistema (Admin/Operador)
- **Vehicle**: Vehículos registrados
- **Ticket**: Tickets de ingreso/egreso
- **Rate**: Tarifas configurables
- **Abono**: Abonos mensuales
- **Config**: Configuraciones del sistema

### Relaciones

- User → Tickets (operador ingreso/salida)
- Vehicle → Tickets (historial)
- Vehicle → Abonos (abonos del vehículo)
- Rate → Tickets (tarifa aplicada)
- Rate → Abonos (tarifa del abono)
- User → Abonos (usuario asociado)

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de datos con class-validator
- ✅ Guards para protección de rutas
- ✅ Roles y permisos
- ✅ CORS configurado
- ✅ Sanitización de inputs

## 🚧 Próximas Mejoras Sugeridas

- [ ] Impresión de tickets en PDF
- [ ] Integración con cámaras ANPR
- [ ] Notificaciones por email
- [ ] Historial de cambios
- [ ] Backup automático
- [ ] Modo offline
- [ ] App móvil
- [ ] Integración con barreras vehiculares

## 📝 Notas

- El sistema está diseñado para ser modular y escalable
- Todas las validaciones están implementadas tanto en backend como frontend
- Los WebSockets permiten actualizaciones en tiempo real sin recargar
- Los reportes se generan server-side para mejor rendimiento
- El sistema detecta automáticamente vehículos duplicados

## 🤝 Contribución

Este es un proyecto de código abierto. Las contribuciones son bienvenidas.

## 📄 Licencia

Este proyecto es de uso privado.

---

**Desarrollado con ❤️ usando NestJS y React**
