# Food Store

Trabajo Práctico Integrador de Programación IV (TUPaD - UTN).

Food Store es una aplicación web para un negocio de comidas. Los clientes se registran, recorren el catálogo, arman un carrito y confirman pedidos con dirección y forma de pago. El administrador gestiona categorías, productos, stock, pedidos y usuarios desde un panel.

- **Repositorio:** https://github.com/AngeIrina/tpi-food-store
- **Video:** https://youtu.be/gXRO2buxC64

## Tecnologías

- **Backend:** Python 3.13, FastAPI, SQLModel, PostgreSQL, JWT en cookie HttpOnly y bcrypt.
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, Form y Table, Zustand, Axios y React Router.

## Requisitos

- Python 3.11 a 3.13
- PostgreSQL 15 o superior
- Node.js 20.19 o superior y pnpm 9 o superior

## Backend

### Instalación

```bash
cd backend
py -3.13 -m venv .venv            # en Linux/macOS: python3 -m venv .venv
source .venv/Scripts/activate     # Git Bash. PowerShell: .venv\Scripts\Activate.ps1. Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
```

### Variables de entorno

Crear una base de datos vacía en PostgreSQL (por ejemplo `foodstore_db`), copiar `backend/.env.example` como `backend/.env` y completar los valores:

- `DATABASE_URL`: conexión a la base. Ejemplo: `postgresql+psycopg2://postgres:TU_PASSWORD@localhost:5432/foodstore_db`
- `SECRET_KEY`: clave para firmar el JWT, de al menos 32 caracteres.
- `ALGORITHM`: algoritmo del JWT. Por defecto `HS256`.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: duración de la sesión en minutos. Por defecto `30`.
- `FRONTEND_ORIGIN`: origen permitido por CORS. Por defecto `http://localhost:5173`.

### Carga inicial y ejecución

```bash
python -m app.db.seed
uvicorn app.main:app --reload
```

El seed crea las tablas y carga usuarios, 5 categorías y 19 productos con stock e imagen. Se puede ejecutar varias veces sin duplicar datos.

- API: http://localhost:8000/api/v1
- Documentación: http://localhost:8000/docs y http://localhost:8000/redoc
- Pruebas manuales: `backend/foodstore.http` (extensión REST Client de VS Code), en orden y con la base recién cargada.

### Usuarios del seed

- Administrador: usuario `admin`, contraseña `Admin1234!`
- Cliente: usuario `cliente`, contraseña `Cliente1234!`

## Frontend

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm build    
pnpm dev
```

El archivo `.env` del frontend tiene una sola variable, `VITE_API_URL`, con la URL base de la API (`http://localhost:8000/api/v1`).

La aplicación queda en http://localhost:5173. El backend tiene que estar corriendo.

## Estructura

```
backend/
  app/
    core/         configuración, base de datos, seguridad, dependencias, Unit of Work y repositorio base
    modules/      auth, usuarios, categorias, productos y pedidos (router → service → unit of work → repository → models)
    db/seed.py    carga inicial idempotente
    main.py       aplicación, CORS y routers bajo /api/v1
frontend/
  src/
    features/     auth, categorias, productos, usuarios y pedidos (pages, components, hooks, api y types)
    shared/       cliente Axios, manejo de errores, componentes de UI y layout
    store/        authStore (sesión) y cartStore (carrito) con Zustand y persist
    routes/       AppRouter y ProtectedRoute
```

## Funcionalidades

**Cliente:** registro e inicio de sesión, catálogo paginado con búsqueda y filtro por categoría, carrito que se conserva al recargar, confirmación del pedido con dirección y forma de pago, historial de pedidos con detalle y cancelación mientras están pendientes.

**Administrador:** resumen del negocio, ABM de categorías y productos con cambio de stock y disponibilidad, gestión de pedidos según la máquina de estados (PENDIENTE → EN_PREPARACION → ENTREGADO, o CANCELADO) y activación o desactivación de usuarios.

**Reglas principales:** el pedido se crea en una sola transacción (si algo falla no se guarda nada ni se descuenta stock), las líneas guardan una copia del nombre y del precio, cancelar un pedido devuelve el stock, y las bajas de categorías, productos y usuarios son lógicas.
