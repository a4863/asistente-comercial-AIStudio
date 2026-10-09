import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  EmailMessage,
  Conversation,
  AIAnalysis,
  ProposedTask,
  ProposedNextStep,
  CalendarAction,
  EmailDraftProposal,
  EmailDraftAction,
  CommercialNote,
  WhatsAppSnippet,
  CrmRecord,
  AuditEntry,
  ReviewState,
  DraftActionState,
} from '../types';
import {
  INITIAL_EMAILS,
  INITIAL_CONVERSATIONS,
  INITIAL_ANALYSES,
  INITIAL_CALENDAR_ACTIONS,
  INITIAL_DRAFT_PROPOSALS,
  INITIAL_DRAFT_ACTIONS,
  INITIAL_COMMERCIAL_NOTES,
  INITIAL_WHATSAPP_SNIPPETS,
  INITIAL_CRM_RECORDS,
  INITIAL_AUDIT_LOG,
} from '../data/mockData';

export type NavigationSection =
  | 'inicio'
  | 'correo'
  | 'analisis'
  | 'tareas'
  | 'siguientes-pasos'
  | 'calendario'
  | 'borradores'
  | 'notas'
  | 'whatsapp'
  | 'crm'
  | 'auditoria'
  | 'configuracion';

interface AppContextType {
  // Navigation & View State
  currentSection: NavigationSection;
  setCurrentSection: (section: NavigationSection) => void;
  selectedEmailId: string | null;
  setSelectedEmailId: (id: string | null) => void;
  selectedDraftActionId: string | null;
  setSelectedDraftActionId: (id: string | null) => void;

  // Data
  emails: EmailMessage[];
  conversations: Conversation[];
  analyses: Record<string, AIAnalysis>;
  tasks: ProposedTask[];
  nextSteps: ProposedNextStep[];
  calendarActions: CalendarAction[];
  draftProposals: EmailDraftProposal[];
  draftActions: EmailDraftAction[];
  commercialNotes: CommercialNote[];
  whatsappSnippets: WhatsAppSnippet[];
  crmRecords: CrmRecord[];
  auditLog: AuditEntry[];

  // Operation flags
  isSyncingImap: boolean;
  isAnalyzing: boolean;

