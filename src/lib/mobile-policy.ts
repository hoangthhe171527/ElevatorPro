export type MobileRole = "admin" | "tech" | "customer";

export type MobileWorkbenchModuleKey =
  | "approvals"
  | "accounting"
  | "contracts"
  | "customers"
  | "elevators"
  | "hr"
  | "inventory"
  | "jobs"
  | "leads"
  | "projects"
  | "reports"
  | "settings"
  | "profile"
  | "techHome"
  | "techJobs"
  | "techRoutePlan"
  | "schedule"
  | "routePlan"
  | "portalHome"
  | "portalContracts"
  | "portalElevators"
  | "portalIssues";

const workbenchRoleRules: Record<MobileWorkbenchModuleKey, MobileRole[]> = {
  approvals: ["admin"],
  accounting: ["admin"],
  contracts: ["admin"],
  customers: ["admin"],
  elevators: ["admin", "tech"],
  hr: ["admin"],
  inventory: ["admin", "tech"],
  jobs: ["admin"],
  leads: ["admin"],
  projects: ["admin"],
  reports: ["admin", "tech"],
  settings: ["admin"],
  profile: ["admin", "tech", "customer"],
  techHome: ["tech"],
  techJobs: ["tech"],
  techRoutePlan: ["tech"],
  schedule: ["tech"],
  routePlan: ["admin"],
  portalHome: ["customer"],
  portalContracts: ["customer"],
  portalElevators: ["customer"],
  portalIssues: ["customer"],
};

const workbenchPermissionRules: Partial<Record<MobileWorkbenchModuleKey, string[]>> = {
  approvals: ["director", "install_mgmt", "maintenance_mgmt", "accounting", "hr_admin"],
  accounting: ["director", "accounting"],
  contracts: ["director", "sales", "sales_maintenance", "accounting"],
  customers: ["director", "sales", "sales_maintenance"],
  elevators: ["director", "install_mgmt", "maintenance_mgmt", "tech_survey"],
  hr: ["director", "hr_admin"],
  inventory: ["director", "install_mgmt", "maintenance_mgmt"],
  jobs: ["director", "install_mgmt", "maintenance_mgmt"],
  leads: ["director", "sales", "sales_maintenance"],
  projects: ["director", "install_mgmt", "sales", "sales_maintenance"],
  reports: [
    "director",
    "sales",
    "sales_maintenance",
    "accounting",
    "hr_admin",
    "install_mgmt",
    "maintenance_mgmt",
    "field_tech",
    "tech_survey",
  ],
  routePlan: ["director", "install_mgmt", "maintenance_mgmt"],
};

const routePermissionRules: Array<{ prefixes: string[]; permissions: string[] }> = [
  { prefixes: ["/mobile/approvals"], permissions: ["director", "install_mgmt", "maintenance_mgmt", "accounting", "hr_admin"] },
  { prefixes: ["/mobile/accounting"], permissions: ["director", "accounting"] },
  { prefixes: ["/mobile/contracts"], permissions: ["director", "sales", "sales_maintenance", "accounting"] },
  { prefixes: ["/mobile/customers"], permissions: ["director", "sales", "sales_maintenance"] },
  { prefixes: ["/mobile/hr"], permissions: ["director", "hr_admin"] },
  { prefixes: ["/mobile/inventory"], permissions: ["director", "install_mgmt", "maintenance_mgmt", "field_tech", "tech_survey"] },
  { prefixes: ["/mobile/jobs"], permissions: ["director", "install_mgmt", "maintenance_mgmt"] },
  { prefixes: ["/mobile/leads"], permissions: ["director", "sales", "sales_maintenance"] },
  { prefixes: ["/mobile/projects"], permissions: ["director", "install_mgmt", "sales", "sales_maintenance"] },
  {
    prefixes: ["/mobile/reports"],
    permissions: ["director", "sales", "sales_maintenance", "accounting", "hr_admin", "install_mgmt", "maintenance_mgmt", "field_tech", "tech_survey"],
  },
];

function hasAnyPermission(permissions: string[], required: string[]) {
  return permissions.some((permission) => required.includes(permission));
}

export function canAccessWorkbenchModule(module: MobileWorkbenchModuleKey, role: MobileRole, permissions: string[]) {
  if (!workbenchRoleRules[module].includes(role)) return false;

  const requiredPermissions = workbenchPermissionRules[module];
  if (!requiredPermissions || requiredPermissions.length === 0) return true;

  return hasAnyPermission(permissions, requiredPermissions);
}

export function canAccessMobilePath(path: string, role: MobileRole, permissions: string[]) {
  if (path.startsWith("/mobile/portal")) {
    return role === "customer";
  }

  if (path === "/mobile/tech" || path.startsWith("/mobile/tech/")) {
    return role === "tech";
  }

  if (path.startsWith("/mobile/scanner") || path.startsWith("/mobile/support")) {
    return role === "tech" || role === "customer";
  }

  for (const rule of routePermissionRules) {
    if (rule.prefixes.some((prefix) => path.startsWith(prefix))) {
      return hasAnyPermission(permissions, rule.permissions);
    }
  }

  return true;
}
