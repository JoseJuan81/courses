/**
 * requiero el archivo boostrap para poder cargar las dependencias con Module Federation
 * Al momento de importar boostrap.js se importa igualmente import 'products/ProductsIndex';
 * y con ellos los archivos correspondientes al modulo products
 * De esta manera se le da la oportunidad a webpack para que obtenga los modulos remotos
 * al momento que se carga este archivo en el navegador
 */
import('./boostrap');