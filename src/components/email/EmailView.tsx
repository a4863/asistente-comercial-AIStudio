import React, { useState } from 'react';
import {
  Mail,
  Send,
  BrainCircuit,
  CheckSquare,
  ArrowRightCircle,
  FileEdit,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Edit3,
  Calendar,
  AlertCircle,
  HelpCircle,
  Clock,
  Building,
  Hash,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReviewState, ProposedTask, ProposedNextStep } from '../../types';

export const EmailView: React.FC = () => {
  const {
    emails,
    selectedEmailId,
    setSelectedEmailId,
    analyses,
    runAIAnalysis,
    isAnalyzing,
    reviewTask,
    materializeTask,
    reviewNextStep,
    materializeNextStep,
    createDraftProposalFromEmail,
    setCurrentSection,
  } = useApp();

  const [folderFilter, setFolderFilter] = useState<'ALL' | 'INBOX' | 'Sent'>('ALL');
  const [analysisFilter, setAnalysisFilter] = useState<'ALL' | 'COMPLETED' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMessageId, setShowMessageId] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskText, setEditedTaskText] = useState('');

  // Selected email
  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];
  const currentAnalysis = selectedEmail ? analyses[selectedEmail.id] : null;

  // Filtered emails
  const filteredEmails = emails.filter((email) => {
    if (folderFilter !== 'ALL' && email.folder !== folderFilter) return false;
    if (analysisFilter === 'COMPLETED' && email.analysis_state !== 'completed') return false;
    if (analysisFilter === 'PENDING' && email.analysis_state !== 'pending') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = email.subject.toLowerCase().includes(q);
      const matchFrom = email.from.toLowerCase().includes(q);
      const matchBody = email.body.toLowerCase().includes(q);
      const matchClient = email.client_name?.toLowerCase().includes(q);
      if (!matchSubject && !matchFrom && !matchBody && !matchClient) return false;
    }
    return true;
  });

  const handleStartDraft = () => {
    if (!selectedEmail) return;
    createDraftProposalFromEmail(selectedEmail.id);
    setCurrentSection('borradores');
  };

  const handleSaveEditedTask = (taskId: string) => {
    if (!editedTaskText.trim()) return;
    reviewTask(taskId, 'accepted', `Texto ajustado por el usuario: ${editedTaskText}`);
    setEditingTaskId(null);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-4 -m-2">
      {/* LEFT COLUMN: LISTADO DE CORREOS */}
      <div className="w-full lg:w-96 shrink-0 flex flex-col bg-slate-900/80 border border-slate-800/80 rounded-lg overflow-hidden">
        {/* Filter Bar */}
        <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-900/90">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por cliente, asunto, texto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between text-xs gap-1">
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setFolderFilter('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  folderFilter === 'ALL' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFolderFilter('INBOX')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  folderFilter === 'INBOX' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Inbox
              </button>
              <button
                onClick={() => setFolderFilter('Sent')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  folderFilter === 'Sent' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Enviados
              </button>
            </div>

            <select
              value={analysisFilter}
              onChange={(e) => setAnalysisFilter(e.target.value as any)}
              className="px-2 py-1 text-[11px] bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none"
            >
              <option value="ALL">Todo análisis</option>
              <option value="COMPLETED">Analizados</option>
              <option value="PENDING">Pendientes</option>
            </select>
          </div>
        </div>

        {/* Email items list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/70">
          {filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No se encontraron correos con los filtros actuales.
            </div>
          ) : (
            filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`p-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-l-2 border-amber-500'
                      : 'hover:bg-slate-800/40 border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-200 truncate max-w-[170px]">{email.from}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {new Date(email.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-200 truncate mb-1">{email.subject}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="text-amber-400/90 font-medium truncate max-w-[120px]">
                      {email.client_name || email.commercial_state}
                    </span>

                    <div className="flex items-center gap-1.5 font-mono">
                      {email.folder === 'Sent' ? (
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Send className="w-2.5 h-2.5" /> Sent
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-0.5">
                          <Mail className="w-2.5 h-2.5" /> Inbox
                        </span>
                      )}
                      <span>·</span>
                      <span
                        className={
                          email.analysis_state === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                        }
                      >
                        {email.analysis_state === 'completed' ? 'Analizado' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: DETALLE DEL CORREO Y ANÁLISIS IA (Sections 6.2 & 7) */}
      <div className="flex-1 flex flex-col bg-slate-900/80 border border-slate-800/80 rounded-lg overflow-hidden">
        {selectedEmail ? (
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header info */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/90 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">{selectedEmail.subject}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartDraft}
                    className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileEdit className="w-3.5 h-3.5" />
                    <span>Preparar borrador de respuesta</span>
                  </button>
                  {selectedEmail.analysis_state === 'pending' && (
                    <button
                      onClick={() => runAIAnalysis(selectedEmail.id)}
                      disabled={isAnalyzing}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isAnalyzing ? 'Analizando...' : 'Analizar con IA'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sender & Metadata info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                <div>
                  <span className="text-slate-500">De:</span>{' '}
                  <span className="font-semibold text-slate-200">{selectedEmail.from}</span>
                </div>
                <div>
                  <span className="text-slate-500">Para:</span>{' '}
                  <span className="text-slate-300">{selectedEmail.to.join(', ')}</span>
                </div>
                {selectedEmail.cc && selectedEmail.cc.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="text-slate-500">Cc:</span>{' '}
                    <span className="text-slate-400">{selectedEmail.cc.join(', ')}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500">Fecha:</span>{' '}
                  <span className="font-mono text-slate-300">
                    {new Date(selectedEmail.date).toLocaleString('es-ES', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Carpeta:</span>{' '}
                  <span className="font-mono text-slate-300">{selectedEmail.folder}</span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span className="text-slate-500">Estado comercial:</span>{' '}
                  <span className="text-amber-300 font-medium">{selectedEmail.commercial_state}</span>
                </div>
              </div>

              {/* Technical Message-ID expandable disclosure */}
              <div className="pt-1">
                <button
                  onClick={() => setShowMessageId(!showMessageId)}
                  className="text-[11px] text-slate-400 hover:text-slate-300 flex items-center gap-1 font-mono cursor-pointer"
                >
                  {showMessageId ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span>Message-ID &amp; Cabeceras RFC 2822</span>
                </button>
                {showMessageId && (
                  <div className="mt-1.5 p-2 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-0.5">
                    <div>Message-ID: {selectedEmail.message_id}</div>
                    {selectedEmail.in_reply_to && <div>In-Reply-To: {selectedEmail.in_reply_to}</div>}
                    <div>Conversación ID: {selectedEmail.conversation_id}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Email Body Content */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Cuerpo del Mensaje</h3>
              <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-200 bg-slate-900/60 p-3.5 rounded border border-slate-800/70">
                {selectedEmail.body}
              </div>
            </div>

            {/* AI ANALYSIS SECTION (Section 6.2 & 7) */}
            <div className="p-4 space-y-5 bg-slate-950/20">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Análisis Comercial IA (Extracción Estructurada)
                  </h3>
                </div>
                {currentAnalysis && (
                  <span className="text-[11px] font-mono text-slate-400">
                    Motor: {currentAnalysis.model}
                  </span>
                )}
              </div>

              {!currentAnalysis ? (
                <div className="p-6 rounded bg-slate-900/50 border border-dashed border-slate-800 text-center space-y-3">
                  <BrainCircuit className="w-8 h-8 text-slate-500 mx-auto" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-300">Este correo no tiene análisis generado</h4>
                    <p className="text-[11px] text-slate-400 max-w-md mx-auto mt-0.5">
                      Ejecuta el análisis para extraer de forma estructurada resumen, preguntas abiertas, compromisos con plazos, tareas y siguientes pasos.
                    </p>
                  </div>
                  <button
                    onClick={() => runAIAnalysis(selectedEmail.id)}
                    disabled={isAnalyzing}
                    className="px-4 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                  >
                    {isAnalyzing ? 'Procesando extracción...' : 'Ejecutar Análisis Ahora'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Block 1: Resumen */}
                  <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                      Resumen Ejecutivo
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{currentAnalysis.resumen}</p>
                  </div>

                  {/* Block 2: Preguntas Detectadas */}
                  {currentAnalysis.preguntas && currentAnalysis.preguntas.length > 0 && (
                    <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Preguntas Clave Identificadas</span>
                      </div>
                      <ul className="space-y-1.5">
                        {currentAnalysis.preguntas.map((q, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-blue-400 font-mono text-[11px] shrink-0">?</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Block 3: Compromisos Comerciales */}
                  {currentAnalysis.compromisos && currentAnalysis.compromisos.length > 0 && (
                    <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Compromisos Comerciales &amp; Plazos</span>
                      </div>
                      <div className="space-y-2">
                        {currentAnalysis.compromisos.map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded bg-slate-950/60 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-200">{c.description}</span>
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                  Deudor: {c.debtor}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 italic">
                                &quot;{c.source_excerpt}&quot;
                              </p>
                            </div>
                            {c.deadline && (
                              <div className="shrink-0 flex items-center gap-1 font-mono text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                                <Clock className="w-3 h-3 text-amber-400" />
                                <span>{c.deadline}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Block 4: Tareas Propuestas con REVISIÓN HUMANA (Section 7) */}
                  <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Propuestas de Tareas (Requieren Revisión Humana)</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Regla: Propuesta aceptada no equivale a tarea operativa
                      </span>
                    </div>

                    <div className="space-y-2">
                      {currentAnalysis.propuestas_tareas.map((task) => {
                        const isEditing = editingTaskId === task.id;
                        return (
                          <div
                            key={task.id}
                            className="p-3 rounded bg-slate-950/70 border border-slate-800 text-xs space-y-2"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              {isEditing ? (
                                <div className="flex-1 flex gap-2">
                                  <input
                                    type="text"
                                    value={editedTaskText}
                                    onChange={(e) => setEditedTaskText(e.target.value)}
                                    className="flex-1 px-2.5 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                                  />
                                  <button
                                    onClick={() => handleSaveEditedTask(task.id)}
                                    className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs"
                                  >
                                    Guardar
                                  </button>
                                  <button
                                    onClick={() => setEditingTaskId(null)}
                                    className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              ) : (
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-200">{task.text}</div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                    <span>Prioridad: <strong>{task.priority}</strong></span>
                                    {task.due_date && <span>· Vencimiento: {task.due_date}</span>}
                                  </div>
                                </div>
                              )}

                              {/* Review State Badge & Operational Status */}
                              <div className="flex items-center gap-2 shrink-0">
                                <span
                                  className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                                    task.review_state === 'accepted'
                                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                                      : task.review_state === 'rejected'
                                      ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                      : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                                  }`}
                                >
                                  Revisión: {task.review_state}
                                </span>
                                <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300">
                                  Estado: {task.status}
                                </span>
                              </div>
                            </div>

                            {/* Human Review Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                              <span className="text-[11px] text-slate-400 italic">
                                Fuente: &quot;{task.source_excerpt.slice(0, 70)}...&quot;
                              </span>

                              <div className="flex items-center gap-1.5">
                                {task.review_state === 'not_reviewed' ? (
                                  <>
                                    <button
                                      onClick={() => reviewTask(task.id, 'accepted')}
                                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-medium cursor-pointer"
                                    >
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span>Aceptar</span>
                                    </button>
                                    <button
                                      onClick={() => reviewTask(task.id, 'rejected')}
                                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-medium cursor-pointer"
                                    >
                                      <X className="w-3 h-3 text-rose-400" />
                                      <span>Rechazar</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditingTaskId(task.id);
                                        setEditedTaskText(task.text);
                                      }}
                                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                                    >
                                      <Edit3 className="w-3 h-3" />
                                      <span>Editar</span>
                                    </button>
                                  </>
                                ) : task.review_state === 'accepted' && task.status === 'proposed' ? (
                                  <button
                                    onClick={() => materializeTask(task.id)}
                                    className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                                  >
                                    Materializar a Pendiente
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-400 font-medium">
                                    Revisión completada
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Block 5: Siguientes Pasos con REVISIÓN HUMANA */}
                  <div className="p-3.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                        <ArrowRightCircle className="w-3.5 h-3.5" />
                        <span>Propuestas de Siguientes Pasos</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Paso aceptado -&gt; planned -&gt; Google Calendar
                      </span>
                    </div>

                    <div className="space-y-2">
                      {currentAnalysis.propuestas_siguientes_pasos.map((step) => (
                        <div
                          key={step.id}
                          className="p-3 rounded bg-slate-950/70 border border-slate-800 text-xs space-y-2"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="font-semibold text-slate-200">{step.text}</div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span className="text-slate-300 font-medium">{step.client_name}</span>
                                <span>·</span>
                                <span className="font-mono text-slate-400">
                                  Fecha propuesta: {new Date(step.proposed_date).toLocaleString('es-ES')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                                  step.review_state === 'accepted'
                                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                                    : step.review_state === 'rejected'
                                    ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                                    : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                                }`}
                              >
                                Revisión: {step.review_state}
                              </span>
                              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-800 text-slate-300">
                                Estado: {step.status}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                            <span className="text-[11px] text-slate-400 italic">
                              Fuente: &quot;{step.source_excerpt.slice(0, 70)}...&quot;
                            </span>

                            <div className="flex items-center gap-1.5">
                              {step.review_state === 'not_reviewed' ? (
                                <>
                                  <button
                                    onClick={() => reviewNextStep(step.id, 'accepted')}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-medium cursor-pointer"
                                  >
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Aceptar</span>
                                  </button>
                                  <button
                                    onClick={() => reviewNextStep(step.id, 'rejected')}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-medium cursor-pointer"
                                  >
                                    <X className="w-3 h-3 text-rose-400" />
                                    <span>Rechazar</span>
                                  </button>
                                </>
                              ) : step.review_state === 'accepted' && step.status === 'proposed' ? (
                                <button
                                  onClick={() => materializeNextStep(step.id)}
                                  className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer"
                                >
                                  Materializar a Planned
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-400 font-medium">
                                  Paso aceptado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
            Selecciona un correo en la columna izquierda para visualizar su contenido y análisis.
          </div>
        )}
      </div>
    </div>
  );
};
