import React, { useState } from 'react';
import { Task, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { ClipboardList, Plus, CheckCircle2, Circle, Trash2, Calendar, AlertCircle, Check } from 'lucide-react';

interface TaskManagerProps {
  language: Language;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ language }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Review Yuchai Specifications',
      description: 'Check if the 100kW model fits the client requirements for the new hospital project.',
      status: 'pending',
      priority: 'high',
      createdAt: Date.now(),
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    }
  ]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const t = TRANSLATIONS[language];

  const handleAddTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      status: 'pending',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      dueDate: newTask.dueDate,
      createdAt: Date.now()
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
  };

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Create Task Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-xl h-fit sticky top-24">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Plus className="text-blue-400 w-5 h-5" />
            </div>
            {t.tasks.title}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">{t.tasks.inputTitle}</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="e.g., Call supplier"
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">{t.tasks.inputDesc}</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Add details..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 resize-none transition-all placeholder-slate-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">{t.tasks.inputPriority}</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50"
                >
                  <option value="low" className="bg-slate-900">Low</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="high" className="bg-slate-900">High</option>
                </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2">{t.tasks.inputDate}</label>
                 <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-4 text-white text-sm focus:outline-none focus:border-blue-500/50 [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              onClick={handleAddTask}
              disabled={!newTask.title}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
            >
              <Plus className="w-5 h-5" />
              {t.tasks.btnAdd}
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-light text-white drop-shadow-lg tracking-tight flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-blue-300" />
              {t.tasks.listTitle}
            </h2>
            
            <div className="flex bg-white/5 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-lg">
              {(['all', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    filter === f 
                      ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ClipboardList className="w-10 h-10 text-slate-500" />
              </div>
              <p className="text-slate-400 font-light text-lg">{t.tasks.noTasks}</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 transition-all duration-300 hover:border-blue-400/30 hover:translate-x-1 ${
                  task.status === 'completed' ? 'opacity-60' : 'opacity-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStatus(task.id)}
                    className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-slate-500 hover:border-blue-400 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className={`text-lg font-bold truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className={`text-sm mb-3 ${task.status === 'completed' ? 'text-slate-500' : 'text-slate-300'}`}>
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      {task.dueDate && (
                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Due: {task.dueDate}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};