import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { IoIosClose, IoMdAdd } from "react-icons/io";

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'bg-zinc-500' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'done', title: 'Done', color: 'bg-emerald-500' }
];

export default function Kanban() {
    const { user, loading } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [addingToColumn, setAddingToColumn] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    
    const [draggedTaskId, setDraggedTaskId] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
        if (loading || !user) return;
        
        const { data, error } = await supabase
            .from('kanban_tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error("Ошибка загрузки задач:", error);
        } else {
            setTasks(data || []);
        }
        setIsLoading(false);
        };

        fetchTasks();
    }, [user, loading]);

    const handleAddTask = async (e, status) => {
        e.preventDefault();
        if (!newTaskTitle.trim() || !user) return;

        const newTask = {
        id: crypto.randomUUID(),
        user_id: user.id,
        title: newTaskTitle,
        status: status
        };

        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
        setAddingToColumn(null);

        const { error } = await supabase.from('kanban_tasks').insert([newTask]);
        if (error) console.error("Ошибка сохранения задачи:", error);
    };

    const handleDeleteTask = async (id) => {
        setTasks(tasks.filter(task => task.id !== id));
        await supabase.from('kanban_tasks').delete().eq('id', id);
    };

    const handleDragStart = (e, id) => {
        setDraggedTaskId(id);
        setTimeout(() => {
            e.target.style.opacity = '0.5';
        }, 0);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedTaskId(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, targetStatus) => {
        e.preventDefault();
        if (!draggedTaskId) return;

        setTasks(prev => prev.map(task => 
        task.id === draggedTaskId ? { ...task, status: targetStatus } : task
        ));

        const { error } = await supabase
        .from('kanban_tasks')
        .update({ status: targetStatus })
        .eq('id', draggedTaskId);

        if (error) console.error("Ошибка обновления статуса:", error);
        setDraggedTaskId(null);
    };

    if (isLoading) {
        return <div className="h-screen bg-[#111] text-white flex items-center justify-center">Loading tasks...</div>;
    }

    return (
    <div className="min-h-[calc(100vh-100px)] bg-[#0c0d0f] text-white p-8">
        <div className="mb-8">
            <h1 className="text-[26px] font-semibold text-white">Project Tasks</h1>
            <h3 className="text-gray-400 text-[13px] mt-1">Manage your workflow and track progress.</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
            {COLUMNS.map(column => (
            <div 
                key={column.id}
                className="flex-1 min-w-[300px] bg-[#1a1c20] rounded-xl border border-[#2d3035] flex flex-col overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
            >
                <div className="p-4 border-b border-[#2d3035] flex justify-between items-center bg-[#15171a]">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${column.color}`} />
                    <h2 className="font-medium text-sm text-gray-200">{column.title}</h2>
                </div>
                <span className="text-xs bg-[#2d3035] text-gray-400 px-2 py-1 rounded-full">
                    {tasks.filter(t => t.status === column.id).length}
                </span>
                </div>

                <div className="p-4 flex-1 min-h-[500px] flex flex-col gap-3">
                {tasks.filter(task => task.status === column.id).map(task => (
                    <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                    className="bg-zinc-800 p-4 rounded-lg border border-white/5 cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors group relative shadow-md"
                    >
                    <p className="text-sm text-gray-200 pr-6">{task.title}</p>
                    
                    <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <IoIosClose size={20} />
                    </button>
                    </div>
                ))}

                {addingToColumn === column.id ? (
                    <form onSubmit={(e) => handleAddTask(e, column.id)} className="mt-2">
                    <textarea
                        autoFocus
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddTask(e, column.id);
                        }
                        }}
                        placeholder="What needs to be done?"
                        className="w-full bg-zinc-900 border border-[#7EB8F7]/50 rounded-lg p-3 text-sm text-white outline-none resize-none mb-2"
                        rows={2}
                    />
                    <div className="flex gap-2">
                        <button 
                        type="submit"
                        className="bg-[#7EB8F7] text-black px-3 py-1.5 rounded text-xs font-medium hover:bg-[#7ED9FF] transition"
                        >
                        Save
                        </button>
                        <button 
                        type="button"
                        onClick={() => {
                            setAddingToColumn(null);
                            setNewTaskTitle('');
                        }}
                        className="text-gray-400 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition"
                        >
                        Cancel
                        </button>
                    </div>
                    </form>
                ) : (
                    <button 
                    onClick={() => setAddingToColumn(column.id)}
                    className="mt-2 flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm py-2 px-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                    <IoMdAdd /> Add a task
                    </button>
                )}
                </div>
            </div>
            ))}
        </div>
    </div>
    );
}