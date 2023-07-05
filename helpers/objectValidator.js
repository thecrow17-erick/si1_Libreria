
const validarDetalle =(value = {}) => {
  if (!value.hasOwnProperty('libroId') || typeof value.libroId !== 'number') {
    throw new Error('Cada objeto debe tener una propiedad "libroId" de tipo number');
  }
  if (!value.hasOwnProperty('cantidad') || typeof value.cantidad !== 'number') {
    throw new Error('Cada objeto debe tener una propiedad "cantidad" de tipo number');
  }

  return true;
}
export {
  validarDetalle
}