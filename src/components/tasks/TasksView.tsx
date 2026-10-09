import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  Check,
  X,
  Edit3,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
  Circle,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProposedTask, ReviewState, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const { tasks, reviewTask, materializeTask, toggleTaskStatus, emails } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PROPOSED' | 'PENDING' | 'COMPLETED'>('ALL');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === 'PROPOSED') return t.status === 'proposed';
    if (activeTab === 'PENDING') return t.status === 'pending';
    if (activeTab === 'COMPLETED') return t.status === 'completed';
    return true;
  });

  const proposedCount = tasks.filter((t) => t.status === 'proposed').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleStartEdit = (task: ProposedTask) => {
    setEditingTaskId(task.id);
    setEditedText(task.text);
  };

  const handleSaveEdit = (taskId: string) => {
    if (!editedText.trim()) return;
    reviewTask(taskId, 'accepted', `Texto actualizado: ${editedText}`);
    setEditingTaskId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header and Operational rule */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Gestión Supervisada de Tareas</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Las tareas extraídas por IA permanecen en estado <code>proposed</code> hasta su aceptación humana y materialización explícita.
          </p>
        </div>

        {/* Tab filters */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'ALL' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('PROPOSED')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'PROPOSED' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Propuestas ({proposedCount})
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'PENDING' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Operativas ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'COMPLETED' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Completadas ({completedCount})
          </button>
        </div>
      </div>

      {/* Tasks Table / List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800/80">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No hay tareas en la sección seleccionada.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            const sourceEmail = emails.find((e) => e.id === task.source_email_id);

            return (
              <div key={task.id} className="p-4 hover:bg-slate-800/30 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  {/* Left: Task description or editor */}
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      disabled={task.status === 'proposed'}
                      className="mt-0.5 text-slate-500 hover:text-amber-400 transition-colors disabled:opacity-30 cursor-pointer"
                      title={task.status === 'proposed' ? 'Debe materializarse primero' : 'Marcar completada'}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="flex-1 px-3 py-1 text-xs bg-slate-950 border border-slate-700 rounded text-slate-100"
                          />
                          <button
                            onClick={() => handleSaveEdit(task.id)}
                            className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs cursor-pointer"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingTaskId(null)}
                            className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded text-xs cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`text-xs font-semibold text-slate-100 ${
                            task.status === 'completed' ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {task.text}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="font-mono text-amber-300/90">Prioridad: {task.priority}</span>
                        <span>·</span>
                        {task.due_date && (
                          <span className="flex items-center gap-1 font-mono text-slate-300">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Vence: {task.due_date}
                          </span>
                        )}
                        {sourceEmail && (
                          <>
                            <span>·</span>
                            <span className="text-slate-400 truncate max-w-xs">
                              Origen: {sourceEmail.subject}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${
                        task.review_state === 'accepted'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : task.review_state === 'rejected'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800'
                      }`}
                    >
                      Revisión: {task.review_state}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${
                        task.status === 'completed'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : task.status === 'pending'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      Estado: {task.status}
                    </span>
                  </div>
                </div>

                {/* Excerpt and Human Review Buttons */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 italic">
                    Fragmento: &quot;{task.source_excerpt}&quot;
                  </div>

                  <div className="flex items-center gap-2">
                    {task.review_state === 'not_reviewed' ? (
                      <>
                        <button
                          onClick={() => reviewTask(task.id, 'accepted')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-semibold cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={() => reviewTask(task.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-semibold cursor-pointer"
                        >
                          <X className="w-3 h-3 text-rose-400" />
                          <span>Rechazar</span>
                        </button>
                        <button
                          onClick={() => handleStartEdit(task)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>
                      </>
                    ) : task.review_state === 'accepted' && task.status === 'proposed' ? (
                      <button
                        onClick={() => materializeTask(task.id)}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer shadow"
                      >
                        Materializar a Operativa (Pending)
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        Revisado por {task.review_actor || 'Alejandro López'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
