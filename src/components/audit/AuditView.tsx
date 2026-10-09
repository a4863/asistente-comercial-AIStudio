import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  Layers,
  ArrowRight,
  ShieldAlert,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuditEventType, AuditEntry } from '../../types';

export const AuditView: React.FC = () => {
  const { auditLog } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const filteredLog = auditLog.filter((entry) => {
    if (filterType !== 'ALL' && entry.type !== filterType) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchEntity = entry.entity.toLowerCase().includes(q);
      const matchId = entry.entity_id.toLowerCase().includes(q);
      const matchOutcome = entry.outcome.toLowerCase().includes(q);
      const matchActor = entry.actor.toLowerCase().includes(q);
      if (!matchEntity && !matchId && !matchOutcome && !matchActor) return false;
    }
    return true;
  });

  const getBadgeForType = (type: AuditEventType) => {
    switch (type) {
      case 'analysis_completed':
        return 'bg-indigo-950/70 text-indigo-300 border-indigo-800';
      case 'proposal_reviewed':
        return 'bg-blue-950/70 text-blue-300 border-blue-800';
      case 'task_materialized':
      case 'next_step_materialized':
        return 'bg-amber-950/70 text-amber-300 border-amber-800';
      case 'calendar_action_created':
      case 'draft_append_created':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800';
      case 'draft_action_invalidated':
        return 'bg-rose-950/70 text-rose-300 border-rose-800';
      case 'draft_append_uncertain':
      case 'calendar_action_uncertain':
        return 'bg-rose-950/70 text-rose-300 border-rose-800 animate-pulse';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Registro Inmutable de Auditoría &amp; Trazabilidad</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cada propuesta de IA, revisión humana, materialización, inserción de calendario y append en buzón queda registrada de forma append-only.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Entradas registradas: <span className="text-amber-400 font-bold">{auditLog.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por ID, entidad, actor, resultado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-300 focus:outline-none w-full sm:w-auto"
        >
          <option value="ALL">Todos los tipos de evento</option>
          <option value="analysis_completed">analysis_completed</option>
          <option value="proposal_reviewed">proposal_reviewed</option>
          <option value="task_materialized">task_materialized</option>
          <option value="next_step_materialized">next_step_materialized</option>
          <option value="calendar_action_prepared">calendar_action_prepared</option>
          <option value="calendar_action_created">calendar_action_created</option>
          <option value="draft_replacement_prepared">draft_replacement_prepared</option>
          <option value="draft_append_created">draft_append_created</option>
          <option value="draft_action_invalidated">draft_action_invalidated</option>
          <option value="draft_append_uncertain">draft_append_uncertain</option>
          <option value="crm_api_sync">crm_api_sync</option>
          <option value="imap_sync">imap_sync</option>
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Tipo de Evento</th>
                <th className="px-4 py-3">Entidad &amp; ID</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Resultado (Outcome)</th>
                <th className="px-4 py-3">Procedencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
              {filteredLog.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron registros de auditoría coincidentes.
                  </td>
                </tr>
              ) : (
                filteredLog.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] border whitespace-nowrap ${getBadgeForType(
                          entry.type
                        )}`}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] whitespace-nowrap">
                      <span className="text-white font-medium">{entry.entity}</span>
                      <span className="text-slate-500 ml-1">({entry.entity_id.slice(0, 16)}...)</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{entry.actor}</td>
                    <td className="px-4 py-3 text-slate-200 max-w-xs truncate" title={entry.outcome}>
                      {entry.outcome}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] max-w-xs truncate" title={entry.provenance}>
                      {entry.provenance}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Detalle de Entrada de Auditoría</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">{selectedEntry.id}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500">Tipo de evento:</span>
                <div className="font-mono text-amber-300 font-semibold">{selectedEntry.type}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Entidad:</span>
                  <div className="text-white">{selectedEntry.entity}</div>
                </div>
                <div>
                  <span className="text-slate-500">ID de Entidad:</span>
                  <div className="font-mono text-slate-300 truncate">{selectedEntry.entity_id}</div>
                </div>
              </div>

              <div>
                <span className="text-slate-500">Actor responsable:</span>
                <div className="text-slate-200">{selectedEntry.actor}</div>
              </div>

              <div>
                <span className="text-slate-500">Resultado (Outcome):</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed">
                  {selectedEntry.outcome}
                </div>
              </div>

              <div>
                <span className="text-slate-500">Procedencia / Origen de ejecución:</span>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400">
                  {selectedEntry.provenance}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
