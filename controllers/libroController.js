import {request,response} from 'express';
import { Autor, Categoria, Editorial, Inventario, Libro, LibroAutor } from '../models/index.js';
import {postImageBlobStorage ,getFileUrlFromBlobStorage} from '../config/azureBlobStorage.js';
import { v4 as uuidv4} from 'uuid';

//muestra todos los libros - total - paginado
const getLibros = async(req=request, res=response)=>{
    let { limit = 10, offset = 0} = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    const [total, usuarios] = await Promise.all([
        Libro.count({where:{estado : true}}),
        Libro.findAll({
            limit,
            offset,
            attributes:['id','titulo','fecha_publicacion','precio'],
            include: [
                {
                    model: Categoria,
                    attributes: ['id', 'nombre']
                },{
                    model: Editorial,
                    attributes: ['id', 'nombre']
                },{
                    model: Inventario,
                    attributes: ['cantidad']
                }
            ],
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
            attributes: ['id', 'titulo', 'fecha_publicacion','precio', 'img'],
            include: [
                {
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
                },{
                    model: Inventario,
                    attributes: ['cantidad']
                }
            ]
        })
        //busca la imagen
        const imageUrl = getFileUrlFromBlobStorage(libroBD.img);
        console.log(imageUrl);

        libroBD.img = imageUrl;

        //pregunto la imagen
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
    const {titulo,precio,fecha_publicacion,categoriaId} = req.body;
    const data = {
        titulo,
        precio,
        fecha_publicacion,
        categoriaId,
        editorialId: req.editorial
    }
    const autores = req.autores;
    const {img} = req.files;
    try {
        const libroDB = await Libro.findOne({where: {titulo}})
        //si el libro su estado es false
        if(libroDB && libroDB.estado){
            return res.status(400).json("El libro se encuentra en el sistema")
        }
        if(libroDB && !libroDB.estado){
            await libro.update({estado: true})
            return res.status(200).json("El libro se ha reincorporado");
        }
        const cortarNombre = img.name.split('.');
        const extension = cortarNombre[cortarNombre.length - 1]
        //validar extensiones 
        const validarExtensiones = ['png','jpg','jpeg'];
        if(!validarExtensiones.includes(extension)){
            return res.status(400).json("La extension no es permitida")
        }
        //el uuid que ira en la db como img
        let imgName =  uuidv4();
        data.img = imgName;
        imgName +='.' +extension;
        const imgPath = img.tempFilePath;
        //creo un nuevo libro en la db
        const libro = await Libro.create(data);
        //crea un arreglo de objetos del libro y sus autores
        const autoresLibro = autores.map(autor =>({
            autorId: autor,
            libroId: libro.id
        }));
        await LibroAutor.bulkCreate(autoresLibro);
        //lo subo a mi blob storage en azure
        const resp = await postImageBlobStorage( imgName, imgPath);
        console.log(resp);
        return res.status(200).json(`Se ha creado correctamente el libro ${data.titulo}`)
    } catch (err) {
        console.log(err);
        res.status(401).json("ha ocurrido un error")
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
    deleteLibro,
}