//Importacion de librerias y creacion de la instancia
const express = require('express');
const fs = require('fs');
const app = express();


//Carpeta raiz y middlewares para analizae lso datos enviados desde el formulario
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//indicamos donde se almacenaran los datos
const dataPath = './data.json';


//peticion get para indicar la raiz de los archivos
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

//crea ruta para guardar los archivos ingresado en el formulario
app.post('/save', (req, res) => {
  //crea objeto con los datos ingresados
  const { name, id, phone } = req.body;

  //se crea otro objeto con el valor de los datos ingresados
  const newData = {
    name,
    id,
    phone
  };
  //variable para los datos JSON
  let data = [];

  try {
    //leemos los datos de nuestro data.json y los parseamos a un objeto javascript
    data = JSON.parse(fs.readFileSync(dataPath));
  } catch (err) {
    console.error(err);
  }

  // añadir objetos
  data.push(newData);

  //escribimos los datos actualizados
  fs.writeFileSync(dataPath, JSON.stringify(data));

  res.redirect('/');
});

//creamos una ruta para la peticion GET, leemos el archivo data.json y se envian los datos al cliente
app.get('/data', (req, res) => {
  const data = fs.readFileSync(dataPath);
  res.send(JSON.parse(data));
});

// creacion de ruta  y funcion para la solicitud delete
app.delete('/delete-all', (req, res) => {
  fs.writeFileSync(dataPath, JSON.stringify([]));
  res.sendStatus(200);
});


// creacion de ruta  y funcion para la solicitud delete
app.delete('/delete-last', (req, res) => {
  //creacion de una variable vacia
  let data = [];

  try {
    data = JSON.parse(fs.readFileSync(dataPath));
  } catch (err) {
    console.error(err);
  }
  //se elimina el ultimo objeto del arreglo
  data.pop();

  //se sobre escribe el archivo json
  fs.writeFileSync(dataPath, JSON.stringify(data));

  res.sendStatus(200);
});

//saber si erl servidor esta ON
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});