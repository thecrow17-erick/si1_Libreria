import express from 'express';
import {userRouter, authRouter} from '../routes/index.js';
import db from '../config/db.js';
import cors from 'cors';

class server {
    constructor(){
        this.app = express();
        this.PORT = process.env.PORT
        this.path ={
            user: '/api/usuario',
            auth: '/api/auth'
        }
        //middlewares
        this.middlewares();
        //activar el server
        this.listen();
        //las rutas del servidor
        this.routes();
        //conectar la base de datos
        this.db();
    }
    //rutas
    routes(){
        //CRUD de usuarios(crear usuario, leer usuario, actualizar usuario, borrar usuario)
        this.app.use(this.path.user, userRouter);
        //autenticacion de usuarios
        this.app.use(this.path.auth, authRouter);
    }

    //middlewares
    middlewares(){
        //habilitar la carpeta publica 
        this.app.use(express.static('public'));
        
        //habilitar para los pedidos API
        this.app.use(cors());

        // habilitar los formularios 
        this.app.use(express.urlencoded({extended: true}))
        this.app.use(express.json());
    }
    //conectar db
    async db(){
        try {
            await db.authenticate();
            db.sync();
            console.log('coneccion correcta a la base de datos')
        } catch (error) {
            console.log('Ha ocurrido un error inesperado', error);            
        }
    }
    //iniciar server
    listen(){
        this.app.listen(this.PORT,  ()=>{
            console.log(`El servidor esta en el ${this.PORT}`)
        })
    }
}

export default server;