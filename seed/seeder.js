import {argv,exit} from "node:process"
import {roles} from './roles.js';
import {Rol} from "../models/index.js"
import db from "../config/db.js";
const importarDatos = async () =>{
    try {
        //autenticar    
        await db.authenticate();
        //generar columnas
        await db.sync();
        //insertemos los datos
        
        //await categoria.bulkCreate(categorias);
        //await precio.bulkCreate(precios);
        await Rol.bulkCreate(roles),
        console.log('Datos importados correctamente')
        exit();
    } catch (error) {
        console.log(error)
        exit(1);
    }
}


if(argv[2] === "-i"){
    importarDatos();
}
