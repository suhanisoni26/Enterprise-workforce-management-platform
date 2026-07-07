/**
 * Design tokens — Enterprise Workforce Management Platform
 * Single source of truth so every screen pulls from the same palette/type scale.
 */

export const colors = {
  bg: '#0F172A',        // app background
  bgElevated: '#0B1220', // deepest layer (behind sidebar)
  surface: '#1E293B',    // cards, panels, table rows
  surfaceHover: '#25324a',
  surfaceMuted: '#172033',
  border: 'rgba(148, 163, 184, 0.12)',
  borderStrong: 'rgba(148, 163, 184, 0.22)',
  primary: '#3B82F6',
  primaryHover: '#2563EB',
  primarySoft: 'rgba(59, 130, 246, 0.12)',
  accent: '#8B5CF6',
  accentSoft: 'rgba(139, 92, 246, 0.12)',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  success: '#10B981',
  successSoft: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningSoft: 'rgba(245, 158, 11, 0.12)',
  danger: '#EF4444',
  dangerSoft: 'rgba(239, 68, 68, 0.12)',
};

export const fontDisplay = "'Space Grotesk', 'Inter', sans-serif";
export const fontBody = "'Inter', sans-serif";
export const fontMono = "'JetBrains Mono', 'Space Mono', monospace";

export const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Org Admin',
  HR_MANAGER: 'HR Manager',
  MANAGER: 'Manager',
  TEAM_LEAD: 'Team Lead',
  EMPLOYEE: 'Employee',
  FINANCE: 'Finance',
  IT_ADMIN: 'IT Admin',
  AUDITOR: 'Auditor',
};
