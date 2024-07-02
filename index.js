//Para levantar el servidor con NodeJS y express:
//Primero importo express desde el módulo y debo, en el archivo "package.json", agregar una propiedad llamada "type" con el valor module para que me deje usar el import
import express from 'express';
//Modulo para leer y escribir, manipular archivos de sistemas (file sistem)
import fs from "fs";
//Midelware para la interpretacion de JSON
import bodyParser from "body-parser";


//creo el objeto 
const app = express();

app.use(bodyParser.json());

//Creo una funcion para leer los datos del archivo
const readData = () => {
    try { //agrego el try para tratar los errores y que me de una lesctura del mismo en la consola
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

//Creo una funcion para crear (escribir) los datos del archivo
const writeData = (data) => {
    try { 
        fs.writeFileSync("./db.json", JSON.stringify(data));
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

//adhesion de endpoint
app.get("/", (req, res) => {
    res.send("Bienvenido a mi primer API!!!!");
});

//creacion de endpoint
//1ro para obtener los datos
app.get("/devs", (req, res) => {
    const data = readData();
    res.json(data.devs);
});
//2do obtencion de dev por ID
app.get("/devs/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const dev = data.devs.find((dev) => dev.id === id);
    res.json(dev);
});
//3ro para crear datos 
app.post("/devs", (req, res) => {
    const data = readData();
    const body = req.body;
    const newDev = {
        id: data.devs.length + 1,
        ...body,
    };
    data.devs.push(newDev);
    writeData(data);
    res.json(newDev);
});
//4to Actualizacion de datos por ID
app.put("/devs/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const devIndex = data.devs.findIndex((dev) => dev.id === id);
    data.devs[devIndex] = {
        ...data.devs[devIndex],
        ...body,
    };
    writeData(data);
    res.json({message: "Desarrollador actualizado correctamente"});
});
//5to Borrar datos 
app.delete("/devs/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const devIndex = data.devs.findIndex((dev) => dev.id === id);
    data.devs.splice(devIndex, 1);
    writeData(data);
    res.json({message: "Desarrollador Borrado correctamente"});
});

// uso la funcion listen para escuchar y le debo pasar el puerto ej 3000 y como opcion pongo una funcion que me de un mensaje
app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});
