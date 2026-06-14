import { useState } from 'react'
import { IoIosClose } from "react-icons/io";
import { MdOpenInFull } from "react-icons/md";
import { FaEllipsisV } from "react-icons/fa";

const initialProjects = [
    {
        id: crypto.randomUUID(),
        title: "First project",
        ideas: []
    } 
]

export default function Canvas() {
    const [projects, setProjects] = useState(initialProjects)
    const [activeProjectId, setActiveProjectId] = useState(initialProjects[0].id)
    const activeProject = projects.find(project => project.id === activeProjectId)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    function createProject() {
        const project = {
            id: crypto.randomUUID(),
            title: `Project ${projects.length + 1}`,
            ideas: []
        }

        setProjects([...projects, project])
        setActiveProjectId(project.id)
    }

    function createIdea() {
        setProjects(projects.map(project => {
            if (project.id !== activeProjectId) return project

            return {
                ...project,
                ideas: [
                    ...project.ideas,
                    {
                        id: crypto.randomUUID(),
                        title: 'New idea',
                        text: '',
                        x: 100,
                        y: 100
                    }
                ]
            }
        }))
    }

    return(
        <>
            <div className='relative w-64'>
                <button className='absolute right-0'onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <IoIosClose /> : <MdOpenInFull />}
                </button>       
            </div>         
            <div className="flex h-full text-white">

            {isSidebarOpen && (
                <aside className="w-64 border-r border-white/10 p-4">
                    <button onClick={createProject} className='cursor-pointer text-gray-400 hover:text-white w-64'>Create new project </button>

                    <div className="mt-4 flex flex-col gap-2 relative ">
                    {projects.map(project => (
                    <button
                    key={project.id}
                    onClick={() => setActiveProjectId(project.id)}
                    className={project.id === activeProjectId ? 'text-white' : 'text-gray-400'}
                    >
                    {project.title}<FaEllipsisV className='inline right-0 absolute'/>
                    </button>
                ))}
                    </div>
                </aside>
            )}

            <main className="flex-1 p-6">
                <div className="mb-4 flex items-center justify-between">
                <h1>{activeProject?.title}</h1>
                <button onClick={createIdea}>New idea</button>
                </div>

                <div className="relative h-[600px] border border-white/10 bg-black/20">
                {activeProject?.ideas.map(idea => (
                    <div
                    key={idea.id}
                    className="absolute w-48 rounded bg-white/10 p-3"
                    style={{ left: idea.x, top: idea.y }}
                    >
                    <div>{idea.title}</div>
                    <p className="text-sm text-gray-400">{idea.text || 'Empty idea'}</p>
                    </div>
                ))}
                </div>
            </main>
            </div>
        </>
    )
}
