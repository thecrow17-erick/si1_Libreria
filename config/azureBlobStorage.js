import azure from 'azure-storage';
import { config } from 'dotenv';


config({ path: '.env' });

// Configuración de la conexión a Azure Blob Storage
const blobService = azure.createBlobService(
  process.env.NOMBRE_CUENTA_STORAGE,
  process.env.KEY_CUENTA_STORAGE,
  process.env.HOST_CUENTA_STORAGE
)

const postImageBlobStorage = ( fileName, filePath) => {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(
      'imagenes',
      fileName,
      filePath,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};
const getFileUrlFromBlobStorage = (fileName) => {
  const containerName = 'imagenes';
  const url = blobService.getUrl(containerName, fileName);
  return url;
};
export default blobService;
export { 
  postImageBlobStorage,
  getFileUrlFromBlobStorage
};