import {
  Inventario
} from '../models/index.js';

const crearInventario = async(libro)=>{ 
  try {
    const inventario = await Inventario.create({
      libroId: libro.id
    })
  } catch (err) {
    throw new Error('Ha ocurrido un error en la creacion.')
  }
}

export {
  crearInventario
}