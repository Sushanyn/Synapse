import { create } from 'zustand';

const initialProjects = [
    {
        id: crypto.randomUUID(),
        title: "First project",
        ideas: [],
        connections: []
    } 
];

export const useBoardStore = create((set) => ({
    projects: initialProjects,
    activeProjectId: initialProjects[0].id,
    camera: { x: 0, y: 0, zoom: 1 },
    isSidebarOpen: true,

    setProjects: (updater) => set((state) => ({ 
        projects: typeof updater === 'function' ? updater(state.projects) : updater 
    })),
    setActiveProjectId: (id) => set({ activeProjectId: id }),
    setCamera: (updater) => set((state) => ({ 
        camera: typeof updater === 'function' ? updater(state.camera) : updater 
    })),
    setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

    createProject: () => set((state) => {
        const newProject = { id: crypto.randomUUID(), title: `Project ${state.projects.length + 1}`, ideas: [], connections: [] };
        return { 
            projects: [...state.projects, newProject], 
            activeProjectId: newProject.id 
        };
    }),

    createIdea: () => set((state) => {
        return {
            projects: state.projects.map(project => {
                if (project.id !== state.activeProjectId) return project;
                const lastIdea = project.ideas[project.ideas.length - 1];
                return {
                    ...project,
                    ideas: [
                        ...project.ideas,
                        { id: crypto.randomUUID(), title: 'New idea', text: '', x: lastIdea ? lastIdea.x + 270 : 100, y: lastIdea ? lastIdea.y : 100 }
                    ]
                };
            })
        };
    }),

    updateIdea: (ideaId, newFields) => set((state) => {
        return {
            projects: state.projects.map(project => {
                if (project.id !== state.activeProjectId) return project;
                return {
                    ...project,
                    ideas: project.ideas.map(idea => idea.id === ideaId ? { ...idea, ...newFields } : idea)
                };
            })
        };
    }),

    createConnection: (fromId, toId) => set((state) => {
        if (fromId === toId) return state;
        return {
            projects: state.projects.map(p => {
                if (p.id !== state.activeProjectId) return p;
                if (p.connections.some(c => c.from === fromId && c.to === toId)) return p;
                return {
                    ...p,
                    connections: [...p.connections, { id: crypto.randomUUID(), from: fromId, to: toId }]
                };
            })
        };
    })
}));