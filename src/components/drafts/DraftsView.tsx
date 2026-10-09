import React, { useState } from 'react';
import {
  FileEdit,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  RefreshCw,
  Plus,
  Send,
  Eye,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Folder,
  Hash,
  Clock,
  Layers,
  Copy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EmailDraftAction, EmailDraftProposal, DraftActionState } from '../../types';

export const DraftsView: React.FC = () => {
  const {
    draftProposals,
    draftActions,
    createDraftRevision,
    reviewDraftRevision,
    prepareDraftAction,
    executeDraftAppend,
    invalidateDraftAction,
    prepareReplacementDraftAction,
    reconcileDraftAction,
    emails,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'PROPOSALS'>('ACTIONS');
  const [selectedActionId, setSelectedActionId] = useState<string | null>(draftActions[0]?.id || null);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(draftProposals[0]?.id || null);

  // Modal / Form state for new revision or reason
  const [isEditingRevision, setIsEditingRevision] = useState(false);
  const [revisionBody, setRevisionBody] = useState('');
  const [revisionTo, setRevisionTo] = useState('');
  const [revisionCc, setRevisionCc] = useState('');
  const [revisionSubject, setRevisionSubject] = useState('');

  const [invalidationModalOpen, setInvalidationModalOpen] = useState(false);
  const [invalidationReason, setInvalidationReason] = useState('');

  const selectedAction = draftActions.find((a) => a.id === selectedActionId);
  const selectedProposal = draftProposals.find((p) => p.id === selectedProposalId);

  const startEditRevision = (proposal: EmailDraftProposal) => {
    const curRev = proposal.revisions.find((r) => r.id === proposal.current_revision_id) || proposal.revisions[0];
    setRevisionTo(curRev.to.join(', '));
    setRevisionCc(curRev.cc.join(', '));
    setRevisionSubject(curRev.subject);
    setRevisionBody(curRev.body);
    setIsEditingRevision(true);
  };

  const submitNewRevision = (proposalId: string) => {
    if (!revisionSubject.trim() || !revisionBody.trim()) {
      alert('Asunto y cuerpo son obligatorios.');
      return;
    }
    const toArray = revisionTo.split(',').map((s) => s.trim()).filter(Boolean);
    const ccArray = revisionCc.split(',').map((s) => s.trim()).filter(Boolean);

    createDraftRevision(proposalId, {
      to: toArray,
      cc: ccArray,
      subject: revisionSubject,
      body: revisionBody,
    });
    setIsEditingRevision(false);
  };

  const handleOpenInvalidation = () => {
    setInvalidationReason('Inconsistencia en cabeceras MIME o decisión de anulación por usuario');
    setInvalidationModalOpen(true);
  };

  const confirmInvalidation = () => {
    if (!selectedAction) return;
    invalidateDraftAction(selectedAction.id, invalidationReason);
    setInvalidationModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ABSOLUTE SYSTEM RULE BANNER (Section 10 & 11) */}
      <div className="p-4 rounded-lg bg-slate-900/90 border border-amber-500/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Regla Contractual Absoluta: ACLIMAR Assistant NO ENVÍA CORREOS</span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            CERO SMTP / NO SEND
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Esta aplicación nunca despacha correos a servidores SMTP remotos ni a destinatarios. Todos los borradores
          se compilan como snapshots RFC 2822 inmutables y se depositan de forma supervisada exclusivamente en la carpeta IMAP
          dedicada: <code className="text-amber-300 font-mono">INBOX.Drafts.Borradores Asistente</code> (visualizada en Outlook como <strong>&quot;Borradores Asistente&quot;</strong>). El usuario revisa y realiza el envío manual definitivo desde Microsoft Outlook.
        </p>
      </div>

      {/* TABS: Snapshots Preparados vs Propuestas en Revisión */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('ACTIONS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-2 ${
              activeTab === 'ACTIONS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Acciones de Borrador Preparadas (Snapshots)</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {draftActions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('PROPOSALS')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-2 ${
              activeTab === 'PROPOSALS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Propuestas &amp; Revisiones Históricas</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
              {draftProposals.length}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-2">
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span>Destino IMAP: <strong>Borradores Asistente</strong></span>
        </div>
      </div>

      {/* VIEW CONTENT */}
      {activeTab === 'ACTIONS' ? (
        /* TAB 1: EMAIL DRAFT ACTIONS (SECTIONS 16-23) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of actions */}
          <div className="space-y-2 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Snapshots de EmailDraftAction
            </div>
            <div className="space-y-2">
              {draftActions.map((action) => {
                const isSelected = selectedActionId === action.id;
                return (
                  <div
                    key={action.id}
                    onClick={() => setSelectedActionId(action.id)}
                    className={`p-3 rounded-lg border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-[10px] text-slate-400">{action.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold border ${
                          action.state === 'created'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                            : action.state === 'approved'
                            ? 'bg-blue-950/70 text-blue-300 border-blue-800'
                            : action.state === 'uncertain'
                            ? 'bg-amber-950/70 text-amber-300 border-amber-800 animate-pulse'
                            : action.state === 'invalidated'
                            ? 'bg-rose-950/70 text-rose-300 border-rose-800 line-through'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {action.state}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 truncate mb-1">
                      {action.subject}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="truncate max-w-[140px]">Para: {action.to_json.join(', ')}</span>
                      {action.replaces_action_id && (
                        <span className="text-amber-400 font-mono text-[10px]">
                          Reemplazo de {action.replaces_action_id.slice(0, 12)}...
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Snapshot Inspection & Execution Controls (Section 30) */}
          <div className="lg:col-span-2">
            {selectedAction ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-5">
                {/* Header state status bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-white">Snapshot Inmutable de Borrador</h2>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border ${
                          selectedAction.state === 'created'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            : selectedAction.state === 'approved'
                            ? 'bg-blue-950 text-blue-300 border-blue-800'
                            : selectedAction.state === 'uncertain'
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : selectedAction.state === 'invalidated'
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Estado: {selectedAction.state}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Destino verificado: <strong>{selectedAction.target_folder}</strong> ({selectedAction.target_folder_label})
                    </p>
                  </div>

                  {/* Contextual Action Button based on state (Section 30 of MF) */}
                  <div className="flex items-center gap-2">
                    {selectedAction.state === 'approved' && (
                      <button
                        onClick={() => executeDraftAppend(selectedAction.id, 'success')}
                        className="px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                        title="Escribir borrador en buzón IMAP (CERO SMTP)"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Create mailbox draft</span>
                      </button>
                    )}

                    {selectedAction.state === 'uncertain' && (
                      <button
                        onClick={() => reconcileDraftAction(selectedAction.id)}
                        className="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                        title="Búsqueda read-only en buzón por Message-ID y digest"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reconcile (Read-Only)</span>
                      </button>
                    )}

                    {selectedAction.state === 'invalidated' && (
                      <button
                        onClick={() => prepareReplacementDraftAction(selectedAction.id)}
                        className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                        title="Generar nueva acción de reemplazo preservando snapshot anterior"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Prepare Replacement</span>
                      </button>
                    )}

                    {selectedAction.state === 'created' && (
                      <div className="px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Borrador creado en Outlook</span>
                      </div>
                    )}

                    {/* Invalidation trigger for approved/uncertain */}
                    {(selectedAction.state === 'approved' || selectedAction.state === 'uncertain') && (
                      <button
                        onClick={handleOpenInvalidation}
                        className="px-2.5 py-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium cursor-pointer"
                        title="Invalidar acción por fallo o cambio de criterio"
                      >
                        Invalidar
                      </button>
                    )}
                  </div>
                </div>

                {/* If Invalidated -> Display Invalidation Details */}
                {selectedAction.state === 'invalidated' && (
                  <div className="p-3 rounded bg-rose-950/40 border border-rose-800 text-xs text-rose-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-rose-300">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Acción Invalidada Terminalmente</span>
                    </div>
                    <div>
                      <strong>Motivo:</strong> {selectedAction.invalidation_reason || 'No especificado'}
                    </div>
                    <div className="text-[11px] text-rose-300/80 font-mono">
                      Invalidado por {selectedAction.invalidated_by} a las {selectedAction.invalidated_at}.
                      Snapshot original preservado inmutable para auditoría.
                    </div>
                  </div>
                )}

                {/* Simulated test controls to demonstrate MF scenarios */}
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Simulador de protocolos IMAP (Offline tests):</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => executeDraftAppend(selectedAction.id, 'uncertain')}
                      disabled={selectedAction.state === 'invalidated' || selectedAction.state === 'created'}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] border border-slate-700 disabled:opacity-40 cursor-pointer"
                    >
                      Simular Timeout (Uncertain)
                    </button>
                    <button
                      onClick={() => executeDraftAppend(selectedAction.id, 'success')}
                      disabled={selectedAction.state === 'invalidated' || selectedAction.state === 'created'}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[11px] border border-slate-700 disabled:opacity-40 cursor-pointer"
                    >
                      Simular Éxito (Append OK)
                    </button>
                  </div>
                </div>

                {/* Snapshot Approved Headers & Content */}
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cabeceras RFC 2822 Deterministas
                  </div>

                  <div className="p-3 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                    <div><span className="text-slate-500">From:</span> {selectedAction.from_address}</div>
                    <div><span className="text-slate-500">To:</span> {selectedAction.to_json.join(', ')}</div>
                    {selectedAction.cc_json.length > 0 && (
                      <div><span className="text-slate-500">Cc:</span> {selectedAction.cc_json.join(', ')}</div>
                    )}
                    <div><span className="text-slate-500">Subject:</span> <strong className="text-white">{selectedAction.subject}</strong></div>
                    <div><span className="text-slate-500">Date:</span> {selectedAction.message_date}</div>
                    <div><span className="text-slate-500">Message-ID:</span> {selectedAction.message_id}</div>
                    <div><span className="text-slate-500">In-Reply-To:</span> {selectedAction.in_reply_to}</div>
                    <div>
                      <span className="text-slate-500">References (Plegado RFC):</span>
                      <div className="pl-4 text-[11px] text-slate-400">
                        {selectedAction.references_json.map((ref, i) => (
                          <div key={i}>{ref}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body MIME Plain Text Content */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Cuerpo MIME (text/plain; charset=UTF-8; format=flowed)
                  </div>
                  <pre className="p-3.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {selectedAction.body}
                  </pre>
                </div>

                {/* Cryptographic & RFC Technical Proof */}
                <div className="p-3 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono space-y-1 text-slate-400">
                  <div className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
                    Auditoría de Inmutabilidad
                  </div>
                  <div className="truncate">
                    <strong>payload_digest (SHA-256):</strong> {selectedAction.payload_digest}
                  </div>
                  <div>
                    <strong>Actor:</strong> {selectedAction.actor} · <strong>Preparado:</strong> {selectedAction.created_at}
                  </div>
                  {selectedAction.remote_uid && (
                    <div className="text-emerald-400">
                      <strong>UID IMAP Remoto:</strong> {selectedAction.remote_uid} (UIDValidity: {selectedAction.uidvalidity})
                    </div>
                  )}
                  {selectedAction.replaces_action_id && (
                    <div className="text-amber-300">
                      <strong>replaces_action_id:</strong> {selectedAction.replaces_action_id}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                Selecciona una acción de borrador para examinar su snapshot.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* TAB 2: PROPOSALS & REVISIONS WORKFLOW (SECTIONS 13-15) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of Proposals */}
          <div className="space-y-2 lg:col-span-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Propuestas de Respuesta Locales
            </div>
            <div className="space-y-2">
              {draftProposals.map((prop) => {
                const isSelected = selectedProposalId === prop.id;
                return (
                  <div
                    key={prop.id}
                    onClick={() => {
                      setSelectedProposalId(prop.id);
                      setIsEditingRevision(false);
                    }}
                    className={`p-3 rounded-lg border transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-slate-400">{prop.id}</span>
                      <span
                        className={`px-2 py-0.2 rounded font-mono text-[10px] ${
                          prop.review?.state === 'accepted'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {prop.review?.state || 'not_reviewed'}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">{prop.source_subject}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {prop.revisions.length} revisiones · De: {prop.source_sender}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Proposal Revisions & Human Review Controls */}
          <div className="lg:col-span-2">
            {selectedProposal ? (
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      Propuesta de Respuesta para &quot;{selectedProposal.source_subject}&quot;
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Correo fuente: {selectedProposal.source_sender} · {selectedProposal.source_date}
                    </p>
                  </div>
                  <button
                    onClick={() => startEditRevision(selectedProposal)}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Crear nueva revisión</span>
                  </button>
                </div>

                {/* Form to create next revision if active */}
                {isEditingRevision ? (
                  <div className="p-4 rounded-lg bg-slate-950 border border-amber-500/50 space-y-3">
                    <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      Nueva Versión de Revisión (v{selectedProposal.revisions.length + 1})
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400">Para (To):</label>
                        <input
                          type="text"
                          value={revisionTo}
                          onChange={(e) => setRevisionTo(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400">Cc (Vacío por defecto):</label>
                        <input
                          type="text"
                          value={revisionCc}
                          onChange={(e) => setRevisionCc(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-slate-400">Asunto (Prefijo único Re:):</label>
                        <input
                          type="text"
                          value={revisionSubject}
                          onChange={(e) => setRevisionSubject(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-200"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-slate-400">Cuerpo del borrador (text/plain):</label>
                        <textarea
                          rows={6}
                          value={revisionBody}
                          onChange={(e) => setRevisionBody(e.target.value)}
                          className="w-full mt-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded text-slate-200 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setIsEditingRevision(false)}
                        className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => submitNewRevision(selectedProposal.id)}
                        className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                      >
                        Guardar Revisión Append-Only
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* History of Revisions */}
                <div className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Historial de Revisiones
                  </div>

                  <div className="space-y-3">
                    {selectedProposal.revisions.map((rev) => {
                      const isCurrent = rev.id === selectedProposal.current_revision_id;
                      const isAccepted = selectedProposal.review?.revision_id === rev.id && selectedProposal.review.state === 'accepted';

                      return (
                        <div
                          key={rev.id}
                          className={`p-4 rounded-lg border text-xs space-y-3 ${
                            isCurrent
                              ? 'bg-slate-950/90 border-slate-700'
                              : 'bg-slate-950/40 border-slate-800/60 opacity-80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-200">Revisión v{rev.version}</span>
                              <span className="font-mono text-[10px] text-slate-400">ID: {rev.id}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                                  Actual
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Creado por {rev.actor} · {new Date(rev.created_at).toLocaleTimeString('es-ES')}
                            </div>
                          </div>

                          <div className="p-3 rounded bg-slate-900 border border-slate-800/80 font-mono text-[11px] space-y-1 text-slate-300">
                            <div><span className="text-slate-500">De:</span> {rev.from}</div>
                            <div><span className="text-slate-500">Para:</span> {rev.to.join(', ')}</div>
                            {rev.cc.length > 0 && <div><span className="text-slate-500">Cc:</span> {rev.cc.join(', ')}</div>}
                            <div><span className="text-slate-500">Asunto:</span> {rev.subject}</div>
                            <div className="pt-2 text-slate-200 whitespace-pre-wrap font-sans text-xs">
                              {rev.body}
                            </div>
                          </div>

                          {/* Review actions for this revision */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <div className="text-[11px] text-slate-400">
                              Estado de revisión:{' '}
                              <strong className={isAccepted ? 'text-emerald-400' : 'text-amber-400'}>
                                {selectedProposal.review?.revision_id === rev.id
                                  ? selectedProposal.review.state
                                  : 'not_reviewed'}
                              </strong>
                            </div>

                            <div className="flex items-center gap-2">
                              {!isAccepted && (
                                <>
                                  <button
                                    onClick={() => reviewDraftRevision(selectedProposal.id, rev.id, 'accepted')}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 text-xs font-semibold cursor-pointer"
                                  >
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span>Aceptar Revisión</span>
                                  </button>
                                  <button
                                    onClick={() => reviewDraftRevision(selectedProposal.id, rev.id, 'rejected')}
                                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-semibold cursor-pointer"
                                  >
                                    <X className="w-3 h-3 text-rose-400" />
                                    <span>Rechazar</span>
                                  </button>
                                </>
                              )}

                              {isAccepted && (
                                <button
                                  onClick={() => prepareDraftAction(selectedProposal.id, rev.id)}
                                  className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                                >
                                  <FileCode className="w-3.5 h-3.5" />
                                  <span>Prepare EmailDraftAction</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500">
                Selecciona una propuesta para gestionar su ciclo de revisiones.
              </div>
            )}
          </div>
        </div>
      )}

      {/* INVALIDATION REASON MODAL */}
      {invalidationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Confirmar Invalidación de Acción</span>
            </div>
            <p className="text-xs text-slate-300">
              La invalidación es <strong>terminal</strong>. La acción no podrá ejecutarse en el buzón IMAP, pero conservará su snapshot original inalterable para trazabilidad y auditoría.
            </p>
            <div>
              <label className="text-xs text-slate-400">Motivo de la invalidación:</label>
              <textarea
                rows={3}
                value={invalidationReason}
                onChange={(e) => setInvalidationReason(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setInvalidationModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmInvalidation}
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                Invalidar Acción Definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
