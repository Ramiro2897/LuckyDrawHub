import bcrypt from 'bcrypt';
import { AppDataSource } from '../data-source'; 
import { User } from '../entities/User'; 

const createAdminUser = async () => {
  const password = 'Castrogar12'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear un nuevo objeto Admin
  const admin = new User();
  admin.email = 'admin';
  admin.password = hashedPassword;

  // Guardar el nuevo admin en la base de datos
  try {
    await AppDataSource.manager.save(admin); 
    console.log('Usuario admin creado correctamente.');
  } catch (error) {
    console.error('Error al crear el usuario admin:', error);
  }
};

export default createAdminUser;
