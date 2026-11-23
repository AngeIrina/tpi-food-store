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
    "Hamburguesas": "Hamburguesas caseras con papas",
    "Pizzas": "Pizzas a la piedra",
    "Bebidas": "Gaseosas, aguas y jugos",
    "Postres": "Dulces para cerrar la comida",
}

PRODUCTOS = [
    ("Hamburguesas", "Hamburguesa clásica", "Carne, lechuga, tomate y queso", 7500, 30),
    (
        "Hamburguesas",
        "Hamburguesa doble cheddar",
        "Doble carne y doble cheddar",
        9800,
        25,
    ),
    (
        "Hamburguesas",
        "Hamburguesa veggie",
        "Medallón de lentejas y vegetales",
        8200,
        15,
    ),
    ("Pizzas", "Pizza muzzarella", "Salsa de tomate, muzzarella y orégano", 9000, 20),
    ("Pizzas", "Pizza napolitana", "Muzzarella, tomate en rodajas y ajo", 10500, 20),
    ("Pizzas", "Pizza fugazzeta", "Muzzarella y cebolla", 10000, 12),
    ("Bebidas", "Coca-Cola 500 ml", "Gaseosa sabor cola", 2200, 60),
    ("Bebidas", "Agua mineral 500 ml", "Agua sin gas", 1500, 60),
    ("Bebidas", "Limonada 1 L", "Limonada casera con menta y jengibre", 3500, 15),
    ("Postres", "Flan casero", "Con dulce de leche", 3800, 10),
    ("Postres", "Brownie con helado", "Brownie tibio con helado de crema", 5200, 8),
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

        for categoria, nombre, descripcion, precio, stock in PRODUCTOS:
            existe = session.exec(
                select(Producto).where(Producto.nombre == nombre)
            ).first()
            if existe is None:
                session.add(
                    Producto(
                        categoria_id=categorias[categoria].id,
                        nombre=nombre,
                        descripcion=descripcion,
                        precio_base=precio,
                        stock=stock,
                    )
                )

    print("Seed cargado: usuarios admin y cliente, categorías y productos.")


if __name__ == "__main__":
    run()
