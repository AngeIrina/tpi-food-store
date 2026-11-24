from sqlmodel import select

from app.core.database import create_all_tables
from app.core.security import hash_password
from app.core.unit_of_work import UnitOfWork
from app.db.models import Categoria, Producto, Usuario

USUARIOS = [
    {
        "username": "admin",
        "full_name": "Administrador",
        "email": "admin@foodstore.com",
        "password": "Admin1234!",
        "role": "admin",
    },
    {
        "username": "cliente",
        "full_name": "Cliente de Prueba",
        "email": "cliente@foodstore.com",
        "password": "Cliente1234!",
        "role": "user",
    },
]

CATEGORIAS = {
    "Hamburguesas": "Hamburguesas artesanales con carne premium",
    "Pizzas": "Pizzas al horno de barro",
    "Empanadas": "Empanadas caseras horneadas",
    "Bebidas": "Bebidas frías y calientes",
    "Papas Fritas": "Acompañamientos crujientes",
}

PRODUCTOS = [
    {
        "categoria": "Hamburguesas",
        "nombre": "Hamburguesa Clásica",
        "descripcion": "Carne 150g, lechuga, tomate, cebolla morada y mayonesa",
        "precio_base": 4500,
        "stock": 50,
        "disponible": True,
        "imagen_url": "/assets/productos/hamburguesa-clasica.jpg",
    },
    {
        "categoria": "Hamburguesas",
        "nombre": "Hamburguesa Doble",
        "descripcion": "Doble carne 150g c/u, cheddar, panceta y salsa barbacoa",
        "precio_base": 6200,
        "stock": 40,
        "disponible": True,
        "imagen_url": "/assets/productos/hamburguesa-doble.jpg",
    },
    {
        "categoria": "Hamburguesas",
        "nombre": "Hamburguesa Completa",
        "descripcion": "Carne 150g, huevo, jamón, queso, lechuga y tomate",
        "precio_base": 5500,
        "stock": 30,
        "disponible": True,
        "imagen_url": "/assets/productos/hamburguesa-completa.jpg",
    },
    {
        "categoria": "Hamburguesas",
        "nombre": "Hamburguesa Veggie",
        "descripcion": "Medallón de lentejas y quinoa, rúcula, tomate confitado y hummus",
        "precio_base": 5000,
        "stock": 20,
        "disponible": True,
        "imagen_url": "/assets/productos/hamburguesa-veggie.jpg",
    },
    {
        "categoria": "Pizzas",
        "nombre": "Pizza Mozzarella",
        "descripcion": "Mozzarella, salsa de tomate y orégano",
        "precio_base": 3800,
        "stock": 25,
        "disponible": True,
        "imagen_url": "/assets/productos/pizza-mozzarella.jpg",
    },
    {
        "categoria": "Pizzas",
        "nombre": "Pizza Napolitana",
        "descripcion": "Mozzarella, rodajas de tomate, ajo, aceitunas y albahaca",
        "precio_base": 4500,
        "stock": 25,
        "disponible": True,
        "imagen_url": "/assets/productos/pizza-napolitana.jpg",
    },
    {
        "categoria": "Pizzas",
        "nombre": "Pizza Fugazzeta",
        "descripcion": "Mozzarella, cebolla caramelizada, jamón y aceitunas",
        "precio_base": 4800,
        "stock": 20,
        "disponible": True,
        "imagen_url": "/assets/productos/pizza-fugazzeta.jpg",
    },
    {
        "categoria": "Pizzas",
        "nombre": "Pizza Especial",
        "descripcion": "Mozzarella, pepperoni, morrón, cebolla, huevo y aceitunas",
        "precio_base": 5200,
        "stock": 15,
        "disponible": True,
        "imagen_url": "/assets/productos/pizza-especial.jpg",
    },
    {
        "categoria": "Empanadas",
        "nombre": "Empanada de Carne",
        "descripcion": "Carne picada, cebolla, huevo duro, aceitunas y especias",
        "precio_base": 1200,
        "stock": 100,
        "disponible": True,
        "imagen_url": "/assets/productos/empanada-de-carne.jpg",
    },
    {
        "categoria": "Empanadas",
        "nombre": "Empanada de Pollo",
        "descripcion": "Pollo desmenuzado, cebolla, morrón y crema",
        "precio_base": 1200,
        "stock": 80,
        "disponible": True,
        "imagen_url": "/assets/productos/empanada-de-pollo.jpg",
    },
    {
        "categoria": "Empanadas",
        "nombre": "Empanada Jamón y Queso",
        "descripcion": "Jamón cocido y mozzarella",
        "precio_base": 1100,
        "stock": 90,
        "disponible": False,
        "imagen_url": "/assets/productos/empanada-jamon-y-queso.jpg",
    },
    {
        "categoria": "Empanadas",
        "nombre": "Empanada de Verdura",
        "descripcion": "Espinaca, acelga, ricota y nuez moscada",
        "precio_base": 1100,
        "stock": 60,
        "disponible": True,
        "imagen_url": "/assets/productos/empanada-de-verdura.jpg",
    },
    {
        "categoria": "Bebidas",
        "nombre": "Coca-Cola 500ml",
        "descripcion": "Gaseosa Coca-Cola original 500ml",
        "precio_base": 1500,
        "stock": 200,
        "disponible": True,
        "imagen_url": "/assets/productos/coca-cola-500ml.jpg",
    },
    {
        "categoria": "Bebidas",
        "nombre": "Sprite 500ml",
        "descripcion": "Gaseosa Sprite 500ml",
        "precio_base": 1500,
        "stock": 180,
        "disponible": True,
        "imagen_url": "/assets/productos/sprite-500ml.jpg",
    },
    {
        "categoria": "Bebidas",
        "nombre": "Agua Mineral 500ml",
        "descripcion": "Agua mineral sin gas 500ml",
        "precio_base": 1000,
        "stock": 300,
        "disponible": True,
        "imagen_url": "/assets/productos/agua-mineral-500ml.jpg",
    },
    {
        "categoria": "Bebidas",
        "nombre": "Cerveza Artesanal 473ml",
        "descripcion": "Cerveza artesanal rubia 473ml",
        "precio_base": 2500,
        "stock": 100,
        "disponible": True,
        "imagen_url": "/assets/productos/cerveza-artesanal-473ml.jpg",
    },
    {
        "categoria": "Papas Fritas",
        "nombre": "Papas Fritas Clásicas",
        "descripcion": "Papas fritas bastón crocantes con sal parrillera",
        "precio_base": 2500,
        "stock": 70,
        "disponible": True,
        "imagen_url": "/assets/productos/papas-fritas-clasicas.jpg",
    },
    {
        "categoria": "Papas Fritas",
        "nombre": "Papas con Cheddar y Panceta",
        "descripcion": "Papas fritas bañadas en cheddar y panceta crocante",
        "precio_base": 3500,
        "stock": 50,
        "disponible": True,
        "imagen_url": "/assets/productos/papas-con-cheddar-y-panceta.jpg",
    },
    {
        "categoria": "Papas Fritas",
        "nombre": "Aros de Cebolla",
        "descripcion": "Aros de cebolla empanizados, servidos con salsa barbacoa",
        "precio_base": 2800,
        "stock": 40,
        "disponible": True,
        "imagen_url": "/assets/productos/aros-de-cebolla.jpg",
    },
]


