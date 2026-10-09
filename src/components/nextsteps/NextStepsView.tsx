import React, { useState } from 'react';
import {
  ArrowRightCircle,
  Calendar,
  Check,
  X,
  Clock,
  Building,
  CheckCircle2,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProposedNextStep } from '../../types';

export const NextStepsView: React.FC = () => {
  const {
    nextSteps,
    reviewNextStep,
    materializeNextStep,
    prepareCalendarAction,
    calendarActions,
    setCurrentSection,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PROPOSED' | 'PLANNED'>('ALL');

  const filteredSteps = nextSteps.filter((s) => {
    if (activeTab === 'PROPOSED') return s.status === 'proposed';
    if (activeTab === 'PLANNED') return s.status === 'planned';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Siguientes Pasos Comerciales</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Flujo: <code>NextStep proposed -&gt; revisión humana -&gt; materialización a planned -&gt; preparar evento en Google Calendar</code>.
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
            Todos ({nextSteps.length})
          </button>
          <button
            onClick={() => setActiveTab('PROPOSED')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'PROPOSED' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Propuestas ({nextSteps.filter((s) => s.status === 'proposed').length})
          </button>
          <button
            onClick={() => setActiveTab('PLANNED')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'PLANNED' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Planificados ({nextSteps.filter((s) => s.status === 'planned').length})
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden divide-y divide-slate-800/80">
        {filteredSteps.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No hay siguientes pasos en esta vista.
          </div>
        ) : (
          filteredSteps.map((step) => {
            const calAction = calendarActions.find((c) => c.next_step_id === step.id);

            return (
              <div key={step.id} className="p-4 hover:bg-slate-800/30 transition-colors space-y-3">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <ArrowRightCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{step.text}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300 font-medium">
                        <Building className="w-3 h-3 text-slate-400" />
                        {step.client_name}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono text-slate-300">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Fecha propuesta:{' '}
                        {new Date(step.proposed_date).toLocaleString('es-ES', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${
                        step.review_state === 'accepted'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : step.review_state === 'rejected'
                          ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800'
                      }`}
                    >
                      Revisión: {step.review_state}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${
                        step.status === 'planned'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      Estado: {step.status}
                    </span>

                    {calAction && (
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase border ${
                          calAction.state === 'created'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                            : 'bg-amber-950/70 text-amber-300 border-amber-800'
                        }`}
                      >
                        Alex Google: {calAction.state}
                      </span>
                    )}
                  </div>
                </div>

                {/* Excerpt and action buttons */}
                <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 italic">
                    Procedencia: &quot;{step.source_excerpt}&quot;
                  </div>

                  <div className="flex items-center gap-2">
                    {step.review_state === 'not_reviewed' ? (
                      <>
                        <button
                          onClick={() => reviewNextStep(step.id, 'accepted')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-semibold cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Aceptar Propuesta</span>
                        </button>
                        <button
                          onClick={() => reviewNextStep(step.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-semibold cursor-pointer"
                        >
                          <X className="w-3 h-3 text-rose-400" />
                          <span>Rechazar</span>
                        </button>
                      </>
                    ) : step.review_state === 'accepted' && step.status === 'proposed' ? (
                      <button
                        onClick={() => materializeNextStep(step.id)}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow"
                      >
                        Materializar a Planned
                      </button>
                    ) : step.status === 'planned' && !calAction ? (
                      <button
                        onClick={() => prepareCalendarAction(step.id)}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Preparar Snapshot en Google Calendar</span>
                      </button>
                    ) : calAction ? (
                      <button
                        onClick={() => setCurrentSection('calendario')}
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <span>Ver en Calendario</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : null}
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
