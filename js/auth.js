// js/auth.js
// Sistema simple de usuarios en localStorage (demo)

const STORAGE_KEY_USERS = "plataforma7_users";
const STORAGE_KEY_CURRENT = "plataforma7_current_user";

// Cargar usuarios guardados
function loadUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error cargando usuarios", e);
    return [];
  }
}

// Guardar usuarios
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

// Registrar usuario nuevo
function registerUser({ name, email, password, role }) {
  const users = loadUsers();

  const exists = users.some(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
  );
  if (exists) {
    return { ok: false, message: "Ya existe un usuario con ese email y rol." };
  }

  const user = {
    id: Date.now(),
    name,
    email,
    password,
    role, // "owner" | "agency" | "difusor"
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);
  localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(user));

  return { ok: true, user };
}

// Login
function loginUser({ email, password, role }) {
  const users = loadUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password &&
      u.role === role
  );

  if (!user) {
    return { ok: false, message: "Credenciales incorrectas o rol equivocado." };
  }

  localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(user));
  return { ok: true, user };
}

// Obtener usuario actual
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Cerrar sesión
function logoutUser() {
  localStorage.removeItem(STORAGE_KEY_CURRENT);
}