def run() -> None:
    create_all_tables()
    with UnitOfWork() as uow:
        session = uow.session

        for datos in USUARIOS:
            existe = session.exec(
                select(Usuario).where(Usuario.username == datos["username"])
            ).first()
            if existe is None:
                session.add(
                    Usuario(
                        username=datos["username"],
                        full_name=datos["full_name"],
                        email=datos["email"],
                        hashed_password=hash_password(datos["password"]),
                        role=datos["role"],
                    )
                )

        categorias: dict[str, Categoria] = {}
        for nombre, descripcion in CATEGORIAS.items():
            categoria = session.exec(
                select(Categoria).where(Categoria.nombre == nombre)
            ).first()
            if categoria is None:
                categoria = Categoria(nombre=nombre, descripcion=descripcion)
                session.add(categoria)
                session.flush()
            categorias[nombre] = categoria

        for datos in PRODUCTOS:
            producto = session.exec(
                select(Producto).where(Producto.nombre == datos["nombre"])
            ).first()
            if producto is None:
                session.add(
                    Producto(
                        categoria_id=categorias[datos["categoria"]].id,
                        nombre=datos["nombre"],
                        descripcion=datos["descripcion"],
                        precio_base=datos["precio_base"],
                        stock=datos["stock"],
                        disponible=datos["disponible"],
                        imagen_url=datos["imagen_url"],
                    )
                )
            elif producto.imagen_url is None:
                producto.imagen_url = datos["imagen_url"]

    print(
        "Seed cargado: usuarios admin y cliente, categorías y productos con imágenes."
    )


if __name__ == "__main__":
    run()
