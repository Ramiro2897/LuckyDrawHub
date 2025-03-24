import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source'; // Asegúrate de que la conexión esté bien importada
import { User } from '../entities/User'; // Asegúrate de que la entidad Admin esté bien importada

const createAdminUser = async () => {
  const password = 'luisca96'; // La contraseña que deseas encriptar para el admin
  const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña

  // Crear un nuevo objeto Admin
  const admin = new User();
  admin.email = 'admin';
  admin.password = hashedPassword;

  // Guardar el nuevo admin en la base de datos
  try {
    await AppDataSource.manager.save(admin); // Guarda el admin en la base de datos
    console.log('Usuario admin creado correctamente.');
  } catch (error) {
    console.error('Error al crear el usuario admin:', error);
  }
};

export default createAdminUser;
