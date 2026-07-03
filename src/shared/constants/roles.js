// Role identifiers — must match the backend (src/config/roles.js).
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

export const ROLE_LABELS = {
  admin: 'Admin',
  manager: 'Manager',
  staff: 'Staff',
};

// Roles that must be assigned to a specific branch (admin is global).
export const BRANCH_SCOPED_ROLES = [ROLES.MANAGER, ROLES.STAFF];
