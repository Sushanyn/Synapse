import { useRef, useState, useEffect } from 'react'
import { IoIosClose } from "react-icons/io";
import { MdOpenInFull } from "react-icons/md";
import { FaEllipsisV } from "react-icons/fa";
import { supabase } from '../lib/supabase';

const initialProjects = [
    {
        id: crypto.randomUUID(),
        title: "First project",
        ideas: [],
        connections: []
    } 
]

export default function Canvas() {
    const [projects, setProjects] = useState(initialProjects)
    const [activeProjectId, setActiveProjectId] = useState(initialProjects[0].id)
    const activeProject = projects.find(project => project.id === activeProjectId)
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [editingId, setEditingId] = useState(null)
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 })
    
    const [dragState, setDragState] = useState({ type: null, id: null })
    const [tempMouse, setTempMouse] = useState({ x: 0, y: 0 })
    const [hoveredIdeaId, setHoveredIdeaId] = useState(null) 
    const [isSaving, setIsSaving] = useState(false)

    const lastMouse = useRef({ x: 0, y: 0 })

    const fileInputRef = useRef(null)
    const [isUploading, setIsUploading] = useState(false)

    const [currentUser, setCurrentUser] = useState(null); 
    const [cursors, setCursors] = useState({});
    const channelRef = useRef(null);
    const lastSendRef = useRef(0);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    const broadcastBoardState = (ideas, connections) => {
        if (channelRef.current) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'sync-board',
                payload: { ideas, connections }
            });
        }
    };

    function createProject() {
        const project = { id: crypto.randomUUID(), title: `Project ${projects.length + 1}`, ideas: [], connections: [] }
        setProjects([...projects, project])
        setActiveProjectId(project.id)
    }

    function createIdea() {
        setProjects(projects.map(project => {
            if (project.id !== activeProjectId) return project
            const lastIdea = project.ideas[project.ideas.length - 1]
            return {
                ...project,
                ideas: [
                    ...project.ideas,
                    { id: crypto.randomUUID(), title: 'New idea', text: '', x: lastIdea ? lastIdea.x + 270 : 100, y: lastIdea ? lastIdea.y : 100 }
                ]
            }
        }))
    }

    function updateIdea(ideaId, newFields) {
        setProjects(projects.map(project => {
            if (project.id !== activeProjectId) return project
            return {
                ...project,
                ideas: project.ideas.map(idea => idea.id === ideaId ? { ...idea, ...newFields } : idea)
            }
        }))
    }

    function createConnection(fromId, toId) {
        if (fromId === toId) return;
        
        setProjects(prev => prev.map(p => {
            if (p.id !== activeProjectId) return p;
            if (p.connections.some(c => c.from === fromId && c.to === toId)) return p;
            
            return {
                ...p,
                connections: [...p.connections, { id: crypto.randomUUID(), from: fromId, to: toId }]
            }
        }))
    }

    const handleMouseMove = (e) => {
        const now = Date.now();
        if (now - lastSendRef.current > 50 && channelRef.current && currentUser) {
            channelRef.current.send({
                type: 'broadcast',
                event: 'cursor-move',
                payload: {
                    userId: currentUser.id,
                    email: currentUser.email,
                    x: e.clientX,
                    y: e.clientY,
                    color: '#7EB8F7'
                }
            });
            lastSendRef.current = now;
        }

        if (!dragState.type) return;

        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };

        if (dragState.type === 'drag') {
            setProjects(prev => prev.map(p => {
                if (p.id !== activeProjectId) return p;
                return {
                    ...p,
                    ideas: p.ideas.map(i => i.id === dragState.id 
                        ? { ...i, x: i.x + dx / camera.zoom, y: i.y + dy / camera.zoom } 
                        : i)
                }
            }))
        } else if (dragState.type === 'pan') {
            setCamera(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        } else if (dragState.type === 'connect') {
            setTempMouse(prev => ({
                x: prev.x + dx / camera.zoom,
                y: prev.y + dy / camera.zoom
            }))
        }
    }

    const handleMouseUp = () => {
        if (dragState.type === 'connect' && hoveredIdeaId) {
            createConnection(dragState.id, hoveredIdeaId);
        }
        setDragState({ type: null, id: null })
    }

    useEffect(() => {
        const fetchProjects = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return; 
            
            setCurrentUser(session.user);

            const searchParams = new URLSearchParams(window.location.search);
            const roomFromUrl = searchParams.get('room');

            let query = supabase.from('projects').select('*');
            
            if (roomFromUrl) {
                query = query.eq('id', roomFromUrl);
            } else {
                query = query.eq('user_id', session.user.id);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Loading error:", error);
                return;
            }

            if (data && data.length > 0) {
                setProjects(roomFromUrl ? data : data);
                setActiveProjectId(data[0].id);
            } else if (roomFromUrl) {
                alert("Error: Project not found or you don't have access to it!");
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (!currentUser || !activeProjectId) return;

        const searchParams = new URLSearchParams(window.location.search);
        const roomFromUrl = searchParams.get('room');
        const currentRoomId = roomFromUrl || activeProjectId;

        const channel = supabase.channel(`room_${currentRoomId}`, {
            config: { broadcast: { self: false } },
        });

        channel.on('broadcast', { event: 'cursor-move' }, ({ payload }) => {
            setCursors(prev => ({
                ...prev,
                [payload.userId]: { x: payload.x, y: payload.y, email: payload.email, color: payload.color }
            }));
        });

        channel.on('broadcast', { event: 'sync-board' }, ({ payload }) => {
            setProjects(prevProjects => prevProjects.map(p => {
                if (p.id === currentRoomId) {
                    return { ...p, ideas: payload.ideas, connections: payload.connections };
                }
                return p;
            }));
        });

        channel.subscribe();
        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
            setCursors({}); 
        };
    }, [currentUser, activeProjectId]);

    const handleWheel = (e) => {
        const direction = e.deltaY > 0 ? -0.1 : 0.1; 
        
        setCamera(prev => {
            let newZoom = prev.zoom + direction;
            newZoom = Math.min(Math.max(newZoom, 0.2), 3);
            return { ...prev, zoom: newZoom };
        });
    };
    
    const saveProject = async () => {
        setIsSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
            alert("First you need to log in!");
            setIsSaving(false);
            return;
        }

        if (!activeProject) {
            setIsSaving(false);
            return;
        }

        const { error } = await supabase
            .from('projects')
            .upsert({
                id: activeProject.id, 
                user_id: session.user.id,
                title: activeProject.title,
                ideas: activeProject.ideas,
                connections: activeProject.connections,
            });

        if (error) {
            console.error("Fail to save: ", error);
        } else {
            console.log("Project was saved!");
            broadcastBoardState(activeProject.ideas, activeProject.connections);
        }
        
        setIsSaving(false);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveProject();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeProject]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            alert("You need to log in first!");
            return;
        }

        try {
            setIsUploading(true);
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`; 

            const { error: uploadError } = await supabase.storage
                .from('canvas_files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('canvas_files')
                .getPublicUrl(filePath);

            const newIdea = { 
                id: crypto.randomUUID(), 
                title: file.type.includes('image') ? 'New Image' : 'New File', 
                text: '', 
                x: activeProject?.ideas[activeProject.ideas.length - 1] ? activeProject.ideas[activeProject.ideas.length - 1].x + 270 : 100, 
                y: activeProject?.ideas[activeProject.ideas.length - 1] ? activeProject.ideas[activeProject.ideas.length - 1].y : 100,
                fileUrl: publicUrl, 
                fileType: file.type
            };

            const updatedIdeas = [...(activeProject?.ideas || []), newIdea];

            setProjects(projects.map(project => {
                if (project.id !== activeProjectId) return project;
                return { ...project, ideas: updatedIdeas };
            }));

            const { error: saveError } = await supabase
                .from('projects')
                .upsert({
                    id: activeProject.id, 
                    user_id: session.user.id,
                    title: activeProject.title,
                    ideas: updatedIdeas,
                    connections: activeProject.connections,
                });

            if (saveError) {
                console.error("Error auto-saving the project in the database:", saveError);
            } else {
                console.log("The project with the file has been successfully autosaved to the database!");
                
                if (typeof broadcastBoardState === 'function') {
                    broadcastBoardState(updatedIdeas, activeProject.connections);
                }
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Failed to upload file.");
        } finally {
            setIsUploading(false);
            e.target.value = null; 
        }
    };

    const handleCopyLink = () => {
        if (!activeProjectId) return;
        
        const secretLink = `${window.location.origin}${window.location.pathname}?room=${activeProjectId}`;
        
        navigator.clipboard.writeText(secretLink);
        alert("Secret link to this project copied to clipboard!");
    };

    const handleSendInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;

        console.log(`Invite sent to email: ${inviteEmail}`);
        alert(`Invite for ${inviteEmail} successfully sent!`);
        
        setInviteEmail('');
        setIsInviteOpen(false);
    };

    return (
        <div 
            className="flex flex-col h-screen bg-[#111] text-white select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className='relative w-64 z-10'>
                <button className='absolute right-0 top-2' onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <IoIosClose size={24} /> : <MdOpenInFull size={20} />}
                </button>       
            </div>         
            
            <div className="flex flex-1 overflow-hidden">
                {isSidebarOpen && (
                    <aside className="w-64 border-r border-white/10 p-4 z-10 bg-[#111]">
                        <button onClick={createProject} className='cursor-pointer text-gray-400 hover:text-white w-full text-left'>
                            + Create new project 
                        </button>

                        <div className="mt-4 flex flex-col gap-2 relative">
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
                                                onChange={(e) => setProjects(prev => prev.map(p => p.id === project.id ? { ...p, title: e.target.value } : p))}
                                                onBlur={() => setEditingId(null)}
                                                onKeyDown={(e) => { if (e.key === "Enter") setEditingId(null) }}
                                                className="bg-transparent text-gray-400 outline-none w-full"
                                            />
                                        ) : (
                                            <span
                                                onDoubleClick={(e) => { e.stopPropagation(); setEditingId(project.id); }}
                                                className={project.id === activeProjectId ? "text-white" : "text-gray-400"}
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

                <main className="flex-1 flex flex-col h-full relative">
                    <div className="p-4 flex items-center justify-between border-b border-white/10 bg-[#111] z-10">
                        <h1 className="font-bold text-xl">{activeProject?.title}</h1>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setIsInviteOpen(true)}
                                className="bg-[#1a1c20] hover:bg-zinc-700 text-[#7EB8F7] border border-[#2d3035] px-4 py-2 rounded transition-colors text-sm font-medium flex items-center gap-1">👤 Invite
                            </button>
                            <button 
                                onClick={saveProject} 
                                disabled={isSaving}
                                className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 px-4 py-2 rounded transition-colors disabled:opacity-50 text-sm font-medium"
                            >
                                {isSaving ? 'Saving...' : 'Save (Ctrl+S)'}
                            </button>
                            <button onClick={createIdea} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors text-sm font-medium">
                                New idea
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept="image/*,.pdf" 
                            />
                            <button 
                                onClick={() => fileInputRef.current.click()} 
                                disabled={isUploading}
                                className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded transition-colorsdisabled:opacity-50 text-sm font-medium"
                            >
                                {isUploading ? 'Uploading...' : 'Add File'}
                            </button>                            
                        </div>
                    </div>

                    <div 
                        className="relative flex-1 w-full overflow-hidden bg-black/20 cursor-grab active:cursor-grabbing"
                        onMouseDown={(e) => {
                            setDragState({ type: 'pan', id: null })
                            lastMouse.current = { x: e.clientX, y: e.clientY }
                        }}
                        onWheel={handleWheel}
                    >
                        {Object.entries(cursors).map(([id, cursor]) => (
                            <div 
                                key={id} 
                                className="fixed pointer-events-none z-[99999] flex flex-col items-start transition-all duration-75 ease-linear" 
                                style={{ top: cursor.y, left: cursor.x }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.65376 21.3116C5.23461 21.7308 4.51731 21.4346 4.51731 20.8425L4.51731 2.87103C4.51731 2.27649 5.23864 1.98068 5.65825 2.40277L20.6583 17.4913C21.074 17.9095 20.7783 18.6212 20.1887 18.6212L13.7844 18.6212C13.5671 18.6212 13.3551 18.691 13.1818 18.8202L5.65376 21.3116Z" fill={cursor.color || '#7EB8F7'} stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                                </svg>
                                <div className="text-black text-[10px] px-2 py-0.5 rounded-full font-bold ml-4 mt-[-4px] shadow-md" style={{ backgroundColor: cursor.color || '#7EB8F7' }}>
                                    {cursor.email?.split('@')[0]}
                                </div>
                            </div>
                        ))}

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
                            <svg className="absolute inset-0 overflow-visible w-full h-full pointer-events-none">
                                {activeProject?.connections.map(conn => {
                                    const from = activeProject.ideas.find(i => i.id === conn.from);
                                    const to = activeProject.ideas.find(i => i.id === conn.to);
                                    if (!from || !to) return null;

                                    const x1 = from.x + 250; 
                                    const y1 = from.y + 40;  
                                    const x2 = to.x;         
                                    const y2 = to.y + 40;

                                    return (
                                        <path 
                                            key={conn.id} 
                                            d={`M ${x1} ${y1} C ${x1 + 80} ${y1}, ${x2 - 80} ${y2}, ${x2} ${y2}`} 
                                            stroke="#4b5563" 
                                            strokeWidth="3" 
                                            fill="none" 
                                        />
                                    )
                                })}

                                {dragState.type === 'connect' && (() => {
                                    const from = activeProject.ideas.find(i => i.id === dragState.id);
                                    if (!from) return null;
                                    const x1 = from.x + 250;
                                    const y1 = from.y + 40;
                                    return (
                                        <path 
                                            d={`M ${x1} ${y1} C ${x1 + 80} ${y1}, ${tempMouse.x - 80} ${tempMouse.y}, ${tempMouse.x} ${tempMouse.y}`} 
                                            stroke="#3b82f6" 
                                            strokeWidth="3" 
                                            strokeDasharray="5,5" 
                                            fill="none" 
                                        />
                                    )
                                })()}
                            </svg>

                            {activeProject?.ideas.map(idea => (
                                <div 
                                    key={idea.id}
                                    className={`absolute bg-zinc-800 p-4 rounded border ${dragState.id === idea.id && dragState.type === 'drag' ? 'border-blue-500 shadow-blue-500/20 z-50' : 'border-white/20 z-10'} ${dragState.type === 'connect' && hoveredIdeaId === idea.id && dragState.id !== idea.id ? 'border-emerald-500 shadow-emerald-500/40 shadow-xl scale-[1.05] z-40' : ''} shadow-lg pointer-events-auto flex flex-col gap-2 transition-all duration-200`}
                                    style={{
                                        transform: `translate(${idea.x}px, ${idea.y}px)`,
                                        width: '250px',
                                        cursor: dragState.id === idea.id && dragState.type === 'drag' ? 'grabbing' : 'grab'
                                    }}
                                    onMouseDown={(e) => {
                                        e.stopPropagation()
                                        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return; 
                                        setDragState({ type: 'drag', id: idea.id })
                                        lastMouse.current = { x: e.clientX, y: e.clientY }
                                    }}
                                    onMouseEnter={() => setHoveredIdeaId(idea.id)}
                                    onMouseLeave={() => setHoveredIdeaId(null)}
                                >
                                    <div 
                                        className="absolute -right-3 top-8 w-6 h-6 bg-[#111] border-2 border-zinc-600 hover:border-blue-500 hover:bg-blue-500 rounded-full cursor-crosshair z-10 transition-colors flex items-center justify-center"
                                        onMouseDown={(e) => {
                                            e.stopPropagation();
                                            setDragState({ type: 'connect', id: idea.id });
                                            setTempMouse({ x: idea.x + 250, y: idea.y + 40 });
                                            lastMouse.current = { x: e.clientX, y: e.clientY };
                                        }}
                                    >
                                        <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                                    </div>
                                    {idea.fileUrl && idea.fileType?.includes('image') && (
                                        <div className="w-full mt-1 mb-2 overflow-hidden rounded flex items-center justify-center pointer-events-none">
                                            <img 
                                                src={idea.fileUrl} 
                                                alt="Uploaded content" 
                                                className="w-full h-auto max-h-[400px] object-contain rounded-md"
                                                onError={(e) => { console.error("Error loading image"); }}
                                            />
                                        </div>
                                    )}
                                    <input 
                                        className="bg-transparent font-bold outline-none border-b border-transparent focus:border-white/20 w-full cursor-text"
                                        value={idea.title}
                                        onChange={(e) => updateIdea(idea.id, { title: e.target.value })}
                                        placeholder="Idea Title"
                                    />
                                    <textarea 
                                        className="bg-transparent text-sm text-gray-300 outline-none resize-none border-b border-transparent focus:border-white/20 w-full min-h-[60px] cursor-text"
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
            
            {/* --- INVITE MODAL (FIGMA STYLE) --- */}
            {isInviteOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999]">
                    <div className="bg-[#1a1c20] border border-[#2d3035] p-6 rounded-xl w-full max-w-md shadow-2xl relative flex flex-col gap-5 text-white animate-in fade-in zoom-in-95 duration-150">
                        
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">Invite to workspace</h2>
                                <p className="text-gray-400 text-xs mt-0.5">Share this board with your team members.</p>
                            </div>
                            <button 
                                onClick={() => setIsInviteOpen(false)}
                                className="text-gray-400 hover:text-white transition p-1 rounded hover:bg-zinc-800"
                            >
                                <IoIosClose size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400 font-medium">Share secret link</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    readOnly 
                                    value={`${window.location.origin}${window.location.pathname}?room=${activeProjectId}`}
                                    className="bg-[#0c0d0f] text-xs text-gray-400 px-3 py-2.5 rounded-md border border-[#2d3035] outline-none flex-1 select-all"
                                />
                                <button 
                                    onClick={handleCopyLink}
                                    className="bg-[#2d3035] hover:bg-[#3b3f46] text-white px-4 py-2 rounded-md text-xs font-semibold transition whitespace-nowrap"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center my-1">
                            <div className="flex-1 h-[1px] bg-[#2d3035]" />
                            <span className="text-[10px] text-gray-500 px-3 font-bold uppercase tracking-wider">or</span>
                            <div className="flex-1 h-[1px] bg-[#2d3035]" />
                        </div>

                        <form onSubmit={handleSendInvite} className="flex flex-col gap-2">
                            <label className="text-xs text-gray-400 font-medium">Invite via email address</label>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    required
                                    placeholder="name@company.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="bg-[#0c0d0f] text-xs text-white px-3 py-2.5 rounded-md border border-[#2d3035] outline-none focus:border-[#7EB8F7] flex-1"
                                />
                                <button 
                                    type="submit"
                                    className="bg-[#7EB8F7] hover:bg-[#7ED9FF] text-black px-4 py-2 rounded-md text-xs font-semibold transition whitespace-nowrap"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}