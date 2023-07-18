import azure from 'azure-storage';
import { config } from 'dotenv';
import moment from 'moment';
import { fechaActual } from '../helpers/FechaHora.js';


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
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - 4)
  const expiryDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000); // Agrega 4 horas al tiempo actual

  const sharedAccessPolicy = {
    AccessPolicy: {
      Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
      Start: startDate.toISOString(),
      Expiry: expiryDate.toISOString()
    }
  };
  console.log(sharedAccessPolicy);

  const sasToken = blobService.generateSharedAccessSignature('imagenes', fileName, sharedAccessPolicy);

  return blobService.getUrl('imagenes', fileName, sasToken);
};
export default blobService;
export { 
  postImageBlobStorage,
  getFileUrlFromBlobStorage
};