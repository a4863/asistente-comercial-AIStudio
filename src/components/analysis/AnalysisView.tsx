import React from 'react';
import {
  BrainCircuit,
  HelpCircle,
  AlertCircle,
  CheckSquare,
  ArrowRightCircle,
  Clock,
  Mail,
  Building,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalysisView: React.FC = () => {
  const { analyses, emails, setSelectedEmailId, setCurrentSection } = useApp();

  const allAnalyses = Object.values(analyses);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Centro de Análisis Comercial IA</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Visión consolidada de resúmenes, compromisos con plazos y preguntas extraídas de comunicaciones B2B.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Total análisis generados: <span className="text-amber-400 font-bold">{allAnalyses.length}</span>
        </div>
      </div>

      {/* Analysis Cards Grid */}
      <div className="space-y-6">
        {allAnalyses.map((analysis) => {
          const email = emails.find((e) => e.id === analysis.email_id);

          return (
            <div
              key={analysis.id}
              className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-4 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">
                      {email?.subject || 'Comunicación Analizada'}
                    </span>
                    <span className="px-2 py-0.2 rounded font-mono text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                      {analysis.model}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-slate-300">{email?.from}</span>
                    <span>·</span>
                    <span className="font-mono text-slate-400">
                      {new Date(analysis.created_at).toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                {email && (
                  <button
                    onClick={() => {
                      setSelectedEmailId(email.id);
                      setCurrentSection('correo');
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Ver Correo Fuente</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Resumen */}
              <div className="p-3.5 rounded bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Resumen Ejecutivo
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{analysis.resumen}</p>
              </div>

              {/* Two columns: Preguntas & Compromisos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Preguntas */}
                <div className="p-3 rounded bg-slate-950/50 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Preguntas Abiertas ({analysis.preguntas.length})</span>
                  </div>
                  <ul className="space-y-1.5">
                    {analysis.preguntas.map((q, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 font-mono text-[11px] shrink-0">?</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compromisos */}
                <div className="p-3 rounded bg-slate-950/50 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Compromisos Detectados ({analysis.compromisos.length})</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.compromisos.map((comp) => (
                      <div
                        key={comp.id}
                        className="p-2 rounded bg-slate-900 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-200">{comp.description}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                            Deudor: {comp.debtor}
                          </span>
                        </div>
                        {comp.deadline && (
                          <div className="flex items-center gap-1 text-[11px] font-mono text-amber-300">
                            <Clock className="w-3 h-3" />
                            <span>Límite: {comp.deadline}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Counts of tasks & next steps */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>{analysis.propuestas_tareas.length} tareas propuestas</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-blue-300">
                    <ArrowRightCircle className="w-3.5 h-3.5" />
                    <span>{analysis.propuestas_siguientes_pasos.length} siguientes pasos propuestos</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
