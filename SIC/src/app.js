import express from "express";
import {config} from "./config/config.js";
import { connectDB } from "./config/dbConexion.js";
import { engine } from 'express-handlebars';
import path from "path";
import {__dirname} from "./utils.js";
import { Server } from "socket.io";
import { chatModel } from "./dao/models/chat.model.js";
import passport from "passport";
import session from "express-session";
import { initializePassport } from "./config/passport.config.js";
import MongoStore from "connect-mongo";
import {transporter, adminEmail} from "./config/email.js";
import {twilioClient, twilioPhone} from "./config/twilio.js";


import { productsRouter } from "./routes/products.routes.js";
// import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { sessionsRouter } from "./routes/sessions.routes.js";

const port = config.server.port;
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));

//servidor de express
const httpServer = app.listen(port, () =>
  console.log(`El servidor esta escuchando en el puerto ${port}`)
);

//servidor de websocket
const socketServer = new Server(httpServer);

//socket server
io.on("connection",(socket)=>{
  console.log("nuevo cliente conectado");

  socket.on("authenticated",async(msg)=>{
      const messages = await chatModel.find();
      socket.emit("messageHistory", messages);
      socket.broadcast.emit("newUser", msg);
  });

  //recibir el mensaje del cliente
  socket.on("message",async(data)=>{
      console.log("data", data);
      const messageCreated = await chatModel.create(data);
      const messages = await chatModel.find();
      //cada vez que recibamos este mensaje, enviamos todos los mensajes actualizados a todos los clientes conectados
      io.emit("messageHistory", messages);
  })
});

//Conexion DB
connectDB();

app.use(express.static(path.join(__dirname, "/public")));

const producService = new productsFile("./products.json");

//configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,"/views"));

//configuracion de session
app.use(session({
  store:MongoStore.create({
      mongoUrl:config.mongo.url
  }),
  secret:config.server.secretSession,
  resave:true,
  saveUninitialized:true
}));

//configuracion de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


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

//Routes
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


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

app.listen(port,()=>console.log(`Servidor ejecutando en el puerto ${port}`));


//Crear el contenido del correo o cuerpo del mensaje
const emailTemplate = `
    <div>
        <h1>Bienvenido!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="https://www.google.com/">Explorar</a>
    </div>
`;

//Agregar la estructura del correo

const userEmail = "CORREO CLIENTE";
//Endpoint para enviar el correo
app.post("/send-emailCoder", async(req,res)=>{
    try {
        const info = await transporter.sendMail({
            from:"Eccomerce pepito",
            to:userEmail, //correo del destinatario puede ser cualquiera.
            subject:"Correo para restablecer contraseña",
            html:emailTemplate
        });
        console.log(info);
        res.json({status:"success", message:`Correo enviado a ${userEmail} exitosamente`});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error", message:"El correo no se pudo enviar"});
    }
});


//correo con imagenes
const emailTemplateImages = `
    <div>
        <h1>Bienvenido!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="https://www.google.com/">Explorar</a>
        <p>imagen cargada desde archivo</p>
        <img src="cid:gatoCoder"/>
    </div>
`;

app.post("/send-emailImages", async(req,res)=>{
    try {
        const info = await transporter.sendMail({
            from:"Eccomerce pepito",
            to:userEmail, //correo del destinatario puede ser cualquiera.
            subject:"Correo para restablecer contraseña",
            html:emailTemplate,
            attachments:[
                {
                    filename:"gato.jpg",
                    path:path.join(__dirname,"/images/gato.jpg"),
                    cid:"gatoCoder"
                }
            ]
        });
        console.log(info);
        res.json({status:"success", message:`Correo enviado a ${userEmail} exitosamente`});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error", message:"El correo no se pudo enviar"});
    }
});

const clientPhone = "+PHONE CLIENTE";
//Ruta para envio de sms
app.post("/sms-twilio", async(req,res)=>{
    try {
        //logica de finalizacion de la compra, y registo en db.
        const info = await twilioClient.messages.create({
            body:"Tu registro fue exitoso",
            from:twilioPhone,
            to:clientPhone
        });
        console.log(info);
        res.json({status:"success", message:"Registro exitoso y sms enviado"});
    } catch (error) {
        console.log(error.message);
        res.json({status:"error", message:"El sms no se pudo enviar"});
    }
});