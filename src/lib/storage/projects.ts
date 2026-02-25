/**
 * Projects Storage - Local Storage Based
 * تخزين المشاريع - محلي (جاهز للتحويل لقاعدة بيانات)
 * 
 * لاحقاً: استبدل localStorage بـ API calls
 */

import type { SavedProject, ToolHistoryItem, ToolResult } from '../tools/types';

const PROJECTS_KEY = 'mahni_saved_projects';
const HISTORY_KEY = 'mahni_tool_history';

// ============================================
// Generate ID
// ============================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Get Saved Projects
// ============================================

export function getSavedProjects(): SavedProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading saved projects:', error);
  }

  return [];
}

// ============================================
// Save Projects List
// ============================================

function saveProjectsList(projects: SavedProject[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects:', error);
  }
}

// ============================================
// Create Project
// ============================================

export function createProject(
  name: string,
  toolId: string,
  toolName: string,
  data: Record<string, unknown>
): SavedProject | null {
  if (typeof window === 'undefined') return null;

  const project: SavedProject = {
    id: generateId(),
    name,
    toolId,
    toolName,
    data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const projects = getSavedProjects();
  projects.unshift(project); // Add to beginning
  saveProjectsList(projects);

  console.log('[Projects] Created:', project.name);
  return project;
}

// ============================================
// Update Project
// ============================================

export function updateProject(
  projectId: string,
  updates: Partial<Omit<SavedProject, 'id' | 'createdAt'>>
): SavedProject | null {
  if (typeof window === 'undefined') return null;

  const projects = getSavedProjects();
  const index = projects.findIndex(p => p.id === projectId);

  if (index === -1) {
    console.error('[Projects] Project not found:', projectId);
    return null;
  }

  projects[index] = {
    ...projects[index],
    ...updates,
    updatedAt: Date.now(),
  };

  saveProjectsList(projects);
  console.log('[Projects] Updated:', projects[index].name);
  return projects[index];
}

// ============================================
// Delete Project
// ============================================

export function deleteProject(projectId: string): boolean {
  if (typeof window === 'undefined') return false;

  const projects = getSavedProjects();
  const filtered = projects.filter(p => p.id !== projectId);

  if (filtered.length === projects.length) {
    console.error('[Projects] Project not found:', projectId);
    return false;
  }

  saveProjectsList(filtered);
  console.log('[Projects] Deleted:', projectId);
  return true;
}

// ============================================
// Get Project by ID
// ============================================

export function getProjectById(projectId: string): SavedProject | null {
  const projects = getSavedProjects();
  return projects.find(p => p.id === projectId) || null;
}

// ============================================
// Get Projects by Tool
// ============================================

export function getProjectsByTool(toolId: string): SavedProject[] {
  const projects = getSavedProjects();
  return projects.filter(p => p.toolId === toolId);
}

// ============================================
// Search Projects
// ============================================

export function searchProjects(query: string): SavedProject[] {
  const projects = getSavedProjects();
  const lowerQuery = query.toLowerCase();

  return projects.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.toolName.toLowerCase().includes(lowerQuery)
  );
}

// ============================================
// Get Project Count
// ============================================

export function getProjectCount(): number {
  return getSavedProjects().length;
}

// ============================================
// Rename Project
// ============================================

export function renameProject(projectId: string, newName: string): SavedProject | null {
  return updateProject(projectId, { name: newName });
}

// ============================================
// Duplicate Project
// ============================================

export function duplicateProject(projectId: string): SavedProject | null {
  const project = getProjectById(projectId);
  if (!project) return null;

  return createProject(
    `${project.name} (نسخة)`,
    project.toolId,
    project.toolName,
    project.data
  );
}

// ============================================
// Tool History
// ============================================

export function getToolHistory(): ToolHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading tool history:', error);
  }

  return [];
}

function saveToolHistory(history: ToolHistoryItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Keep only last 100 items
    const trimmed = history.slice(-100);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving tool history:', error);
  }
}

export function addToHistory(
  toolId: string,
  toolName: string,
  input: Record<string, unknown>,
  result: ToolResult
): ToolHistoryItem {
  const item: ToolHistoryItem = {
    id: generateId(),
    toolId,
    toolName,
    input,
    result,
    timestamp: Date.now(),
  };

  const history = getToolHistory();
  history.unshift(item);
  saveToolHistory(history);

  return item;
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

export function getHistoryByTool(toolId: string): ToolHistoryItem[] {
  const history = getToolHistory();
  return history.filter(h => h.toolId === toolId);
}

export function deleteHistoryItem(itemId: string): boolean {
  const history = getToolHistory();
  const filtered = history.filter(h => h.id !== itemId);

  if (filtered.length === history.length) return false;

  saveToolHistory(filtered);
  return true;
}

// ============================================
// Clear All Data (for testing)
// ============================================

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(PROJECTS_KEY);
  localStorage.removeItem(HISTORY_KEY);
  console.log('[Storage] All data cleared');
}

// ============================================
// Export/Import (for backup)
// ============================================

export function exportData(): {
  projects: SavedProject[];
  history: ToolHistoryItem[];
  exportedAt: string;
} {
  return {
    projects: getSavedProjects(),
    history: getToolHistory(),
    exportedAt: new Date().toISOString(),
  };
}

export function importData(data: {
  projects?: SavedProject[];
  history?: ToolHistoryItem[];
}): boolean {
  try {
    if (data.projects) {
      saveProjectsList(data.projects);
    }
    if (data.history) {
      saveToolHistory(data.history);
    }
    console.log('[Storage] Data imported successfully');
    return true;
  } catch (error) {
    console.error('[Storage] Error importing data:', error);
    return false;
  }
}
