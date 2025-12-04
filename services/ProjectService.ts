
import { api } from './api';
import { Project, Task } from '../types';
import { MOCK_TASKS } from '../constants'; // Tasks still mocked for now, or can be moved to DB

export const ProjectService = {
  getAllProjects: async (): Promise<Project[]> => {
    return await api.get('/projects');
  },

  createProject: async (projectData: Partial<Project>): Promise<Project> => {
    return await api.post('/projects', projectData);
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    return await api.put(`/projects/${id}`, data);
  },

  // Tasks are currently sub-resources, in a real app they would have their own API endpoint
  getTasksByProject: async (projectId: string): Promise<Task[]> => {
    // Simulating API call for tasks
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(projectId === 'all' ? MOCK_TASKS : MOCK_TASKS.filter(t => t.projectId === projectId));
      }, 300);
    });
  }
};
