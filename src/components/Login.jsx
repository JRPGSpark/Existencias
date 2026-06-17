import React, { useState } from "react";

export default function Login({ onLoginExitoso }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Validación básica local para pruebas (Simulación)
    if (usuario.trim() === "" || contrasena.trim() === "") {
      setError("Por favor, llena todos los campos.");
      return;
    }

    setError("");
    // Aquí puedes mandar las credenciales en el futuro a tu API de C#
    console.log("Iniciando sesión con:", { usuario, contrasena });
    
    // Si todo es correcto, ejecuta la función para dar acceso al inventario
    onLoginExitoso();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between m-0 p-0 box-border font-sans">
      
      {/* Contenedor Central del Formulario */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-200 p-6 space-y-6">
          
          {/* Encabezado e Identidad */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg shadow-sm">
              <img
                  src="/Logo.png" // <-- Pon aquí la ruta de tu imagen
                  alt="Logo Paraíso Rangel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Si la imagen no carga, muestra estas letras por mientras
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="text-xs font-bold text-gray-400">PR</span>';
                  }}
                />
            </div>
            <h1 className="text-xl font-black tracking-wide text-gray-800 uppercase">
              Control de Inventario
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={manejarEnvio} className="space-y-4">
            
            {/* Campo: Usuario */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Ej. ADMIN"
                value={usuario}
                onChange={(e) => {
                  // Validación básica anti-SQLi para la entrada
                  setUsuario(e.target.value.replace(/['"--;|*\\=<Point>]/g, ""));
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Campo: Contraseña */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={contrasena}
                onChange={(e) => {
                  // Validación básica anti-SQLi para la entrada
                  setContrasena(e.target.value.replace(/['"--;|*\\=<Point>]/g, ""));
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* Mensaje de Error (Si existe) */}
            {error && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 rounded-lg border border-red-100 text-center animate-pulse">
                ⚠️ {error}
              </p>
            )}

            {/* Botón Ingresar */}
            <button
              type="submit"
              className="w-full bg-[#0b1d33] text-white p-3 rounded-lg font-bold text-sm tracking-widest uppercase shadow-md hover:bg-[#122b4a] transition-colors duration-200 transform active:scale-[0.98]"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>

      {/* Pie de Página Oficial (Camuflado al final) */}
      <footer className="w-full bg-[#0b1d33] text-white p-4 flex flex-col items-center justify-center border-t border-gray-800">
        <div className="text-center space-y-1">
          <p className="text-[10px] text-gray-400 font-light">
            © 2026 PARAISO RANGEL. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-gray-400 font-light">
            Sitio desarrollado por{" "}
            <a 
              href="https://www.linkedin.com/in/juan-roman-pantoja-garcia-6a9ab02ab/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 no-underline cursor-default hover:text-gray-400 select-text"
            >
             - Departamento TI.
            </a>{" "}
            
          </p>
        </div>
      </footer>

    </div>
  );
}