import express from 'express';
import {userRouter, authRouter,libroRouter} from '../routes/index.js';
import db from '../config/db.js';
import cors from 'cors';
import fileupload from 'express-fileupload';

class server {
    constructor(){
        this.app = express();
        this.PORT = process.env.PORT
        this.path ={
            user: '/api/usuario',
            auth: '/api/auth',
            libros: '/api/libro',
            ventas: '/api/venta'
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
        //CRUD libros
        this.app.use(this.path.libros, libroRouter);
        //ventas de libros
        //this.app.use(this.path.ventas, ventaRouter);
    }

    //middlewares
    middlewares(){
        //habilitar para subir archivos 
        this.app.use(fileupload({
            useTempFiles : true,
            tempFileDir : './tmp/'
        }));
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