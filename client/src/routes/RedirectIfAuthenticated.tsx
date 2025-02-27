import { Navigate } from 'react-router-dom';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
  const token = localStorage.getItem('token'); // Obtener el token almacenado
  console.log("Token en RedirectIfAuthenticated:", token);

  if (token) {
    return <Navigate to="/panel" replace />; // Redirigir al panel si ya está autenticado
  }

  return children;
};

export default RedirectIfAuthenticated;
