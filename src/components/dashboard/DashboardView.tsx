import React from 'react';
import {
  Mail,
  CheckSquare,
  ArrowRightCircle,
  Calendar,
  AlertTriangle,
  FileEdit,
  ShieldAlert,
  ArrowRight,
  Clock,
  Check,
  Building,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    emails,
    conversations,
    tasks,
    nextSteps,
    calendarActions,
    draftActions,
    draftProposals,
    setCurrentSection,
    setSelectedEmailId,
    materializeTask,
    executeCalendarAction,
    executeDraftAppend,
    reconcileDraftAction,
  } = useApp();

  // Metrics
  const pendingEmails = emails.filter((e) => e.analysis_state === 'pending');
  const completedAnalyses = emails.filter((e) => e.analysis_state === 'completed');
  const proposedTasks = tasks.filter((t) => t.review_state === 'not_reviewed');
  const acceptedTasksNotMaterialized = tasks.filter((t) => t.review_state === 'accepted' && t.status === 'proposed');
  const pendingOperativeTasks = tasks.filter((t) => t.status === 'pending');
  const proposedNextSteps = nextSteps.filter((ns) => ns.review_state === 'not_reviewed');
  const plannedNextSteps = nextSteps.filter((ns) => ns.status === 'planned');
  const preparedCalendarActions = calendarActions.filter((c) => c.state === 'prepared');
  const approvedDraftActions = draftActions.filter((d) => d.state === 'approved');
  const uncertainDraftActions = draftActions.filter((d) => d.state === 'uncertain');
  const invalidatedDraftActions = draftActions.filter((d) => d.state === 'invalidated');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome & Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Cockpit Comercial — Delegación Levante</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Estado de operaciones B2B: instalaciones térmicas, licitaciones de obra y gestión supervisada.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Buzón activo: <strong>alejandro.lopez@aclimar.es</strong></span>
          </div>
          <button
            onClick={() => setCurrentSection('correo')}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ir a Bandeja</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CRITICAL ALERTS BANNER (If any uncertain actions or pending approvals exist) */}
      {(uncertainDraftActions.length > 0 ||
        preparedCalendarActions.length > 0 ||
        approvedDraftActions.length > 0 ||
        acceptedTasksNotMaterialized.length > 0) && (
        <div className="p-4 rounded-lg bg-amber-950/40 border border-amber-800/50 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Atención Requerida: Acciones pendientes de tu autorización explícita</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {uncertainDraftActions.length > 0 && (
              <div className="p-2.5 rounded bg-slate-900/90 border border-rose-800/60 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    <span>Acción IMAP Incierta ({uncertainDraftActions.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Timeout tras APPEND. Regla de seguridad: reintento automático prohibido. Requiere reconciliación.
                  </p>
                </div>
                <button
                  onClick={() => reconcileDraftAction(uncertainDraftActions[0].id)}
                  className="mt-2 w-full py-1 text-center bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-700/60 rounded font-medium transition-colors cursor-pointer"
                >
                  Reconciliar Modo Read-Only
                </button>
              </div>
            )}

            {approvedDraftActions.length > 0 && (
              <div className="p-2.5 rounded bg-slate-900/90 border border-blue-800/60 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                    <FileEdit className="w-3.5 h-3.5 text-blue-400" />
                    <span>Borradores Listos ({approvedDraftActions.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Snapshot aprobado. Esperando orden para escribir en &quot;Borradores Asistente&quot;.
                  </p>
                </div>
                <button
                  onClick={() => executeDraftAppend(approvedDraftActions[0].id, 'success')}
                  className="mt-2 w-full py-1 text-center bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-700/60 rounded font-medium transition-colors cursor-pointer"
                >
                  Crear en Borradores Asistente
                </button>
              </div>
            )}

            {preparedCalendarActions.length > 0 && (
              <div className="p-2.5 rounded bg-slate-900/90 border border-amber-800/60 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evento Preparado ({preparedCalendarActions.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Snapshot generado para Alex Google. Requiere aprobación previa a inserción.
                  </p>
                </div>
                <button
                  onClick={() => executeCalendarAction(preparedCalendarActions[0].id)}
                  className="mt-2 w-full py-1 text-center bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 rounded font-medium transition-colors cursor-pointer"
                >
                  Aprobar Creación en Calendario
                </button>
              </div>
            )}

            {acceptedTasksNotMaterialized.length > 0 && (
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-700 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aceptada sin Materializar ({acceptedTasksNotMaterialized.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Propuesta aceptada pero aún en estado proposed. Materializar para pasar a pending.
                  </p>
                </div>
                <button
                  onClick={() => materializeTask(acceptedTasksNotMaterialized[0].id)}
                  className="mt-2 w-full py-1 text-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded font-medium transition-colors cursor-pointer"
                >
                  Materializar Tarea
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4 PRIMARY METRIC WIDGETS (Section 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Correos pendientes de análisis */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Correos & Conversaciones</span>
            <Mail className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tabular-nums">
              {emails.length}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium">{completedAnalyses.length} analizados</span>
              <span>·</span>
              <span>{pendingEmails.length} pendientes</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{conversations.length} hilos activos</span>
            <button
              onClick={() => setCurrentSection('correo')}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Ver correos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Widget 2: Acciones pendientes de revisión */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Revisión Humana</span>
            <CheckSquare className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tabular-nums">
              {proposedTasks.length + proposedNextSteps.length}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-amber-400 font-medium">{proposedTasks.length} tareas</span>
              <span>·</span>
              <span className="text-blue-400 font-medium">{proposedNextSteps.length} pasos</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pendiente de tu criterio</span>
            <button
              onClick={() => setCurrentSection('tareas')}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Revisar propuestas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Widget 3: Agenda & Planificación */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Agenda & Calendario</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tabular-nums">
              {calendarActions.length}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium">
                {calendarActions.filter((c) => c.state === 'created').length} sincronizados
              </span>
              <span>·</span>
              <span className="text-amber-400 font-medium">{preparedCalendarActions.length} preparados</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Alex Google</span>
            <button
              onClick={() => setCurrentSection('calendario')}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Ver agenda</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Widget 4: Borradores IMAP (Sin SMTP) */}
        <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Borradores Asistente</span>
            <FileEdit className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white tabular-nums">
              {draftActions.length}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-medium">
                {draftActions.filter((d) => d.state === 'created').length} en buzón
              </span>
              <span>·</span>
              <span className="text-rose-400 font-medium">{invalidatedDraftActions.length} inválidos</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 font-mono">Envío manual en Outlook</span>
            <button
              onClick={() => setCurrentSection('borradores')}
              className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Gestionar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: Quick Action Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Tareas operativas prioritarias */}
        <div className="rounded-lg bg-slate-900/70 border border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Tareas Operativas en Curso</h2>
            </div>
            <span className="text-xs text-slate-400 tabular-nums font-mono">
              {pendingOperativeTasks.length} pendientes
            </span>
          </div>

          <div className="divide-y divide-slate-800/70 flex-1 overflow-y-auto max-h-80 mt-2">
            {pendingOperativeTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No hay tareas operativas pendientes de ejecución.
              </div>
            ) : (
              pendingOperativeTasks.map((task) => (
                <div key={task.id} className="py-2.5 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                      {task.text}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="text-amber-400/90 font-medium">Prioridad {task.priority}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {task.due_date ? `Vence: ${task.due_date}` : 'Sin plazo fijado'}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-blue-950/60 text-blue-300 border border-blue-800/50 shrink-0">
                    pending
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2 flex justify-end">
            <button
              onClick={() => setCurrentSection('tareas')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas las tareas y propuestas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Próximos Siguientes Pasos y Agenda */}
        <div className="rounded-lg bg-slate-900/70 border border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ArrowRightCircle className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Siguientes Pasos Planificados</h2>
            </div>
            <span className="text-xs text-slate-400 tabular-nums font-mono">
              {plannedNextSteps.length} planned
            </span>
          </div>

          <div className="divide-y divide-slate-800/70 flex-1 overflow-y-auto max-h-80 mt-2">
            {plannedNextSteps.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No hay pasos planificados actualmente.
              </div>
            ) : (
              plannedNextSteps.map((step) => {
                const hasCalAction = calendarActions.find((c) => c.next_step_id === step.id);
                return (
                  <div key={step.id} className="py-2.5 flex items-start justify-between gap-3 group">
                    <div className="space-y-1 min-w-0">
                      <p className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                        {step.text}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Building className="w-3 h-3 text-slate-400" />
                          {step.client_name}
                        </span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">
                          {new Date(step.proposed_date).toLocaleDateString('es-ES', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      {hasCalAction ? (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                            hasCalAction.state === 'created'
                              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                              : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                          }`}
                        >
                          Cal: {hasCalAction.state}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400">
                          planned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 mt-2 flex justify-end">
            <button
              onClick={() => setCurrentSection('siguientes-pasos')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver planificación completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RECENT COMMERCIAL EMAILS SNAPSHOT */}
      <div className="rounded-lg bg-slate-900/70 border border-slate-800/80 p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Últimos Correos en Bandeja IMAP</h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Lectura read-only con <code>BODY.PEEK</code>
          </span>
        </div>

        <div className="divide-y divide-slate-800/60 mt-2">
          {emails.slice(0, 3).map((email) => (
            <div
              key={email.id}
              onClick={() => {
                setSelectedEmailId(email.id);
                setCurrentSection('correo');
              }}
              className="py-3 px-2 rounded hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-white truncate">{email.from}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-amber-300/80 font-medium">{email.commercial_state}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(email.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium truncate">{email.subject}</div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{email.body.slice(0, 140)}...</div>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                    email.analysis_state === 'completed'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                  }`}
                >
                  {email.analysis_state === 'completed' ? 'Analizado' : 'Pendiente'}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