  // Actions
  syncImap: () => Promise<void>;
  runAIAnalysis: (emailId: string) => Promise<void>;
  reviewTask: (taskId: string, reviewState: ReviewState, notes?: string) => void;
  materializeTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
  reviewNextStep: (stepId: string, reviewState: ReviewState) => void;
  materializeNextStep: (stepId: string) => void;
  prepareCalendarAction: (stepId: string) => void;
  executeCalendarAction: (actionId: string, simulateUncertain?: boolean) => Promise<void>;
  createDraftProposalFromEmail: (emailId: string) => string;
  createDraftRevision: (proposalId: string, data: { to: string[]; cc: string[]; subject: string; body: string }) => void;
  reviewDraftRevision: (proposalId: string, revisionId: string, state: ReviewState, notes?: string) => void;
  prepareDraftAction: (proposalId: string, revisionId: string) => void;
  executeDraftAppend: (actionId: string, simulateResult?: 'success' | 'uncertain' | 'failed') => Promise<void>;
  invalidateDraftAction: (actionId: string, reason: string) => void;
  prepareReplacementDraftAction: (invalidatedActionId: string) => void;
  reconcileDraftAction: (actionId: string) => Promise<void>;
  addCommercialNote: (note: Omit<CommercialNote, 'id' | 'date' | 'actor'>) => void;
  addWhatsAppSnippet: (rawText: string, contactName: string, phone: string) => void;
  syncCrmRecord: (recordId: string) => Promise<void>;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'aclimar_assistant_state_v1';

// Helper to generate a realistic SHA-256 fake digest for display
const generateFakeSha256 = (content: string) => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256-${hex}8912ef04c99b8214fa77012389abcdef1234567890abcdef1234567890`.slice(0, 64);
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('inicio');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>('em-001');
  const [selectedDraftActionId, setSelectedDraftActionId] = useState<string | null>(null);

  // Data states initialized from localStorage or defaults
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>(INITIAL_ANALYSES);

  // Extract all initial tasks and next steps from analyses
  const [tasks, setTasks] = useState<ProposedTask[]>(() => {
    const list: ProposedTask[] = [];
    Object.values(INITIAL_ANALYSES).forEach((an) => {
      an.propuestas_tareas.forEach((t) => list.push(t));
    });
    return list;
  });

  const [nextSteps, setNextSteps] = useState<ProposedNextStep[]>(() => {
    const list: ProposedNextStep[] = [];
    Object.values(INITIAL_ANALYSES).forEach((an) => {
      an.propuestas_siguientes_pasos.forEach((ns) => list.push(ns));
    });
    return list;
  });

  const [calendarActions, setCalendarActions] = useState<CalendarAction[]>(INITIAL_CALENDAR_ACTIONS);
  const [draftProposals, setDraftProposals] = useState<EmailDraftProposal[]>(INITIAL_DRAFT_PROPOSALS);
  const [draftActions, setDraftActions] = useState<EmailDraftAction[]>(INITIAL_DRAFT_ACTIONS);
  const [commercialNotes, setCommercialNotes] = useState<CommercialNote[]>(INITIAL_COMMERCIAL_NOTES);
  const [whatsappSnippets, setWhatsappSnippets] = useState<WhatsAppSnippet[]>(INITIAL_WHATSAPP_SNIPPETS);
  const [crmRecords, setCrmRecords] = useState<CrmRecord[]>(INITIAL_CRM_RECORDS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);

  const [isSyncingImap, setIsSyncingImap] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Try to load persisted state once on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.emails) setEmails(parsed.emails);
        if (parsed.conversations) setConversations(parsed.conversations);
        if (parsed.analyses) setAnalyses(parsed.analyses);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (parsed.nextSteps) setNextSteps(parsed.nextSteps);
        if (parsed.calendarActions) setCalendarActions(parsed.calendarActions);
        if (parsed.draftProposals) setDraftProposals(parsed.draftProposals);
        if (parsed.draftActions) setDraftActions(parsed.draftActions);
        if (parsed.commercialNotes) setCommercialNotes(parsed.commercialNotes);
        if (parsed.whatsappSnippets) setWhatsappSnippets(parsed.whatsappSnippets);
        if (parsed.crmRecords) setCrmRecords(parsed.crmRecords);
        if (parsed.auditLog) setAuditLog(parsed.auditLog);
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  // Save state on changes
  useEffect(() => {
    const stateToSave = {
      emails,
      conversations,
      analyses,
      tasks,
      nextSteps,
      calendarActions,
      draftProposals,
      draftActions,
      commercialNotes,
      whatsappSnippets,
      crmRecords,
      auditLog,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    emails,
    conversations,
    analyses,
    tasks,
    nextSteps,
    calendarActions,
    draftProposals,
    draftActions,
    commercialNotes,
    whatsappSnippets,
    crmRecords,
    auditLog,
  ]);

  const addAuditEntry = (
    type: AuditEntry['type'],
    entity: string,
    entityId: string,
    outcome: string,
    provenance: string,
    technical?: Record<string, unknown>
  ) => {
    const newEntry: AuditEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor: 'Alejandro López',
      type,
      entity,
      entity_id: entityId,
      outcome,
      provenance,
      technical_details: technical,
    };
    setAuditLog((prev) => [newEntry, ...prev]);
  };

  const syncImap = async () => {
    setIsSyncingImap(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSyncingImap(false);
    addAuditEntry(
      'imap_sync',
      'IMAP_Buzon',
      'INBOX',
      'Sincronización incremental IMAP completada con BODY.PEEK. 4 mensajes activos verificados.',
      'Worker IMAP local (127.0.0.1:8000 -> imap.aclimar.es:993 TLS)'
    );
  };

  const runAIAnalysis = async (emailId: string) => {
    setIsAnalyzing(true);
    const email = emails.find((e) => e.id === emailId);
    if (!email) {
      setIsAnalyzing(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    const newAnalysis: AIAnalysis = {
      id: `an-${Date.now()}`,
      email_id: emailId,
      created_at: new Date().toISOString(),
      model: 'Gemini 3.8 Flash (Local B2B Extraction Engine)',
      resumen: `Análisis comercial estructurado para "${email.subject}". Mensaje recibido de ${email.from}. Se identifican requerimientos técnicos y solicitud de cotización para instalaciones HVAC.`,
      preguntas: [
        '¿Se requiere incluir replanteo in situ previo a la emisión de la oferta?',
        '¿El plazo solicitado de entrega es improrrogable?',
      ],
      compromisos: [
        {
          id: `comp-${Date.now()}`,
          debtor: 'ACLIMAR',
          description: `Responder a ${email.from} con análisis preliminar de alcance.`,
          deadline: '24-48 horas hábiles',
          source_excerpt: email.body.slice(0, 80),
        },
      ],
      propuestas_tareas: [
        {
          id: `pt-${Date.now()}-1`,
          source_email_id: emailId,
          source_excerpt: email.body.slice(0, 100),
          text: `Estudio técnico y estimación de costes para "${email.subject.replace('Petición oferta - ', '')}"`,
          priority: 'alta',
          review_state: 'not_reviewed',
          status: 'proposed',
          due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        },
      ],
      propuestas_siguientes_pasos: [
        {
          id: `pns-${Date.now()}-1`,
          source_email_id: emailId,
          source_excerpt: email.body.slice(0, 100),
          text: `Contactar por teléfono con remitente para precisar alcance técnico`,
          proposed_date: new Date(Date.now() + 86400000).toISOString(),
          review_state: 'not_reviewed',
          status: 'proposed',
          client_name: email.client_name || 'Cliente',
        },
      ],
    };

    setAnalyses((prev) => ({ ...prev, [emailId]: newAnalysis }));
    setTasks((prev) => [...prev, ...newAnalysis.propuestas_tareas]);
    setNextSteps((prev) => [...prev, ...newAnalysis.propuestas_siguientes_pasos]);

    setEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, analysis_state: 'completed', has_pending_actions: true } : e))
    );

    setIsAnalyzing(false);
    addAuditEntry(
      'analysis_completed',
      'EmailMessage',
      emailId,
      `Análisis comercial generado con 1 compromiso, 1 tarea y 1 siguiente paso propuesto`,
      'Gemini 3.8 Flash (Local B2B Extraction Engine)'
    );
  };

  const reviewTask = (taskId: string, reviewState: ReviewState, notes?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              review_state: reviewState,
              reviewed_at: new Date().toISOString(),
              review_actor: 'Alejandro López',
            }
          : t
      )
    );

    addAuditEntry(
      'proposal_reviewed',
      'ProposedTask',
      taskId,
      `Propuesta de tarea marcada como "${reviewState}". ${notes ? `Notas: ${notes}` : ''}`,
      'Revisión humana en UI Local'
    );
  };

  const materializeTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.review_state !== 'accepted') {
      alert('Regla de seguridad: Una tarea solo puede materializarse tras haber sido ACEPTADA por el usuario.');
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'pending' } : t))
    );

    addAuditEntry(
      'task_materialized',
      'Task',
      taskId,
      `Tarea materializada a estado operativo "pending" con fecha límite ${task.due_date || 'sin fecha'}`,
      'Autorización explícita de materialización'
    );
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === 'completed' ? 'pending' : 'completed';
        return { ...t, status: newStatus };
      })
    );
  };

  const reviewNextStep = (stepId: string, reviewState: ReviewState) => {
    setNextSteps((prev) =>
      prev.map((ns) =>
        ns.id === stepId
          ? {
              ...ns,
              review_state: reviewState,
              reviewed_at: new Date().toISOString(),
              review_actor: 'Alejandro López',
            }
          : ns
      )
    );

    addAuditEntry(
      'proposal_reviewed',
      'ProposedNextStep',
      stepId,
      `Propuesta de siguiente paso marcada como "${reviewState}"`,
      'Revisión humana en UI Local'
    );
  };

  const materializeNextStep = (stepId: string) => {
    const step = nextSteps.find((s) => s.id === stepId);
    if (!step) return;
    if (step.review_state !== 'accepted') {
      alert('Regla de seguridad: Un siguiente paso solo puede materializarse a "planned" si fue ACEPTADO.');
      return;
    }

    setNextSteps((prev) =>
      prev.map((ns) => (ns.id === stepId ? { ...ns, status: 'planned' } : ns))
    );

    addAuditEntry(
      'next_step_materialized',
      'NextStep',
      stepId,
      `Siguiente paso materializado a estado "planned" para fecha ${step.proposed_date}`,
      'Autorización explícita de materialización'
    );
  };

  const prepareCalendarAction = (stepId: string) => {
    const step = nextSteps.find((s) => s.id === stepId);
    if (!step || step.status !== 'planned') {
      alert('Solo se pueden preparar eventos en el calendario para siguientes pasos en estado "planned".');
      return;
    }

    const actionId = `cal-act-${Date.now()}`;
    const startTime = step.proposed_date;
    const endDate = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();

    const newCalendarAction: CalendarAction = {
      id: actionId,
      next_step_id: stepId,
      title: step.text,
      start_time: startTime,
      end_time: endDate,
      timezone: 'Europe/Madrid',
      description: `Evento comercial ACLIMAR preparado para cliente ${step.client_name}. Procedencia: Siguiente paso ${step.id}.`,
      calendar_name: 'Alex Google',
      state: 'prepared',
      prepared_at: new Date().toISOString(),
      client_ref: step.client_name,
      actor: 'Alejandro López',
    };

    setCalendarActions((prev) => [newCalendarAction, ...prev]);
    setNextSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, calendar_action_id: actionId } : s))
    );

    addAuditEntry(
      'calendar_action_prepared',
      'CalendarAction',
      actionId,
      `Snapshot inmutable de evento preparado para calendario "Alex Google". Requiere aprobación humana expresa para inserción.`,
      `Paso planned ${stepId} -> Snapshot RFC 5545 iCalendar`
    );
  };

  const executeCalendarAction = async (actionId: string, simulateUncertain = false) => {
    const action = calendarActions.find((a) => a.id === actionId);
    if (!action) return;

    // Transition to submitting
    setCalendarActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, state: 'submitting' } : a))
    );

    addAuditEntry(
      'calendar_action_submitting',
      'CalendarAction',
      actionId,
      `Enviando petición de inserción a Google Calendar API (cuenta Alex Google)...`,
      'OAuth Client Local 127.0.0.1'
    );

    await new Promise((r) => setTimeout(r, 600));

    if (simulateUncertain) {
      setCalendarActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                state: 'uncertain',
                error_message: 'Petición enviada pero timeout al recibir confirmación remota. No reintentar sin reconciliación.',
              }
            : a
        )
      );
      addAuditEntry(
        'calendar_action_uncertain',
        'CalendarAction',
        actionId,
        `Resultado ambiguo de inserción en Google Calendar. Marcado en estado UNCERTAIN. Regla: no repetir automáticamente.`,
        'Timeout en respuesta HTTP 200/504'
      );
    } else {
      const remoteId = `gcal_ev_${Date.now()}`;
      setCalendarActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                state: 'created',
                created_at: new Date().toISOString(),
                remote_event_id: remoteId,
              }
            : a
        )
      );
      addAuditEntry(
        'calendar_action_created',
        'CalendarAction',
        actionId,
        `Evento creado en Google Calendar "Alex Google" con ID remoto ${remoteId}`,
        'Aprobación explícita del usuario'
      );
    }
  };

  const createDraftProposalFromEmail = (emailId: string): string => {
    const email = emails.find((e) => e.id === emailId);
    if (!email) return '';

    // Clean subject with strict deterministic "Re: " rule (Section 20 of MF)
    const rawSubject = email.subject.trim();
    const cleanSubject = /^re:\s*/i.test(rawSubject)
      ? rawSubject.replace(/^re:\s*/i, 'Re: ')
      : `Re: ${rawSubject}`;

    const proposalId = `prop-${Date.now()}`;
    const revisionId = `rev-${Date.now()}-v1`;

    const newProposal: EmailDraftProposal = {
      id: proposalId,
      source_record_id: email.id,
      conversation_id: email.conversation_id,
      source_subject: email.subject,
      source_sender: email.from,
      source_date: email.date,
      actor: 'Alejandro López',
      created_at: new Date().toISOString(),
      revisions: [
        {
          id: revisionId,
          proposal_id: proposalId,
          version: 1,
          from: 'Alejandro López <alejandro.lopez@aclimar.es>',
          to: [email.from],
          cc: [],
          subject: cleanSubject,
          body: `Estimado/a,\r\n\r\nConfirmamos la recepción de su correo y documentación correspondiente.\r\nEstamos estudiando los requerimientos técnicos y nos pondremos en contacto a la mayor brevedad.\r\n\r\nAtentamente,\r\nAlejandro López\r\nACLIMAR Climatización y Ventilación`,
          created_at: new Date().toISOString(),
          actor: 'Alejandro López',
          previous_revision_id: null,
        },
      ],
      current_revision_id: revisionId,
      review: null,
    };

    setDraftProposals((prev) => [newProposal, ...prev]);
    return proposalId;
  };

  const createDraftRevision = (
    proposalId: string,
    data: { to: string[]; cc: string[]; subject: string; body: string }
  ) => {
    const proposal = draftProposals.find((p) => p.id === proposalId);
    if (!proposal) return;

    const nextVersion = proposal.revisions.length + 1;
    const newRevId = `rev-${Date.now()}-v${nextVersion}`;

    const newRevision = {
      id: newRevId,
      proposal_id: proposalId,
      version: nextVersion,
      from: 'Alejandro López <alejandro.lopez@aclimar.es>',
      to: data.to,
      cc: data.cc,
      subject: data.subject,
      body: data.body,
      created_at: new Date().toISOString(),
      actor: 'Alejandro López',
      previous_revision_id: proposal.current_revision_id,
    };

    setDraftProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId
          ? {
              ...p,
              revisions: [...p.revisions, newRevision],
              current_revision_id: newRevId,
              // Nueva revisión requiere nueva revisión humana (Section 15)
              review: null,
            }
          : p
      )
    );
  };

  const reviewDraftRevision = (
    proposalId: string,
    revisionId: string,
    state: ReviewState,
    notes?: string
  ) => {
    const reviewId = `revw-${Date.now()}`;
    const newReview = {
      id: reviewId,
      revision_id: revisionId,
      state,
      actor: 'Alejandro López',
      timestamp: new Date().toISOString(),
      notes,
    };

    setDraftProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, review: newReview } : p))
    );

    addAuditEntry(
      'proposal_reviewed',
      'EmailDraftRevision',
      revisionId,
      `Borrador revisión ${revisionId} marcado como "${state}"`,
      'Revisión humana de borrador en UI'
    );
  };

  const prepareDraftAction = (proposalId: string, revisionId: string) => {
    const proposal = draftProposals.find((p) => p.id === proposalId);
    if (!proposal) return;
    const revision = proposal.revisions.find((r) => r.id === revisionId);
    if (!revision) return;
    if (!proposal.review || proposal.review.state !== 'accepted' || proposal.review.revision_id !== revisionId) {
      alert('Regla absoluta: Solo se puede preparar EmailDraftAction a partir de una revisión ACEPTADA.');
      return;
    }

    const email = emails.find((e) => e.id === proposal.source_record_id);
    const sourceMsgId = email?.message_id || `<msg-${Date.now()}@aclimar.local>`;

    // Deterministic references computation (Section 21 of MF)
    let finalReferences: string[] = [];
    if (email?.references && email.references.length > 0) {
      finalReferences = [...email.references, sourceMsgId];
    } else {
      finalReferences = [sourceMsgId];
    }
    // Remove duplicates deterministically
    finalReferences = Array.from(new Set(finalReferences));

    const actionId = `act-draft-${Date.now()}`;
    const generatedMsgId = `<draft.${Date.now()}.${Math.floor(Math.random() * 10000)}.aclimar@local>`;
    const digest = generateFakeSha256(revision.subject + revision.body + generatedMsgId);

    const newAction: EmailDraftAction = {
      id: actionId,
      source_record_id: proposal.source_record_id,
      conversation_id: proposal.conversation_id,
      revision_id: revision.id,
      review_id: proposal.review.id,
      accepted_review_id: proposal.review.id,
      from_address: 'alejandro.lopez@aclimar.es',
      to_json: revision.to,
      cc_json: revision.cc,
      subject: revision.subject,
      body: revision.body,
      message_date: new Date().toUTCString(),
      message_id: generatedMsgId,
      in_reply_to: sourceMsgId,
      references_json: finalReferences,
      target_folder: 'INBOX.Drafts.Borradores Asistente',
      target_folder_label: 'Borradores Asistente',
      payload_digest: digest,
      state: 'approved',
      actor: 'Alejandro López',
      remote_uid: null,
      uidvalidity: null,
      failure_code: null,
      invalidated_at: null,
      invalidated_by: null,
      invalidation_reason: null,
      invalidation_provenance: null,
      replaces_action_id: null,
      created_at: new Date().toISOString(),
    };

    setDraftActions((prev) => [newAction, ...prev]);

    addAuditEntry(
      'draft_replacement_prepared',
      'EmailDraftAction',
      actionId,
      `Snapshot inmutable preparado con destino "Borradores Asistente". Digest: ${digest.slice(0, 16)}... Cero SMTP.`,
      `MIME determinista compilado a partir de revisión aceptada ${revision.id}`
    );
  };

  const executeDraftAppend = async (
    actionId: string,
    simulatedResult: 'success' | 'uncertain' | 'failed' = 'success'
  ) => {
    const action = draftActions.find((a) => a.id === actionId);
    if (!action) return;

    if (action.state === 'invalidated') {
      alert('Una acción invalidada es terminal y nunca puede ejecutarse.');
      return;
    }

    // Set to submitting
    setDraftActions((prev) =>
      prev.map((a) => (a.id === actionId ? { ...a, state: 'submitting' } : a))
    );

    addAuditEntry(
      'draft_append_submitting',
      'EmailDraftAction',
      actionId,
      `Ejecutando comando IMAP APPEND en carpeta "INBOX.Drafts.Borradores Asistente"...`,
      'Escritor IMAP dedicado (puerto 993 TLS). CERO SMTP.'
    );

    await new Promise((r) => setTimeout(r, 650));

    if (simulatedResult === 'uncertain') {
      setDraftActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                state: 'uncertain',
                failure_code: 'SOCKET_TIMEOUT_ON_APPEND',
              }
            : a
        )
      );
      addAuditEntry(
        'draft_append_uncertain',
        'EmailDraftAction',
        actionId,
        'Resultado ambiguo en socket IMAP. Estado fijado a UNCERTAIN. Regla: no repetir APPEND; requiere reconciliación.',
        'Captura de fallo de red en fase APPEND'
      );
    } else if (simulatedResult === 'failed') {
      setDraftActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                state: 'failed_retryable',
                failure_code: 'IMAP_QUOTA_OR_TEMP_ERROR',
              }
            : a
        )
      );
    } else {
      // Success
      const remoteUid = `${Math.floor(10000 + Math.random() * 90000)}`;
      setDraftActions((prev) =>
        prev.map((a) =>
          a.id === actionId
            ? {
                ...a,
                state: 'created',
                remote_uid: remoteUid,
                uidvalidity: '382194',
              }
            : a
        )
      );
      addAuditEntry(
        'draft_append_created',
        'EmailDraftAction',
        actionId,
        `Borrador creado en Outlook mediante IMAP APPEND en "Borradores Asistente" (UID: ${remoteUid}). El usuario enviará manualmente desde Outlook.`,
        'Aprobación explícita "Create mailbox draft"'
      );
    }
  };

  const invalidateDraftAction = (actionId: string, reason: string) => {
    setDraftActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? {
              ...a,
              state: 'invalidated',
              invalidated_at: new Date().toISOString(),
              invalidated_by: 'Alejandro López',
              invalidation_reason: reason,
              invalidation_provenance: 'Acción invalidada por el usuario desde UI',
            }
          : a
      )
    );

    addAuditEntry(
      'draft_action_invalidated',
      'EmailDraftAction',
      actionId,
      `Acción de borrador invalidada: "${reason}". Snapshot original conservado inmutable.`,
      'Intervención manual de seguridad'
    );
  };

  const prepareReplacementDraftAction = (invalidatedActionId: string) => {
    const oldAction = draftActions.find((a) => a.id === invalidatedActionId);
    if (!oldAction || oldAction.state !== 'invalidated') {
      alert('Solo se puede reemplazar una acción que se encuentre en estado "invalidated".');
      return;
    }

    const newActionId = `act-draft-rep-${Date.now()}`;
    const newMsgId = `<draft.${Date.now()}.${Math.floor(Math.random() * 10000)}.aclimar@local>`;
    const newDigest = generateFakeSha256(oldAction.subject + oldAction.body + newMsgId);

    const replacementAction: EmailDraftAction = {
      ...oldAction,
      id: newActionId,
      message_date: new Date().toUTCString(),
      message_id: newMsgId,
      payload_digest: newDigest,
      state: 'approved',
      replaces_action_id: invalidatedActionId,
      invalidated_at: null,
      invalidated_by: null,
      invalidation_reason: null,
      invalidation_provenance: null,
      remote_uid: null,
      failure_code: null,
      created_at: new Date().toISOString(),
    };

    setDraftActions((prev) => [replacementAction, ...prev]);

    addAuditEntry(
      'draft_replacement_prepared',
      'EmailDraftAction',
      newActionId,
      `Nueva EmailDraftAction preparada como reemplazo de ${invalidatedActionId}. Nuevo Message-ID y nuevo digest generados.`,
      `Reemplazo autorizado de acción defectuosa previa ${invalidatedActionId}`
    );
  };

  const reconcileDraftAction = async (actionId: string) => {
    const action = draftActions.find((a) => a.id === actionId);
    if (!action || action.state !== 'uncertain') return;

    await new Promise((r) => setTimeout(r, 600));

    // Simulate read-only search in "Borradores Asistente" by Message-ID & Digest
    const reconciledUid = '99412';
    setDraftActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? {
              ...a,
              state: 'created',
              remote_uid: reconciledUid,
              uidvalidity: '382194',
            }
          : a
      )
    );

    addAuditEntry(
      'draft_append_created',
      'EmailDraftAction',
      actionId,
      `Reconciliación exitosa en modo read-only: Se localizó exactamente 1 coincidencia en "Borradores Asistente" con Message-ID ${action.message_id}. Transición a created.`,
      'Protocolo de reconciliación IMAP determinista'
    );
  };

  const addCommercialNote = (noteData: Omit<CommercialNote, 'id' | 'date' | 'actor'>) => {
    const newNote: CommercialNote = {
      id: `note-${Date.now()}`,
      ...noteData,
      date: new Date().toISOString(),
      actor: 'Alejandro López',
    };
    setCommercialNotes((prev) => [newNote, ...prev]);
  };

  const addWhatsAppSnippet = (rawText: string, contactName: string, phone: string) => {
    const newSnippet: WhatsAppSnippet = {
      id: `wa-${Date.now()}`,
      contact_name: contactName,
      phone,
      date: new Date().toISOString(),
      raw_text: rawText,
      status: 'analyzed',
      extracted_commitments: ['Compromiso extraído: Revisión de datos técnicos por chat'],
      extracted_tasks: ['Registrar en CRM seguimiento derivado de WhatsApp'],
    };
    setWhatsappSnippets((prev) => [newSnippet, ...prev]);
  };

  const syncCrmRecord = async (recordId: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const now = new Date().toISOString();
    setCrmRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, last_api_sync: now, sync_status: 'synced' } : r))
    );

    addAuditEntry(
      'crm_api_sync',
      'CrmRecord',
      recordId,
      `Sincronización mediante API REST exitosa con CRM ACLIMAR (Sin escritura directa a BD).`,
      'Gateway API Local (http://127.0.0.1:8000/api/crm/sync)'
    );
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEmails(INITIAL_EMAILS);
    setConversations(INITIAL_CONVERSATIONS);
    setAnalyses(INITIAL_ANALYSES);

    const taskList: ProposedTask[] = [];
    Object.values(INITIAL_ANALYSES).forEach((an) => an.propuestas_tareas.forEach((t) => taskList.push(t)));
    setTasks(taskList);

    const nextStepList: ProposedNextStep[] = [];
    Object.values(INITIAL_ANALYSES).forEach((an) => an.propuestas_siguientes_pasos.forEach((ns) => nextStepList.push(ns)));
    setNextSteps(nextStepList);

    setCalendarActions(INITIAL_CALENDAR_ACTIONS);
    setDraftProposals(INITIAL_DRAFT_PROPOSALS);
    setDraftActions(INITIAL_DRAFT_ACTIONS);
    setCommercialNotes(INITIAL_COMMERCIAL_NOTES);
    setWhatsappSnippets(INITIAL_WHATSAPP_SNIPPETS);
    setCrmRecords(INITIAL_CRM_RECORDS);
    setAuditLog(INITIAL_AUDIT_LOG);
    setSelectedEmailId('em-001');
    setSelectedDraftActionId(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        selectedEmailId,
        setSelectedEmailId,
        selectedDraftActionId,
        setSelectedDraftActionId,
        emails,
        conversations,
        analyses,
        tasks,
        nextSteps,
        calendarActions,
        draftProposals,
        draftActions,
        commercialNotes,
        whatsappSnippets,
        crmRecords,
        auditLog,
        isSyncingImap,
        isAnalyzing,
        syncImap,
        runAIAnalysis,
        reviewTask,
        materializeTask,
        toggleTaskStatus,
        reviewNextStep,
        materializeNextStep,
        prepareCalendarAction,
        executeCalendarAction,
        createDraftProposalFromEmail,
        createDraftRevision,
        reviewDraftRevision,
        prepareDraftAction,
        executeDraftAppend,
        invalidateDraftAction,
        prepareReplacementDraftAction,
        reconcileDraftAction,
        addCommercialNote,
        addWhatsAppSnippet,
        syncCrmRecord,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
