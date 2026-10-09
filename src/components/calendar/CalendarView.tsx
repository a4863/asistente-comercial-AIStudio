import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Check,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarAction } from '../../types';

export const CalendarView: React.FC = () => {
  const { calendarActions, executeCalendarAction } = useApp();

  const [selectedActionId, setSelectedActionId] = useState<string | null>(
    calendarActions[0]?.id || null
  );

  const selectedAction = calendarActions.find((a) => a.id === selectedActionId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Policy banner */}
      <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Integración Google Calendar — Cuenta Seleccionada: &quot;Alex Google&quot;</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
            EUROPE/MADRID (UTC+2)
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Los eventos nunca se crean directamente desde la extracción de IA. El flujo exige:
          <code className="text-blue-300 font-mono ml-1">
            NextStep aceptado -&gt; planned -&gt; Preparar Snapshot RFC 5545 -&gt; Aprobación explícita -&gt; Google Calendar
          </code>.
          En caso de resultado <code>uncertain</code>, está prohibido reintentar sin reconciliación para evitar citas duplicadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: List of CalendarActions */}
        <div className="space-y-2 lg:col-span-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Acciones de Calendario ({calendarActions.length})
          </div>

          <div className="space-y-2">
            {calendarActions.map((action) => {
              const isSelected = selectedActionId === action.id;
              return (
                <div
                  key={action.id}
                  onClick={() => setSelectedActionId(action.id)}
                  className={`p-3 rounded-lg border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-slate-400">{action.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold border ${
                        action.state === 'created'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                          : action.state === 'prepared'
                          ? 'bg-amber-950/70 text-amber-300 border-amber-800'
                          : action.state === 'uncertain'
                          ? 'bg-rose-950/70 text-rose-300 border-rose-800 animate-pulse'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {action.state}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-200 truncate mb-1">
                    {action.title}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{action.client_ref}</span>
                    <span className="font-mono text-[10px]">
                      {new Date(action.start_time).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Snapshot & Execution detail */}
        <div className="lg:col-span-2">
          {selectedAction ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Snapshot de Evento para Google Calendar</span>
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Calendario destino: <strong>{selectedAction.calendar_name}</strong> · ID: {selectedAction.id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAction.state === 'prepared' && (
                    <button
                      onClick={() => executeCalendarAction(selectedAction.id)}
                      className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprobar Creación en Google Calendar</span>
                    </button>
                  )}

                  {selectedAction.state === 'created' && (
                    <div className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sincronizado en Google Calendar</span>
                    </div>
                  )}

                  {selectedAction.state === 'uncertain' && (
                    <div className="px-3 py-1 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Resultado Incierto (Reconciliación requerida)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Simulation test triggers */}
              <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Simulación de estados Google OAuth API:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => executeCalendarAction(selectedAction.id, true)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] border border-slate-700 cursor-pointer"
                  >
                    Simular Timeout API (Uncertain)
                  </button>
                  <button
                    onClick={() => executeCalendarAction(selectedAction.id, false)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] border border-slate-700 cursor-pointer"
                  >
                    Simular Inserción OK (Created)
                  </button>
                </div>
              </div>

              {/* Snapshot Field Breakdown */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Campos del Snapshot Inmutable
                </div>

                <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500">Título del evento:</span>
                    <div className="text-sm font-semibold text-white mt-0.5">{selectedAction.title}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div>
                      <span className="text-slate-500">Inicio (Start time):</span>
                      <div className="font-mono text-slate-200 mt-0.5">
                        {new Date(selectedAction.start_time).toLocaleString('es-ES', {
                          dateStyle: 'full',
                          timeStyle: 'medium',
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500">Fin (End time):</span>
                      <div className="font-mono text-slate-200 mt-0.5">
                        {new Date(selectedAction.end_time).toLocaleString('es-ES', {
                          dateStyle: 'full',
                          timeStyle: 'medium',
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-500">Zona horaria:</span>
                    <div className="font-mono text-slate-300 mt-0.5">{selectedAction.timezone}</div>
                  </div>

                  <div className="pt-2">
                    <span className="text-slate-500">Descripción:</span>
                    <div className="text-slate-200 whitespace-pre-wrap mt-0.5 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                      {selectedAction.description}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Audit Trace */}
              <div className="p-3 rounded bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div><strong>next_step_id:</strong> {selectedAction.next_step_id}</div>
                <div><strong>prepared_at:</strong> {selectedAction.prepared_at}</div>
                <div><strong>actor:</strong> {selectedAction.actor}</div>
                {selectedAction.remote_event_id && (
                  <div className="text-emerald-400">
                    <strong>remote_event_id:</strong> {selectedAction.remote_event_id}
                  </div>
                )}
                {selectedAction.error_message && (
                  <div className="text-rose-400">
                    <strong>error_message:</strong> {selectedAction.error_message}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Selecciona una acción de calendario para revisar su snapshot.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
