import React, { useState } from 'react';
import {
  Database,
  RefreshCw,
  Building,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CrmView: React.FC = () => {
  const { crmRecords, syncCrmRecord } = useApp();

  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    await syncCrmRecord(id);
    setSyncingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Strict architectural rule banner (Section 3.5) */}
      <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4" />
            <span>Integración CRM Local ACLIMAR — Arquitectura de Seguridad</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            API REST ÚNICAMENTE
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Regla Mandatoria:</strong> ACLIMAR Assistant nunca escribe directamente en la base de datos del CRM (SQLite/PostgreSQL corporativa).
          Toda consulta o actualización de estado viaja a través del gateway seguro <code>http://127.0.0.1:8000/api/crm/*</code> con validación de esquema, preservando la integridad del sistema central.
        </p>
      </div>

      {/* CRM Records Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-wider text-white">
            Expedientes de Ofertas &amp; Obras Vinculadas
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {crmRecords.length} registros sincronizados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Obra / Expediente</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Fase</th>
                <th className="px-4 py-3 text-right">Presupuesto</th>
                <th className="px-4 py-3">Última Sincro API</th>
                <th className="px-4 py-3 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {crmRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-amber-300 font-semibold">
                    {record.code}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {record.title}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {record.client}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] border ${
                        record.stage === 'Adjudicada'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                          : record.stage === 'Estudio'
                          ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                          : 'bg-amber-950/60 text-amber-300 border-amber-800'
                      }`}
                    >
                      {record.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-200">
                    {record.budget > 0
                      ? `${record.budget.toLocaleString('es-ES')} €`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                    {new Date(record.last_api_sync).toLocaleString('es-ES', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleSync(record.id)}
                      disabled={syncingId === record.id}
                      className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium inline-flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw
                        className={`w-3 h-3 ${syncingId === record.id ? 'animate-spin text-amber-400' : ''}`}
                      />
                      <span>Sync API</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
