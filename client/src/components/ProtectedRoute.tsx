import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token"); // Obtener el token almacenado

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/panelLogin" replace />;
  }

  // Si hay token, renderizar el componente protegido
  return children;
};

export default ProtectedRoute;
