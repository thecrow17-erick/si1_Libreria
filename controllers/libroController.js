import {request,response} from 'express';
import { Autor, Categoria, Editorial, Libro, LibroAutor } from '../models/index.js';


//muestra todos los libros - total - paginado
const getLibros = async(req=request, res=response)=>{
    const { limit = 5, offset = 0} = req.query;
    const [total, usuarios] = await Promise.all([
        Libro.count({where:{estado : true}}),
        Libro.findAll({
            limit,
            offset,
            attributes:['id','titulo','fecha_publicacion','precio'],
            include: [{
                model: Categoria,
                attributes: ['id', 'nombre']
            },{
                model: Editorial,
                attributes: ['id', 'nombre']
            }],
            where: {estado: true}
        })
    ])
    return res.status(200).json({
        total,
        usuarios,
        msg: "Ok"
    })
}

//muestra un libro por id
const getLibro = async(req=request, res=response)=>{
    const {id} = req.params;
    try {
        const libroBD = await Libro.findByPk(id, {
            attributes: ['id', 'titulo', 'fecha_publicacion','precio'],
            include: [{
                model: Categoria,
                attributes: ['id', 'nombre']
            },{
                model: Editorial,
                attributes: ['id', 'nombre']
            },{
                model: Autor,
                attributes: ['id','nombre'],
                through: {
                    attributes: []
                }
            }]
        })
        res.status(200).json({
            libro: libroBD,
            msg: 'Se ha mostrado con exito el libro solicitado'
        })
    } catch (err) {
        console.log('Ha ocurrido un error inesperado',err);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        })
    }
}
//crea datos de un libro
const postLibro = async(req=request, res=response)=>{
    const {titulo,precio, fecha_publicacion,categoria,autor, editorial,img} = req.body;
    const libroDB = await Libro.findOne({where: {titulo}});
    if(libroDB && libroDB.estado){
        return res.status(400).json({
            msg: `El libro ${titulo} ya esta en el sistema`
        })
    }else if(libroDB && !libroDB.estado){
        await Promise.all([
            libroDB.update({estado: true}),
            libroDB.save()
        ])  

        return res.status(201).json({
            libro: libroDB,
            msg: 'Se ha registrado correctamente el libro'
        })
    }
    //pregunto si existen esos atributos, sino existen los creo
    const [autorDB, categoriaDB, editorialDB] = await Promise.all([
        Autor.findOrCreate({where:{nombre: autor}}),
        Categoria.findOrCreate({where:{nombre: categoria}}),
        Editorial.findOrCreate({where:{nombre: editorial}})
    ])
    try {
        const data = {
            titulo,
            precio,
            fecha_publicacion,
            img,
            editorialId: editorialDB[0].dataValues.id,
            categoriaId: categoriaDB[0].dataValues.id
        } 
        const libro = await Libro.create(data);
        await libro.save();
        await LibroAutor.create({
            autorId: autorDB[0].dataValues.id,
            libroId: libro.id
        })
        res.status(200).json({
            libro,
            msg: 'Se ha registrado correctamente el libro'
        })
    } catch (err) {
        console.log('Ha ocurrido un error inesperado', err);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        })
    }
}   
const putLibro = async(req=request, res=response)=>{
    const {id} = req.params;
    const {titulo,precio, fecha_publicacion,categoria,autor, editorial} = req.body;
    const libroDB = await Libro.findByPk(id);
    if(!libroDB.estado){
        return res.status(400).json({
            msg: 'El usuario no existe o no esta activo.'
        })
    }
    try {
        //saco los datos si existen, sino los creo
        const [autorDB, categoriaDB, editorialDB] = await Promise.all([
            Autor.findOrCreate({where:{nombre: autor}}),
            Categoria.findOrCreate({where:{nombre: categoria}}),
            Editorial.findOrCreate({where:{nombre: editorial}})
        ])
        const data = {
            titulo,
            precio,
            fecha_publicacion,
            editorialId: editorialDB[0].dataValues.id,
            categoriaId: categoriaDB[0].dataValues.id
        } 
        //actualizo todo el libro
        await Promise.all([
            await libroDB.update(data),
            await libroDB.save()
        ])
        //actualizo libroAutor
        const libroAutorDB = await LibroAutor.findOne({where: {libroId: libroDB.id}});
        await Promise.all([
            await libroAutorDB.update({autorId : autorDB[0].dataValues.id}),
            await libroAutorDB.save()
        ])
        //lo mando al server
        res.status(200).json({
            libro: libroDB,
            msg: `Se ha actualizado correctamente el libro ${libroDB.titulo}`
        })
    } catch (error) {
        console.log('Ha ocurrido un error inesperado', error);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado, intente de nuevo'
        })
    }
}
const deleteLibro = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        const libroDB = await Libro.findByPk(id);
        if (!libroDB) {
            return res.status(400).json({
                msg: 'El libro no existe'
            });
        }

        await Promise.all([
         libroDB.update({ estado: false }),
         libroDB.save()
        ])    
        res.status(200).json({
            libroDB,
            msg: 'Se ha eliminado el libro correctamente'
        });
    } catch (err) {
        console.log('Ha ocurrido un error inesperado', err);
        res.status(401).json({
            msg: 'Ha ocurrido un error inesperado'
        });
    }
};
export {
    getLibros,
    getLibro,
    postLibro,
    putLibro,
    deleteLibro
}