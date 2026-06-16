/**
 * @file InventarioMovil.jsx
 * @description Sistema de Gestión de Existencias Globales
 * @author Juan Román Roman Pantoja Garcia<pantojagarciajuan9@gmail.com>
 * @copyright (c) 2026 Todos los derechos reservados.
 * @license Propiedad exclusiva de [Nombre Empresa/Tu Nombre] - Uso autorizado según contrato.
 */

import React, { useState, useEffect } from 'react';

const SUCURSALES = [
  "PIPILA", "ABASOLO", "CHAMIZAL", "COLEGIO", "DURANGO",
  "FRUTERIA", "LOPEZ MORENO", "MORELOS", "PLAN DE AYALA",
  "PONCIANO", "QUERETARO", "URIANGATO"
];

export default function InventarioMovil() {
  // Estados de datos
  const [datosInventario, setDatosInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados de UI y Filtros
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(SUCURSALES[0]);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  // Estados para mejoras visuales
  const [mostrarBotonArriba, setMostrarBotonArriba] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false); // Inicia oculto en móviles

  // Petición al Backend o archivo JSON local
  useEffect(() => {
    const urlBackend = '/inventario.json';

    fetch(urlBackend)
      .then((response) => {
        if (!response.ok) throw new Error('Error al conectar con el servidor de inventarios');
        return response.json();
      })
      .then((data) => {
        setDatosInventario(data);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  // Lógica de control de scroll para el botón flotante
  useEffect(() => {
    const controlarScroll = () => {
      if (window.scrollY > 300) {
        setMostrarBotonArriba(true);
      } else {
        setMostrarBotonArriba(false);
      }
    };

    window.addEventListener("scroll", controlarScroll);
    return () => window.removeEventListener("scroll", controlarScroll);
  }, []);

  const regresarArriba = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Lógica de colores para los recuadros
  const obtenerColorSemaforo = (cantidad) => {
    if (cantidad > 100) {
      return { fondo: 'bg-green-50 border border-green-200', texto: 'text-green-700' };
    } else if (cantidad >= 50 && cantidad <= 100) {
      return { fondo: 'bg-yellow-50 border border-yellow-200', texto: 'text-yellow-700' };
    } else {
      return { fondo: 'bg-red-50 border border-red-200', texto: 'text-red-600' };
    }
  };

  // Función de ayuda para formatear a moneda
  const formatearMoneda = (valor) => {
    return (valor ?? 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
  };

  // Filtro seguro de productos
  const productosFiltrados = datosInventario.filter(item => {
    const termino = busqueda.toLowerCase().trim();
    if (!termino) return true;

    const nombreArticulo = item.nombre ? String(item.nombre).toLowerCase() : "";
    const claveArticulo = item.clave ? String(item.clave).toLowerCase() : "";

    return nombreArticulo.includes(termino) || claveArticulo.includes(termino);
  });

  if (cargando) return <div className="text-center py-10 font-medium text-gray-600">Cargando datos del almacén...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-bold">⚠️ Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between m-0 p-0 box-border">

      {/* ========================================== */}
      {/* BLOQUE SUPERIOR FIJO (HEADER + CONTROLES)  */}
      {/* ========================================== */}
      <div className="sticky top-0 z-20 w-full shadow-md bg-gray-100">

        {/* Navbar Superior */}
        <header className="bg-blue-900 text-white p-4">
          <div className="max-w-7xl mx-auto px-2">
            <h1 className="text-xl font-bold tracking-wide">Existencias Globales</h1>
            <p className="text-xs text-blue-200 mt-1">PARAISO RANGEL - MA SOCORRO BEDOLLA GUZMAN</p>
          </div>
        </header>

        {/* Botón Acordeón para Ocultar/Mostrar Filtros */}
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-2">
          <button
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg shadow-sm flex justify-between items-center font-medium active:bg-blue-700 transition-colors"
          >
            <span>{mostrarFiltros ? 'Ocultar Filtros y Búsqueda' : 'Mostrar Filtros y Búsqueda'}</span>
            <span className="text-xl leading-none">
              {mostrarFiltros ? '↑' : '↓'}
            </span>
          </button>
        </div>

        {/* Controles de selección y búsqueda */}
        {mostrarFiltros && (
          <div className="border-b border-gray-200 px-4 pb-4 transition-all">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Selector de Sucursal */}
              <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">📍 Seleccionar Sucursal</label>
                <select
                  value={sucursalSeleccionada}
                  onChange={(e) => setSucursalSeleccionada(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none font-semibold"
                >
                  {SUCURSALES.map((sucursal) => (
                    <option key={sucursal} value={sucursal}>{sucursal}</option>
                  ))}
                </select>
              </div>

              {/* Caja de Búsqueda */}
              <div className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-end">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">🔍 Buscar Artículo</label>

                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o clave..."
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      setMostrarSugerencias(true);
                    }}
                    onFocus={() => setMostrarSugerencias(true)}
                    onBlur={() => setTimeout(() => setMostrarSugerencias(false), 200)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />

                  {busqueda.length > 0 && (
                    <button
                      onClick={() => {
                        setBusqueda("");
                        setMostrarSugerencias(false);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 p-1.5 rounded-full focus:outline-none transition-colors"
                      title="Borrar búsqueda"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  {mostrarSugerencias && busqueda.length > 0 && productosFiltrados.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto left-0 top-full">
                      {productosFiltrados.slice(0, 5).map((item, index) => (
                        <li
                          key={`sug-${item.clave}-${index}`}
                          onClick={() => {
                            setBusqueda(item.clave);
                            setMostrarSugerencias(false);
                          }}
                          className="p-3 hover:bg-blue-50 active:bg-blue-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors flex flex-col"
                        >
                          <span className="text-sm font-bold text-gray-800 uppercase">{item.nombre}</span>
                          <span className="text-xs text-gray-500 font-mono mt-0.5">Clave: {item.clave}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* CONTENIDO PRINCIPAL (TARJETAS)             */}
      {/* ========================================== */}
      <main className="max-w-7xl mx-auto p-4 space-y-4 pt-4">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productosFiltrados.map((item, indice) => {
            const stockSucursal = item.sucursales ? (item.sucursales[sucursalSeleccionada] ?? 0) : 0;
            const coloresTotal = obtenerColorSemaforo(item.total ?? 0);
            const coloresSucursal = obtenerColorSemaforo(stockSucursal);

            // Evaluamos si el producto cuenta con la lista de impuestos asignada desde el back
            const listaImpuestos = item.impuestos ?? [];

            return (
              <div
                key={`${item.clave}-${indice}`}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Cabecera del Artículo */}
                  <div className="border-b border-gray-100 pb-2 mb-3">
                    <span className="text-xs font-mono text-gray-400 block">Clave: {item.clave}</span>
                    <h2 className="text-sm font-bold text-gray-800 uppercase mt-0.5 min-h-[40px] line-clamp-2">
                      {item.nombre}
                    </h2>
                  </div>

                  {/* Sección: Precios */}
                  <div className="bg-gray-50 rounded-lg p-2 mb-3 grid grid-cols-3 gap-2 divide-x divide-gray-200 border border-gray-100">
                    <div className="text-center px-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide block">P. Lista</span>
                      <span className="text-sm font-bold text-gray-800">{formatearMoneda(item.precioLista)}</span>
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide block">P. Mínimo</span>
                      <span className="text-sm font-bold text-gray-800">{formatearMoneda(item.precioMinimo)}</span>
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide block">C/Impuesto</span>
                      <span className="text-sm font-black text-blue-700">{formatearMoneda(item.precioImpuesto)}</span>
                    </div>
                  </div>

                  {/* NUEVA SECCIÓN: Combobox de Impuestos */}
                  <div className="mb-4">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide block mb-1">
                      Impuestos Aplicados
                    </span>
                    {listaImpuestos.length > 0 ? (
                      <select
                        disabled={listaImpuestos.length === 1} // Si solo tiene uno, no es necesario desplegar nada
                        className="w-full bg-white border border-gray-300 text-gray-700 text-xs rounded-lg p-2 outline-none font-medium focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        defaultValue={listaImpuestos[0]}
                      >
                        {listaImpuestos.map((imp, idx) => (
                          <option key={`${item.clave}-imp-${idx}`} value={imp}>
                            {imp}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-xs text-gray-400 italic block pl-1">Sin impuestos registrados</span>
                    )}
                  </div>
                </div>

                {/* Grid con Existencias */}
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <div className={`p-2 rounded-lg text-center ${coloresTotal.fondo}`}>
                    <span className="text-xxs text-gray-500 block font-semibold uppercase tracking-wider">Existencia Total</span>
                    <span className={`text-base font-extrabold ${coloresTotal.texto}`}>
                      {(item.total ?? 0).toLocaleString()}
                    </span>
                  </div>

                  <div className={`p-2 rounded-lg text-center ${coloresSucursal.fondo}`}>
                    <span className="text-xxs text-gray-500 block font-semibold uppercase tracking-wider truncate px-1">{sucursalSeleccionada}</span>
                    <span className={`text-base font-extrabold ${coloresSucursal.texto}`}>{stockSucursal}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mensaje de aviso si no queda ningún producto */}
        {productosFiltrados.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            ⚠️ No se encontraron artículos que coincidan con "{busqueda}".
          </div>
        )}

      </main>

      <footer className="w-full bg-[#0b1d33] text-white p-6 md:p-8 flex flex-col items-center justify-center border-t border-gray-800 mt-auto">
        <div className="max-w-xl text-center space-y-3">

          {/* Contenedor preparado para la imagen del logotipo */}
          <div className="flex items-center justify-center mb-1">
            <div className="flex items-center space-x-2">
              {/* Contenedor de la imagen pequeña */}
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                <img
                  src="/ruta-de-tu-logo/logo-pr.png" // <-- Pon aquí la ruta de tu imagen
                  alt="Logo Paraíso Rangel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Si la imagen no carga, muestra estas letras por mientras
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="text-xs font-bold text-gray-400">PR</span>';
                  }}
                />
              </div>
              <span className="font-bold tracking-widest text-sm text-gray-200">PARAISO RANGEL</span>
            </div>
          </div>

          {/* Nombre del Supermercado */}
          <h3 className="text-sm font-bold tracking-wide uppercase text-gray-300">
            Supermercado Paraiso Rangel
          </h3>

          {/* Línea de Copyright */}
          <p className="text-xs text-gray-400 font-light">
            © 2026 PARAISO RANGEL. Todos los derechos reservados.
          </p>

          {/* Línea de Autoría Discreta */}
          <p className="text-xs text-gray-400 font-light">
            Sitio desarrollado (Frontend) por{" "}
            <a
              href="https://www.linkedin.com/in/juan-roman-pantoja-garcia-6a9ab02ab/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 no-underline cursor-default hover:text-gray-400 select-text"
              style={{ pointerEvents: 'auto' }}
            >
              Juan Roman Pantoja Garcia
            </a>{" "}
            - Departamento TI.
          </p>

        </div>
      </footer>

      {/* Botón Flotante Inferior Izquierdo */}
      {mostrarBotonArriba && (
        <button
          onClick={regresarArriba}
          className="fixed bottom-6 left-6 z-50 bg-blue-900 text-white p-3.5 rounded-full shadow-xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center border border-blue-700"
          title="Volver arriba"
        >
          <svg xmlns="http://www.w3.org/2000/xl" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

    </div>
  );

}