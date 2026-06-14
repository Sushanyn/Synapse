import { useRef, useState } from 'react'
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
    const [camera, setCamera] = useState({
        x: 0,
        y: 0,
        zoom: 1
    })
    const [isPanning, setIsPanning] = useState(false)
    const lastMouse = useRef({x: 0, y: 0})
    const [editingId, setEditingId] = useState(null)

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

            const lastIdea = project.ideas[project.ideas.length - 1]
            const newX = lastIdea ? lastIdea.x + 270 : 100
            const newY = lastIdea ? lastIdea.y : 100

            return {
                ...project,
                ideas: [
                    ...project.ideas,
                    {
                        id: crypto.randomUUID(),
                        title: 'New idea',
                        text: '',
                        x: newX,
                        y: newY
                    }
                ]
            }
        }))
    }

    // Функция для обновления текста конкретной идеи
    function updateIdea(ideaId, newFields) {
        setProjects(projects.map(project => {
            if (project.id !== activeProjectId) return project

            return {
                ...project,
                ideas: project.ideas.map(idea => 
                    idea.id === ideaId ? { ...idea, ...newFields } : idea
                )
            }
        }))
    }

    return(
        <>
            <div className='relative w-64'>
                <button className='absolute right-0' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <IoIosClose /> : <MdOpenInFull />}
                </button>       
            </div>         
            <div className="flex h-full text-white">

            {isSidebarOpen && (
                <aside className="w-64 border-r border-white/10 p-4">
                    <button onClick={createProject} className='cursor-pointer text-gray-400 hover:text-white w-64 text-left'>
                        Create new project 
                    </button>

                    <div className="mt-4 flex flex-col gap-2 relative ">
                    {projects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between w-full">
                        <button
                            onClick={() => setActiveProjectId(project.id)}
                            className="flex-1 text-left truncate mr-2"
                        >
                            {editingId === project.id ? (
                            <input
                                autoFocus
                                value={project.title}
                                onChange={(e) => {
                                setProjects((prev) =>
                                    prev.map((p) =>
                                    p.id === project.id
                                        ? { ...p, title: e.target.value }
                                        : p
                                    )
                                )
                                }}
                                onBlur={() => setEditingId(null)}
                                onKeyDown={(e) => {
                                if (e.key === "Enter") setEditingId(null)
                                }}
                                className="bg-transparent text-gray-400 outline-none w-full"
                            />
                            ) : (
                            <span
                                onDoubleClick={(e) => {
                                e.stopPropagation()
                                setEditingId(project.id)
                                }}
                                className={
                                project.id === activeProjectId
                                    ? "text-white"
                                    : "text-gray-400"
                                }
                            >
                                {project.title}
                            </span>
                            )}
                        </button>
                        <FaEllipsisV className="text-gray-400 cursor-pointer" />
                    </div>
                    ))}
                    </div>
                </aside>
            )}

            <main className="flex-1 p-6 flex flex-col h-screen">
                <div className="mb-4 flex items-center justify-between">
                <h1 className="font-bold text-xl">{activeProject?.title}</h1>
                <button onClick={createIdea} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
                    New idea
                </button>
                </div>

                <div className="relative h-full w-full overflow-hidden border border-white/10 bg-black/20" 
                onMouseDown={(e) => {
                    setIsPanning(true)
                    lastMouse.current = { x: e.clientX, y: e.clientY }
                }}
                onMouseUp={() => setIsPanning(false)}
                onMouseLeave={() => setIsPanning(false)}
                onMouseMove={(e) => {
                    if (!isPanning) return

                    const dx = e.clientX - lastMouse.current.x
                    const dy = e.clientY - lastMouse.current.y

                    lastMouse.current = { x: e.clientX, y: e.clientY }

                    setCamera(prev => ({
                    ...prev,
                    x: prev.x + dx,
                    y: prev.y + dy,
                    }))
                }}>
                
                {/* GRID BACKGROUND */}
                <div className="absolute inset-0 pointer-events-none" 
                            style={{
                                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
                                backgroundSize: `${28 * camera.zoom}px ${28 * camera.zoom}px`,
                                backgroundPosition: `${camera.x}px ${camera.y}px`,
                            }}
                        />
                        <div className="absolute inset-0 pointer-events-none"
                        style={{
                            transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
                            transformOrigin: "0 0",
                        }}
                        >
                            {activeProject?.ideas.map(idea => (
                                <div 
                                    key={idea.id}
                                    className="absolute bg-zinc-800 p-4 rounded border border-white/20 shadow-lg pointer-events-auto flex flex-col gap-2"
                                    style={{
                                        transform: `translate(${idea.x}px, ${idea.y}px)`,
                                        width: '250px'
                                    }}
                                    onMouseDown={(e) => e.stopPropagation()} 
                                >
                                    <input 
                                        className="bg-transparent font-bold outline-none border-b border-transparent focus:border-white/20 w-full"
                                        value={idea.title}
                                        onChange={(e) => updateIdea(idea.id, { title: e.target.value })}
                                        placeholder="Idea Title"
                                    />
                                    <textarea 
                                        className="bg-transparent text-sm text-gray-300 outline-none resize-none border-b border-transparent focus:border-white/20 w-full min-h-[60px]"
                                        value={idea.text}
                                        onChange={(e) => updateIdea(idea.id, { text: e.target.value })}
                                        placeholder="Type your idea here..."
                                    />
                                </div>
                            ))}
                        </div>                
                    </div>
                </main>
            </div>
        </>
    )
}