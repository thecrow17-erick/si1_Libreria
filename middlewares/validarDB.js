import {request,response} from 'express';
import {Autor, Categoria, Editorial} from '../models/index.js';

const validarAutores = async(req=request, res=response, next)=>{
  const {autores} = req.body;
  if (!autores || autores.length === 0) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un autor.' });
  }
  const autoresIdS = [];
  for(const autore of autores){
    const [autor, create] = await Autor.findOrCreate({
      where: {
        nombre: autore
      },
      defaults: {
        nombre: autore
      }
    });
    autoresIdS.push(autor.id);
  }
  req.autores = autoresIdS;
  next();
}
const validarCategoria = async(req=request, res=response, next)=>{
  const {categoria} = req.body;
  if (!categoria) {
    return res.status(400).json({ error: 'Debe existir el campo categoria'});
  }
  const [categorie] = await Categoria.findOrCreate({
    where:{
      nombre: categoria
    },
    defaults: {
      nombre: categoria
    }
  });
  req.categoria = categorie.id;
  next();
}
const validarEditorial = async(req=request, res=response, next)=>{
    const {editorial} = req.body;
    if (!editorial) {
      return res.status(400).json({ error: 'Debe existir el campo categoria'});
    }
    const [editoriale] = await Editorial.findOrCreate({
      where:{
        nombre: editorial
      },
      defaults: {
        nombre: editorial
      }
    });
    req.editorial = editoriale.id;
    next();
}
export { 
  validarAutores,
  validarCategoria,
  validarEditorial
}