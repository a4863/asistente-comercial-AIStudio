/**
 * Tipos de datos para ACLIMAR Assistant
 * Basado estrictamente en el Master File (MF) de arquitectura funcional.
 */

export type ReviewState = 'not_reviewed' | 'accepted' | 'rejected' | 'reconfirmed';

export type TaskStatus = 'proposed' | 'pending' | 'completed' | 'cancelled';

export type NextStepStatus = 'proposed' | 'planned' | 'completed' | 'cancelled';

export type CalendarActionState =
  | 'prepared'
  | 'submitting'
  | 'created'
  | 'uncertain'
  | 'failed_retryable'
  | 'failed_terminal'
  | 'cancelled';

export type DraftActionState =
  | 'approved'
  | 'submitting'
  | 'created'
  | 'uncertain'
  | 'failed_retryable'
  | 'failed_terminal'
  | 'invalidated';

export interface EmailMessage {
  id: string;
  message_id: string;
  folder: 'INBOX' | 'Sent';
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
  date: string;
  conversation_id: string;
  analysis_state: 'pending' | 'completed' | 'not_required';
  commercial_state: 'Petición oferta' | 'Negociación' | 'Seguimiento' | 'Aclaración técnica' | 'Informativo' | 'Adjudicada';
  has_pending_actions: boolean;
  references?: string[];
  in_reply_to?: string;
  client_name?: string;
}

export interface Conversation {
  id: string;
  subject: string;
  messages_count: number;
  last_date: string;
  participants: string[];
  summary?: string;
  status: 'active' | 'closed';
}

export interface CommercialCommitment {
  id: string;
  debtor: 'ACLIMAR' | 'Cliente' | 'Tercero';
  description: string;
  deadline?: string;
  source_excerpt: string;
}

export interface ProposedTask {
  id: string;
  source_email_id: string;
  source_excerpt: string;
  text: string;
  priority: 'alta' | 'media' | 'baja';
  review_state: ReviewState;
  review_actor?: string;
  reviewed_at?: string;
  status: TaskStatus;
  due_date?: string;
  assigned_to?: string;
}

export interface ProposedNextStep {
  id: string;
  source_email_id: string;
  source_excerpt: string;
  text: string;
  proposed_date: string;
  review_state: ReviewState;
  review_actor?: string;
  reviewed_at?: string;
  status: NextStepStatus;
  client_name: string;
  calendar_action_id?: string;
}

export interface AIAnalysis {
  id: string;
  email_id: string;
  created_at: string;
  model: string;
  resumen: string;
  preguntas: string[];
  compromisos: CommercialCommitment[];
  propuestas_tareas: ProposedTask[];
  propuestas_siguientes_pasos: ProposedNextStep[];
}

export interface CalendarAction {
  id: string;
  next_step_id: string;
  title: string;
  start_time: string;
  end_time: string;
  timezone: string;
  description: string;
  calendar_name: string; // e.g., "Alex Google"
  state: CalendarActionState;
  remote_event_id?: string;
  prepared_at: string;
  created_at?: string;
  error_message?: string;
  client_ref: string;
  actor: string;
}

export interface EmailDraftRevision {
  id: string;
  proposal_id: string;
  version: number;
  from: string;
  to: string[];
  cc: string[];
  subject: string;
  body: string;
  created_at: string;
  actor: string;
  previous_revision_id: string | null;
}

export interface EmailDraftReview {
  id: string;
  revision_id: string;
  state: ReviewState;
  actor: string;
  timestamp: string;
  notes?: string;
}

export interface EmailDraftProposal {
  id: string;
  source_record_id: string;
  conversation_id: string;
  source_subject: string;
  source_sender: string;
  source_date: string;
  actor: string;
  created_at: string;
  revisions: EmailDraftRevision[];
  current_revision_id: string;
  review: EmailDraftReview | null;
}

export interface EmailDraftAction {
  id: string;
  source_record_id: string;
  conversation_id: string;
  revision_id: string;
  review_id: string;
  accepted_review_id: string;
  from_address: string;
  to_json: string[];
  cc_json: string[];
  subject: string;
  body: string;
  message_date: string;
  message_id: string;
  in_reply_to: string;
  references_json: string[];
  target_folder: string; // 'INBOX.Drafts.Borradores Asistente'
  target_folder_label: string; // 'Borradores Asistente'
  payload_digest: string; // SHA-256
  state: DraftActionState;
  actor: string;
  remote_uid: string | null;
  uidvalidity: string | null;
  failure_code: string | null;
  invalidated_at: string | null;
  invalidated_by: string | null;
  invalidation_reason: string | null;
  invalidation_provenance: string | null;
  replaces_action_id: string | null;
  created_at: string;
}

export interface CommercialNote {
  id: string;
  type: 'reunion' | 'llamada' | 'visita' | 'acuerdo' | 'observacion';
  client: string;
  project?: string;
  title: string;
  content: string;
  date: string;
  actor: string;
  extracted_tasks?: string[];
  extracted_next_steps?: string[];
}

export interface WhatsAppSnippet {
  id: string;
  contact_name: string;
  phone: string;
  date: string;
  raw_text: string;
  status: 'raw' | 'analyzed';
  client_ref?: string;
  extracted_commitments: string[];
  extracted_tasks: string[];
}

export interface CrmRecord {
  id: string;
  code: string;
  title: string;
  type: 'obra' | 'oferta' | 'cliente';
  client: string;
  stage: 'Estudio' | 'Presentada' | 'En negociación' | 'Adjudicada' | 'Desestimada';
  budget: number;
  last_api_sync: string;
  sync_status: 'synced' | 'pending_sync';
}

export type AuditEventType =
  | 'analysis_completed'
  | 'proposal_reviewed'
  | 'task_materialized'
  | 'next_step_materialized'
  | 'calendar_action_prepared'
  | 'calendar_action_submitting'
  | 'calendar_action_created'
  | 'calendar_action_uncertain'
  | 'draft_action_invalidated'
  | 'draft_replacement_prepared'
  | 'draft_append_submitting'
  | 'draft_append_created'
  | 'draft_append_uncertain'
  | 'crm_api_sync'
  | 'imap_sync';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  type: AuditEventType;
  entity: string;
  entity_id: string;
  outcome: string;
  provenance: string;
  technical_details?: Record<string, unknown>;
}
