import { useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';

const CI_PLACES = [
  { value: 'LP', label: 'LP - La Paz' },
  { value: 'SC', label: 'SC - Santa Cruz' },
  { value: 'CB', label: 'CB - Cochabamba' },
  { value: 'OR', label: 'OR - Oruro' },
  { value: 'PT', label: 'PT - Potosí' },
  { value: 'TJ', label: 'TJ - Tarija' },
  { value: 'CH', label: 'CH - Chuquisaca' },
  { value: 'BN', label: 'BN - Beni' },
  { value: 'PD', label: 'PD - Pando' },
];

const EMPTY_FORM = {
  nombres: '',
  apellidos: '',
  nroCI: '',
  lugarExpCI: '',
  nroCelular: '',
  direccion: '',
  githubUsername: '',
  fechaNacimiento: '',
};

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [repos, setRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [reposError, setReposError] = useState('');
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [reposFetched, setReposFetched] = useState(false);

  const fetchGithubRepos = async () => {
    const username = formData.githubUsername.trim();
    if (!username) {
      setErrors(prev => ({ ...prev, githubUsername: 'Ingresa un usuario de GitHub primero' }));
      return;
    }
    setLoadingRepos(true);
    setReposError('');
    setRepos([]);
    setSelectedRepos([]);
    setReposFetched(false);
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?type=public&per_page=100&sort=updated`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setReposError('Usuario de GitHub no encontrado.');
        } else {
          setReposError('Error al cargar repositorios. Intenta de nuevo.');
        }
        return;
      }
      const data = await response.json();
      setRepos(data);
      setReposFetched(true);
      if (data.length === 0) {
        setReposError('Este usuario no tiene repositorios públicos. Se requiere al menos 1.');
      }
    } catch {
      setReposError('Error de conexión. Verifica tu conexión a internet.');
    } finally {
      setLoadingRepos(false);
    }
  };

  const toggleRepo = (repoName) => {
    setSelectedRepos(prev => {
      if (prev.includes(repoName)) return prev.filter(r => r !== repoName);
      if (prev.length >= 2) return prev;
      return [...prev, repoName];
    });
    if (errors.selectedRepos) {
      setErrors(prev => ({ ...prev, selectedRepos: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombres.trim()) {
      newErrors.nombres = 'Los nombres son requeridos';
    }
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos';
    }
    if (!formData.nroCI.trim()) {
      newErrors.nroCI = 'El número de C.I. es requerido';
    } else if (!/^\d{6,10}$/.test(formData.nroCI.trim())) {
      newErrors.nroCI = 'El C.I. debe contener entre 6 y 10 dígitos';
    }
    if (!formData.lugarExpCI) {
      newErrors.lugarExpCI = 'El lugar de expedición es requerido';
    }
    if (!formData.nroCelular.trim()) {
      newErrors.nroCelular = 'El número de celular es requerido';
    } else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.nroCelular.trim())) {
      newErrors.nroCelular = 'Número de celular inválido';
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    if (!formData.githubUsername.trim()) {
      newErrors.githubUsername = 'El usuario de GitHub es requerido';
    } else if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(formData.githubUsername.trim())) {
      newErrors.githubUsername = 'Nombre de usuario de GitHub inválido';
    } else if (!reposFetched) {
      newErrors.githubUsername = 'Debes buscar tus repositorios antes de enviar';
    }
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const edad = calcularEdad(formData.fechaNacimiento);
      if (edad >= 30) {
        newErrors.fechaNacimiento = `Solo pueden participar desarrolladores menores de 30 años. Tu edad registrada es ${edad} años.`;
      }
    }
    if (reposFetched && repos.length > 0 && selectedRepos.length === 0) {
      newErrors.selectedRepos = 'Debes seleccionar al menos 1 repositorio';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (name === 'githubUsername') {
      setRepos([]);
      setSelectedRepos([]);
      setReposFetched(false);
      setReposError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log('Formulario enviado:', { ...formData, repositorios: selectedRepos });
      setTimeout(() => {
        setFormData(EMPTY_FORM);
        setRepos([]);
        setSelectedRepos([]);
        setReposFetched(false);
        setReposError('');
        setSubmitted(false);
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  const handleClear = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setRepos([]);
    setSelectedRepos([]);
    setReposFetched(false);
    setReposError('');
  };

  const today = new Date().toISOString().split('T')[0];
  const edadActual = formData.fechaNacimiento ? calcularEdad(formData.fechaNacimiento) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl p-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/40 p-12 transition-colors duration-200">

          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Registro Hackathón
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Completa tus datos para inscribirte. Todos los campos son obligatorios.
            </p>
          </div>

          {/* Mensaje de éxito */}
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg text-sm">
              ✓ ¡Registro exitoso! Gracias por inscribirte.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-10">

            {/* Campos personales */}
            <div className="grid grid-cols-6 gap-x-6 gap-y-2">

              {/* Fila 1: Nombres | Apellidos */}
              <div className="col-span-6 md:col-span-3">
                <Input
                  label="Nombres"
                  id="nombres"
                  name="nombres"
                  placeholder="Ej: Juan Carlos"
                  required
                  value={formData.nombres}
                  onChange={handleChange}
                  error={errors.nombres}
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <Input
                  label="Apellidos"
                  id="apellidos"
                  name="apellidos"
                  placeholder="Ej: Pérez Mamani"
                  required
                  value={formData.apellidos}
                  onChange={handleChange}
                  error={errors.apellidos}
                />
              </div>

              {/* Fila 2: C.I. | Lugar Exp. | Celular */}
              <div className="col-span-6 md:col-span-2">
                <Input
                  label="Nro. de Cédula de Identidad"
                  id="nroCI"
                  name="nroCI"
                  placeholder="Ej: 1234567"
                  required
                  value={formData.nroCI}
                  onChange={handleChange}
                  error={errors.nroCI}
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Select
                  label="Lugar de expedición del C.I."
                  id="lugarExpCI"
                  name="lugarExpCI"
                  options={CI_PLACES}
                  placeholder="Selecciona"
                  required
                  value={formData.lugarExpCI}
                  onChange={handleChange}
                  error={errors.lugarExpCI}
                />
              </div>
              <div className="col-span-6 md:col-span-2">
                <Input
                  label="Nro. de Celular"
                  id="nroCelular"
                  name="nroCelular"
                  type="tel"
                  placeholder="Ej: +591 71234567"
                  required
                  value={formData.nroCelular}
                  onChange={handleChange}
                  error={errors.nroCelular}
                />
              </div>

              {/* Fila 3: Fecha Nacimiento | Dirección */}
              <div className="col-span-6 md:col-span-2">
                <Input
                  label="Fecha de Nacimiento"
                  id="fechaNacimiento"
                  name="fechaNacimiento"
                  type="date"
                  required
                  max={today}
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  error={errors.fechaNacimiento}
                />
                {edadActual !== null && edadActual < 30 && (
                  <p className="text-xs text-green-600 dark:text-green-400 -mt-2 mb-4">
                    Edad: {edadActual} años ✓
                  </p>
                )}
                {edadActual !== null && edadActual >= 30 && !errors.fechaNacimiento && (
                  <p className="text-xs text-red-500 dark:text-red-400 -mt-2 mb-4">
                    Solo pueden inscribirse menores de 30 años.
                  </p>
                )}
                {!formData.fechaNacimiento && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2 mb-4">
                    Solo menores de 30 años pueden participar.
                  </p>
                )}
              </div>
              <div className="col-span-6 md:col-span-4">
                <Input
                  label="Dirección"
                  id="direccion"
                  name="direccion"
                  placeholder="Ej: Av. Busch Nro. 123, Santa Cruz"
                  required
                  value={formData.direccion}
                  onChange={handleChange}
                  error={errors.direccion}
                />
              </div>

            </div>

            {/* Sección GitHub */}
            <section>
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 pb-1 border-b border-gray-200 dark:border-gray-700">
                Repositorios GitHub
              </h2>

              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    label="Nombre de usuario de GitHub"
                    id="githubUsername"
                    name="githubUsername"
                    placeholder="Ej: juanperez"
                    required
                    value={formData.githubUsername}
                    onChange={handleChange}
                    error={errors.githubUsername}
                  />
                </div>
                <div className="pt-7">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={fetchGithubRepos}
                    disabled={loadingRepos}
                  >
                    {loadingRepos ? 'Buscando...' : 'Buscar'}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Debes tener al menos 1 repositorio público. Puedes seleccionar hasta 2 para enviar con tu postulación.
              </p>

              {loadingRepos && (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-2">Cargando repositorios...</p>
              )}

              {reposError && (
                <p className="text-sm text-red-500 dark:text-red-400 mb-3">{reposError}</p>
              )}

              {/* Tabla de repositorios */}
              {repos.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between border-b border-gray-200 dark:border-gray-600">
                    <span>{repos.length} repositorio{repos.length !== 1 ? 's' : ''} público{repos.length !== 1 ? 's' : ''} encontrado{repos.length !== 1 ? 's' : ''}</span>
                    <span className={selectedRepos.length === 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : ''}>
                      {selectedRepos.length}/2 seleccionado{selectedRepos.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="max-h-64 overflow-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
                          <th className="w-10 px-4 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600"></th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">Nombre</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">Descripción</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-600">URL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {repos.map(repo => {
                          const isSelected = selectedRepos.includes(repo.name);
                          const isDisabled = !isSelected && selectedRepos.length >= 2;
                          return (
                            <tr
                              key={repo.id}
                              className={`transition-colors ${isDisabled
                                  ? 'opacity-40'
                                  : isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/30'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={isDisabled}
                                  onChange={() => toggleRepo(repo.name)}
                                  className={`h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-600 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[140px]">
                                <span className="block truncate">{repo.name}</span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[200px]">
                                <span className="block truncate">{repo.description || '—'}</span>
                              </td>
                              <td className="px-4 py-3 max-w-[120px]">
                                <a
                                  href={repo.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline text-xs truncate block"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {repo.html_url}
                                </a>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedRepos.length === 2 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Límite alcanzado. Solo puedes seleccionar hasta 2 repositorios por postulación.
                </p>
              )}

              {errors.selectedRepos && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errors.selectedRepos}</p>
              )}
            </section>

            {/* Acciones */}
            <div className="flex gap-4 justify-between pt-6">
              <Button type="button" variant="secondary" size="lg" onClick={handleClear}>
                Limpiar
              </Button>
              <Button type="submit" variant="primary" size="lg">
                Registrarse
              </Button>
            </div>

          </form>
        </div>

        {/* Footer */}
        <footer className="mt-6 px-2 text-center">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            Descargo de responsabilidad
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Este prototipo es para evaluación en el proceso de selección. Es importante aclarar que
            no existe relación directa entre el Banco y la Universidad del Rosario de Colombia, y
            que la Hackathon es solo ilustrativa.
          </p>
        </footer>

      </div>
    </div>
  );
}
