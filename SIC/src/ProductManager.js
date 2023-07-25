import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [
      {
        id: "1",
        title: "Expreso americano",
        categoria: "Tradicional",
        descripcion:
          "Café tradicional hecho con agua caliente y granos molidos",
        precio: 4500,
        img: "americano.jpg",
      },
      {
        id: "2",
        name: "Expreso Tradicional",
        categoria: "Tradicional",
        descripcion: "Espreso diluido, menos intenso que el tradicional",
        precio: 4500,
        img: "tradicional.jpg",
      },
      {
        id: "3",
        name: "Expreso Cremoso",
        categoria: "Tradicional",
        descripcion: "Espreso diluido, menos intenso que el tradicional",
        precio: 4500,
        img: "cremoso.jpg",
      },
      {
        id: "4",
        name: "Expreso Helado",
        categoria: "Tradicional, helado",
        descripcion: "Bebida preparada con café espresso y cubitos de hielo",
        precio: 4900,
        img: "helado.jpg",
      },
      {
        id: "5",
        name: "Cafe con leche",
        categoria: "Tradicional, con leche",
        descripcion: "Espreso mitad y mitad tradicional con leche al vapor",
        precio: 4900,
        img: "leche.jpg",
      },
      {
        id: "6",
        name: "Latte",
        categoria: "Tradicional, con leche",
        descripcion:
          "Un shot de espresso con el doble de leche y espuma cremosa",
        precio: 4900,
        img: "latte.jpg",
      },
      {
        id: "7",
        name: "Capuccino",
        categoria: "Tradicional, con leche",
        descripcion:
          "Bebida de canela elaborada a partir de dosis iguales de café, leche y espuma",
        precio: 5200,
        img: "capuccino.jpg",
      },
      {
        id: "8",
        name: "Macchiato",
        categoria: "Tradicional, con leche",
        descripcion:
          "Café espresso mezclado con un poco de leche caliente y espuma",
        precio: 5400,
        img: "macchiato.jpg",
      },
      {
        id: "9",
        name: "Mocaccino",
        categoria: "Tradicional, con leche",
        descripcion: "Café espreso con chocolate, un poco de leche y espuma",
        precio: 5400,
        img: "mocaccino.jpg",
      },
      {
        id: "10",
        name: "Chocolate caliente",
        categoria: "Tradicional, con leche",
        descripcion:
          "Bebida elaborada con chocolate disuelto en leche caliente y café",
        precio: 4400,
        img: "chocolate.jpg",
      },
      {
        id: "11",
        name: "Cubano",
        categoria: "Especial, Alcohol, Helado",
        descripcion: "Bebida espresso helada con ron, nata y menta",
        precio: 4400,
        img: "cubano.jpg",
      },
      {
        id: "12",
        name: "Hawaiano",
        categoria: "Especial",
        descripcion: "Bebida dulce preparada con café y leche de coco",
        precio: 5400,
        img: "hawaiano.jpg",
      },
      {
        id: "13",
        name: "Árabe",
        categoria: "Especial",
        descripcion: "Bebida preparada con granos de café árabe y especias",
        precio: 4500,
        img: "arabe.jpg",
      },
      {
        id: "14",
        name: "Irlandes",
        categoria: "Especial, Alcohol",
        descripcion:
          "Bebida a base de café, whisky irlandés, azúcar y nata montada",
        precio: 5500,
        img: "irlandes.jpg",
      },
    ];
    this.lastProductId = 0; // Variable para almacenar el último id utilizado
  }

  getProducts() {
    return this.products;
  }

  addProduct(product) {
    const newProduct = {
      id: (++this.lastProductId).toString(), // Incrementar el lastProductId y convertirlo a string
      ...product,
    };

    this.products.push(newProduct);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      throw new Error("No se encontró el producto.");
    }

    return product;
  }

  updateProduct(id, newData) {
    const product = this.getProductById(id);
    Object.assign(product, newData);
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) {
      throw new Error("No se encontró el producto.");
    }

    this.products.splice(index, 1);
  }
}

const manager = new ProductManager("/ruta/ejemplo");

// Llamar a getProducts
console.log(manager.getProducts());

// Agregar un nuevo producto
try {
  manager.addProduct({
    name: "nombre",
    categoria: "categoria",
    descripcion: "descripcion",
    precio: 4500,
    img: "imagen del producto",
  });
  console.log("Producto agregado con éxito.");
} catch (error) {
  console.log("Error al agregar el producto:", error.message);
}

// Llamar a getProducts nuevamente (debe mostrar el producto recién agregado)
console.log(manager.getProducts());

// Intentar agregar un producto con el mismo id (debe arrojar un error)
try {
  manager.addProduct({
    id: "1",
    name: "nombre",
    categoria: "categoria",
    descripcion: "descripcion",
    precio: 4500,
    img: "tradicional",
  });
  console.log("Producto agregado con éxito.");
} catch (error) {
  console.log("Error al agregar el producto:", error.message);
}

// Probar getProductById con un id válido
try {
  const product = manager.getProductById("1");
  console.log("Producto encontrado:", product);
} catch (error) {
  console.log("Error al obtener el producto:", error.message);
}

// Probar getProductById con un id no existente
try {
  const product = manager.getProductById("99");
  console.log("Producto encontrado:", product);
} catch (error) {
  console.log("Error al obtener el producto:", error.message);
}

// Actualizar un producto existente
try {
  manager.updateProduct("1", { name: "nuevo nombre", precio: 5000 });
  console.log("Producto actualizado con éxito.");
} catch (error) {
  console.log("Error al actualizar el producto:", error.message);
}

// Eliminar un producto existente
try {
  manager.deleteProduct("1");
  console.log("Producto eliminado con éxito.");
} catch (error) {
  console.log("Error al eliminar el producto:", error.message);
}
