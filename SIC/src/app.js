import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./utils.js";
import { ProductManager } from "./productManager.js";
import path, { dirname } from "path";
import { Server } from "socket.io";

import { viewsRouter } from "./routes/views.routes.js";
import { Socket } from "dgram";

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/views")));

const httpServer = app.listen(port, () =>
  console.log(`El servidor esta escuchando en el puerto ${port}`)
);

app.use(express.static(path.join(__dirname, "/public")));

const producService = new ProductManager("./products.json");

//Configuracion de Handlebars
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

const socketServer = new Server(httpServer);

let productos = [
  "Americano",
  "Arabe",
  "Capuchino",
  "Chocolate",
  "Cremoso",
  "Cubano",
  "Hawaiano",
  "Helado",
  "Irlandes",
  "Latte",
  "Leche",
  "Macchiato",
  "Mocaccino",
  "Tradicional",
];

app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

socketServer.on("connection", (socketConnected) => {
  console.log(`Cliente conectado ${socketConnected.id}`);

  socketConnected.emit('updateProducts', productos);

  socketConnected.on("InventarioEvent", (data) => {
    console.log(`verificacion de inventario: ${data}`);
  });

  socketConnected.on('createProduct', (newProduct) => {
    productos.push(newProduct);
    socketServer.emit('updateProducts', productos);
  });

  socketConnected.on('deleteProduct', (productToDelete) => {
    productos = products.filter(product => product !== productToDelete);
    socketServer.emit('updateProducts', productos);
  });

  socketConnected.on("disconnect", () => {
    console.log(`Cliente desconectado ${socketConnected.id}`);
  });
});

app.use(viewsRouter);

const products = [
  {
    id: 1,
    name: "Expreso americano",
    categoria: "Tradicional",
    descripcion: "Café tradicional hecho con agua caliente y granos molidos",
    precio: 4500,
    stock: 10,
    img: "americano.jpg",
  },
  {
    id: 2,
    name: "Expreso Tradicional",
    categoria: "Tradicional",
    descripcion: "Espreso diluido, menos intenso que el tradicional",
    precio: 4500,
    stock: 10,
    img: "tradicional.jpg",
  },
  {
    id: 3,
    name: "Expreso Cremoso",
    categoria: "Tradicional",
    descripcion: "Espreso diluido, menos intenso que el tradicional",
    precio: 4500,
    stock: 10,
    img: "cremoso.jpg",
  },
  {
    id: 4,
    name: "Expreso Helado",
    categoria: "Tradicional, helado",
    descripcion: "Bebida preparada con café espresso y cubitos de hielo",
    precio: 4900,
    stock: 10,
    img: "helado.jpg",
  },
  {
    id: 5,
    name: "Cafe con leche",
    categoria: "Tradicional, con leche",
    descripcion: "Espreso mitad y mitad tradicional con leche al vapor",
    precio: 4900,
    stock: 10,
    img: "leche.jpg",
  },
  {
    id: 6,
    name: "Latte",
    categoria: "Tradicional, con leche",
    descripcion: "Un shot de espresso con el doble de leche y espuma cremosa",
    precio: 4900,
    stock: 10,
    img: "latte.jpg",
  },
  {
    id: 7,
    name: "Capuccino",
    categoria: "Tradicional, con leche",
    descripcion:
      "Bebida de canela elaborada a partir de dosis iguales de café, leche y espuma",
    precio: 5200,
    stock: 10,
    img: "capuccino.jpg",
  },
  {
    id: 8,
    name: "Macchiato",
    categoria: "Tradicional, con leche",
    descripcion:
      "Café espresso mezclado con un poco de leche caliente y espuma",
    precio: 5400,
    stock: 10,
    img: "macchiato.jpg",
  },
  {
    id: 9,
    name: "Mocaccino",
    categoria: "Tradicional, con leche",
    descripcion: "Café espreso con chocolate, un poco de leche y espuma",
    precio: 5400,
    stock: 10,
    img: "mocaccino.jpg",
  },
  {
    id: 10,
    name: "Chocolate caliente",
    categoria: "Tradicional, con leche",
    descripcion:
      "Bebida elaborada con chocolate disuelto en leche caliente y café",
    precio: 4400,
    stock: 10,
    img: "chocolate.jpg",
  },
  {
    id: 11,
    name: "Cubano",
    categoria: "Especial, Alcohol, Helado",
    descripcion: "Bebida espresso helada con ron, nata y menta",
    precio: 4400,
    stock: 10,
    img: "cubano.jpg",
  },
  {
    id: 12,
    name: "Hawaiano",
    categoria: "Especial",
    descripcion: "Bebida dulce preparada con café y leche de coco",
    precio: 5400,
    stock: 10,
    img: "hawaiano.jpg",
  },
  {
    id: 13,
    name: "Árabe",
    categoria: "Especial",
    descripcion: "Bebida preparada con granos de café árabe y especias",
    precio: 4500,
    stock: 10,
    img: "arabe.jpg",
  },
  {
    id: 14,
    name: "Irlandes",
    categoria: "Especial, Alcohol",
    descripcion:
      "Bebida a base de café, whisky irlandés, azúcar y nata montada",
    precio: 5500,
    stock: 10,
    img: "irlandes.jpg",
  },
];

app.get("/productos", (req, res) => {
  res.send(products);
});

//Peticiones

//http://localhost:8080/productos/1
app.get("/productos/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);
  const product = products.find((elm) => elm.id === productId);
  if (!product) {
    res.send("El usuario no existe");
  } else {
    res.send(product);
  }
});

app.post("/productos", (req, res) => {
  const product = req.body;
  products.push(product);
  res.send("usuario creado");
});

app.put("/productos/:Id", (req, res) => {
  const itemId = req.params.Id;
  const newProduct = req.body;
  const productIndex = products.findIndex((elm) => elm.id === itemId);
  if (productIndex >= 0) {
    products[productIndex] = newProduct;
    res.json({ status: "success", message: "Usuario actualizado" });
  } else {
    res.status(404).json({ status: "error", message: "El usuario no existe" });
  }
});

app.delete("/productos/:Id", (req, res) => {
  const itemId = req.params.Id;
  const product = products.find((product) => product.id === itemId);
  if (product) {
    const newProducts = products.filter((product) => product.id !== itemId);
    products = newProducts;

    socketServer.emit("productos", products);

    res.json({ estatus: "success", message: "producto eliminado" });
  } else {
    res.status(404).json({ status: "error", message: "el producto no existe" });
  }
});

