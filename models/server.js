import express from 'express';
import userRoutes from '../routes/userRouter.js';

class server {
    constructor(){
        this.app = express();
        this.PORT = process.env.PORT
        this.path ={
            user: '/user'
        }
        this.listen();
        this.routes();
        this.middlewares();
    }
    //rutas
    routes(){
        this.app.use(this.path.user, userRoutes);
    }

    //middlewares
    middlewares(){
        //habilitar pugs
        this.app.set('view engine', 'pug');
        this.app.set('views','./views');
    }
    //iniciar server
    listen(){
        this.app.listen(this.PORT,  ()=>{
            console.log(`El servidor esta en el ${this.PORT}`)
        })
    }
    
}

export default server;