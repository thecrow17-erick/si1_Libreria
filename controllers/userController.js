import {request,response} from 'express';
import {Rol, Usuario} from '../models/index.js';


//mostrar todos los usuarios - totales - paginado
const getUsuarios = async(req = request,res= response)=>{
    let { limit = 10, offset = 0} = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const [total , usuarios] = await Promise.all([
        Usuario.count({where: {estado: true}}),
        Usuario.findAll({limit: limit,
            offset: offset,
            attributes: ['id', 'nombre', 'correo','telefono'],
            include: {
                model: Rol,
                attributes: ['id', 'nombre']
            },
            where: {estado: true}})
    ]); 
    return res.status(200).json({
        total,
        usuarios
    });
}

//muestra el usuario por id
const getUsuario = async(req = request,res= response)=>{
    const {id} = req.params

    try {
        const usuarioDB = await Usuario.findByPk(id,{
            attributes: ['id','nombre','correo','telefono'],
            include: {
                model: Rol,
                attributes: ['id', 'nombre']
            }
        });
        res.status(200).json({
            usuario: usuarioDB,
            msg: 'Se ha mostrado el usuario correctamente'
        })
        
    } catch (error) {
        console.log('Ha ocurrido un error inesperado', error);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        })
    }
    

}

//decifra los datos del toke
const getToken = async(req = request, res = response)=>{
    const {usuario} = req;
    res.status(200).json({
        usuario,
        msg: 'Se ha decifrado el token correctamente'
    })
}
//crear usuario - privado(aun no implementado)
const postUsuarios = async (req = request,res= response)=>{
    const {nombre, correo, password, telefono, rolId} = req.body;
    const usuarioDB = await Usuario.findOne({where: {nombre } || {correo}});
    if(usuarioDB){
        return res.status(400).json({
            msg: `La cuenta ${nombre} o ${correo} ya existe en el sistema`
        })
    };
    const data = {
        nombre,
        correo,
        password,
        telefono,
        rolId
    }
    try {
        const usuario  = await Usuario.create(data)
        console.log(usuario);
        return res.status(200).json(`El usuario ${nombre} ha sido registrado con exito`)
    } catch (error) {
        console.log('ha ocurrido un error inesperado',error);
        res.status(401).json({
            msg: 'Ha ocurrido un error'
        })
    }
}

//actualizar usuario - privado(aun no implementado)
const putUsuarios = async(req = request, res = response)=>{
    const {id} = req.params;
    const {nombre, correo, telefono,rolId} = req.body;
    try {
        const user = await Usuario.findByPk(id, {
            attributes: ['id','nombre','correo','telefono']
        });
        await Promise.all([ 
            user.update({
                nombre, 
                correo, 
                telefono,
                rolId
            }),
            await user.save()
        ])
        return res.status(200).json({
            user,
            msg: "Se ha cambiado correctamente los datos"
        })
    } catch (err) {
        console.log('Ha ocurrido un error inesperado', err);
        return res.status(400).json({
            msg: "Ha ocurrido un error, intente otra vez"
        })
    }
}

//eliminar usuario - privado(aun no implementado)
const deleteUsuarios = async(req = request, res = response)=>{
    const {id} = req.params;
    try {
        const user = await Usuario.findByPk(id,{
            attributes: ['id','nombre','correo','telefono']
        })
        await Promise.all([
            user.update({estado: false}),
            await user.save()
        ])
        return res.status(200).json({
            user,
            msg: "El usuario ha sido eliminado"
        });
    } catch (err) {
        console.log("Ha ocurrido un error inesperado", err);
        return res.status(400).json({
            msg: "Ha ocurrido inesperado, intente otra vez"
        })
    } 
}
//mostrar todos los roles
const mostrarRoles = async(req, res= response)=>{
    const roles = await Rol.findAll({
        attributes: ['id','nombre']
    });
    res.status(200).json({
        roles
    })  
}
export {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios,
    mostrarRoles,
    getToken,
    getUsuario
}
