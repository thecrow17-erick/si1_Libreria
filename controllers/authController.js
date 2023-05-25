import {request,response} from 'express';
import { Usuario } from '../models/index.js';
import { generarJWT } from '../helpers/generarJwt.js';

const login = async(req = request, res = response)=>{
    const {correo,password} = req.body;
    try {
        const user = await Usuario.findOne({where: {correo}});
        if(!user){
            return res.status(400).json({
                autenticado: false,
                msg: "El usuario no existe"
            })
        }
        
        if(!user.estado){
            return res.status(400).json({
                autenticado: false,
                msg: "El usuario no esta en el sistema"
            })
        }
        //verificar contraseña
        const validarPassword = user.verificarPassword(password);
        if(!validarPassword){
            return res.status(401).json({
                msg: "La contraseña es incorrecta, intente de nuevo"
            })
        }
        //genera jwt
        const token = await generarJWT({
            id: user.id,
            rolId: user.Id
        })
        return res.status(200).json({
            autenticado: true,
            msg: "ok Login",
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            autenticado: false,
            msg: 'Algo salio mal'
        })
    }
}

export {
    login
}