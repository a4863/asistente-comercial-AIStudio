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
} from '../types';

export const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'em-001',
    message_id: '<20261005.143209.78219.gmunoz@grupobertolin.es>',
    folder: 'INBOX',
    from: 'Gabriel Muñoz <gmunoz@grupobertolin.es>',
    to: ['alejandro.lopez@aclimar.es'],
    cc: ['licitaciones@grupobertolin.es'],
    subject: 'Petición oferta - SEGUNDA UNIDAD DE DISTRITO POLICIA LOCAL VALENCIA',
    date: '2026-10-05T14:32:00+02:00',
    conversation_id: 'conv-bertolin-policia-01',
    analysis_state: 'completed',
    commercial_state: 'Petición oferta',
    has_pending_actions: true,
    client_name: 'Grupo Bertolín',
    references: ['<init.rfp.20261002@policialocalvalencia.es>'],
    in_reply_to: '<init.rfp.20261002@policialocalvalencia.es>',
    body: `Estimado Alejandro,

Nos encontramos preparando la licitación para la ejecución de las obras de la SEGUNDA UNIDAD DE DISTRITO DE LA POLICÍA LOCAL DE VALENCIA (Sector Campanar).

Adjuntamos enlace a la documentación técnica del lote de Climatización y Ventilación:
- Climatización mediante sistema VRF bomba de calor 2 tubos (aprox. 120 kW en unidades exteriores en cubierta técnica).
- Ventilación con 4 recuperadores de calor entálpicos de alta eficiencia acorde a RITE (caudales 1.800 a 3.200 m3/h) con filtrado F7+F9.
- Red de conductos de chapa galvanizada y difusión rotacional.
- Cuadro de regulación y control DDC con pasarela BACnet a BMS municipal.

Necesitamos contar con vuestra mejor propuesta técnica y económica desglosada antes del próximo viernes 17 a las 14:00h, ya que la mesa de contratación cierra el día 22.

Agradeceríamos confirmación de recepción y si veis viable presentar oferta.

Un cordial saludo,

Gabriel Muñoz
Departamento de Contratación y Compras
GRUPO BERTOLÍN S.A.U.
Valencia`,
  },
  {
    id: 'em-002',
    message_id: '<20261006.091540.33910.obras@edifesa.es>',
    folder: 'INBOX',
    from: 'Carlos Ferrando <obras@edifesa.es>',
    to: ['alejandro.lopez@aclimar.es'],
    subject: 'Revisión esquema hidráulico fancoils - REFORMA HOSPITAL LA FE PABELLÓN B',
    date: '2026-10-06T09:15:00+02:00',
    conversation_id: 'conv-edifesa-lafe-02',
    analysis_state: 'completed',
    commercial_state: 'Aclaración técnica',
    has_pending_actions: true,
    client_name: 'Edifesa Obras y Proyectos',
    body: `Hola Alex,

La dirección facultativa ha devuelto con comentarios el plano de conexionado de la batería a 4 tubos de los fancoils del Pabellón B.
Piden sustituir las válvulas motorizadas de 3 vías por válvulas de equilibrado y control independiente de la presión (PICV) para mejorar el caudal en régimen parcial.

¿Podéis recalcular la partida con el suplemento de las PICV antes de mañana? Tenemos reunión de obra el jueves a las 11:30 en el hospital.

Gracias,
Carlos Ferrando
Jefe de Obra Edifesa`,
  },
  {
    id: 'em-003',
    message_id: '<20261004.180211.51209.compras@ferrovial.es>',
    folder: 'INBOX',
    from: 'Marta Soler <compras@ferrovial.es>',
    to: ['alejandro.lopez@aclimar.es'],
    subject: 'Adjudicación provisional UTA y conductos - POLIDEPORTIVO MALVARROSA',
    date: '2026-10-04T18:02:00+02:00',
    conversation_id: 'conv-ferrovial-malvarrosa-03',
    analysis_state: 'completed',
    commercial_state: 'Adjudicada',
    has_pending_actions: false,
    client_name: 'Ferrovial Construcción',
    body: `Estimado Alejandro,

Nos complace comunicarte que vuestra oferta para el paquete de UTA deshumectadora para zona de piscina y conductos clima en Polideportivo Malvarrosa ha sido la seleccionada en el comité de compras por importe de 184.500 € + IVA.

A lo largo de esta semana os remitiremos el contrato marco de subcontratación y la solicitud de plan de seguridad y salud (PSS) para la firma.

Enhorabuena y buen trabajo con el estudio.

Marta Soler
Jefa de Compras Delegación Levante
Ferrovial`,
  },
  {
    id: 'em-004',
    message_id: '<20261006.113000.44120.alejandro.lopez@aclimar.es>',
    folder: 'Sent',
    from: 'Alejandro López <alejandro.lopez@aclimar.es>',
    to: ['tecnico@estudioarquitectura.com'],
    subject: 'Dudas caudal de aire renovación CTE DB-HS3 - RESIDENCIAL PATRAIX',
    date: '2026-10-06T11:30:00+02:00',
    conversation_id: 'conv-patraix-04',
    analysis_state: 'not_required',
    commercial_state: 'Informativo',
    has_pending_actions: false,
    client_name: 'Estudio Arquitectura',
    body: `Estimado Vicente,

Tal y como comentamos por teléfono, te confirmo que la solución con microventilación y recuperadores individuales para las 36 viviendas cumple holgadamente con los caudales del DB-HS3 y evita la sobrepresión en zonas húmedas.

Quedamos a vuestra disposición para el cálculo definitivo de los montantes verticales.

Un saludo,
Alejandro López`,
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-bertolin-policia-01',
    subject: 'Petición oferta - SEGUNDA UNIDAD DE DISTRITO POLICIA LOCAL VALENCIA',
    messages_count: 2,
    last_date: '2026-10-05T14:32:00+02:00',
    participants: ['gmunoz@grupobertolin.es', 'alejandro.lopez@aclimar.es', 'licitaciones@grupobertolin.es'],
    summary: 'Licitación urgente para climatización VRF (120 kW) y 4 recuperadores RITE con BMS municipal. Plazo viernes 17.',
    status: 'active',
  },
  {
    id: 'conv-edifesa-lafe-02',
    subject: 'Revisión esquema hidráulico fancoils - REFORMA HOSPITAL LA FE PABELLÓN B',
    messages_count: 3,
    last_date: '2026-10-06T09:15:00+02:00',
    participants: ['obras@edifesa.es', 'alejandro.lopez@aclimar.es'],
    summary: 'Aclaración de DF sobre válvulas PICV para fancoils a 4 tubos antes de la reunión de obra del jueves.',
    status: 'active',
  },
  {
    id: 'conv-ferrovial-malvarrosa-03',
    subject: 'Adjudicación provisional UTA y conductos - POLIDEPORTIVO MALVARROSA',
    messages_count: 4,
    last_date: '2026-10-04T18:02:00+02:00',
    participants: ['compras@ferrovial.es', 'alejandro.lopez@aclimar.es'],
    summary: 'Oferta ganada por 184.500 € + IVA. Pendiente recepción de contrato marco y PSS.',
    status: 'closed',
  },
];

export const INITIAL_ANALYSES: Record<string, AIAnalysis> = {
  'em-001': {
    id: 'an-001',
    email_id: 'em-001',
    created_at: '2026-10-05T14:35:10+02:00',
    model: 'Gemini 3.8 Flash (Local B2B Extraction Engine)',
    resumen:
      'Petición de oferta de Grupo Bertolín para las instalaciones de climatización y ventilación de la Segunda Unidad de Distrito de la Policía Local de Valencia (Sector Campanar). El proyecto incluye sistema VRF de 120 kW (2 tubos bomba de calor), 4 recuperadores de calor entálpicos RITE con filtración F7+F9, red de conductos de chapa y control DDC integrable en BMS mediante BACnet. Plazo límite para entrega de oferta: viernes 17 de octubre a las 14:00h.',
    preguntas: [
      '¿Dispone la constructora del archivo de mediciones en formato BC3/FIEBDC o únicamente en documento PDF?',
      '¿Se requiere incluir en la oferta el proyecto visado y legalización ante la Dirección General de Industria o corre por cuenta del contratista principal?',
      '¿La pasarela BACnet debe ser nativa en el control centralizado del fabricante o se admite pasarela externa multiprotocolo?',
    ],
    compromisos: [
      {
        id: 'comp-01',
        debtor: 'ACLIMAR',
        description: 'Entregar propuesta técnica y económica desglosada por capítulos a Grupo Bertolín.',
        deadline: '2026-10-17 14:00',
        source_excerpt: 'Necesitamos contar con vuestra mejor propuesta técnica y económica desglosada antes del próximo viernes 17 a las 14:00h',
      },
      {
        id: 'comp-02',
        debtor: 'Cliente',
        description: 'Grupo Bertolín presentará la oferta consolidada a la mesa de contratación municipal.',
        deadline: '2026-10-22',
        source_excerpt: 'ya que la mesa de contratación cierra el día 22.',
      },
    ],
    propuestas_tareas: [
      {
        id: 'pt-001',
        source_email_id: 'em-001',
        source_excerpt: 'Adjuntamos enlace a la documentación técnica del lote de Climatización y Ventilación',
        text: 'Descargar documentación técnica de Policía Local Valencia y verificar archivo BC3 de mediciones',
        priority: 'alta',
        review_state: 'accepted',
        review_actor: 'Alejandro López',
        reviewed_at: '2026-10-05T15:00:00+02:00',
        status: 'pending', // Materializada tras aceptación
        due_date: '2026-10-08',
        assigned_to: 'Oficina Técnica ACLIMAR',
      },
      {
        id: 'pt-002',
        source_email_id: 'em-001',
        source_excerpt: 'Climatización mediante sistema VRF bomba de calor 2 tubos (aprox. 120 kW)',
        text: 'Solicitar cotización especial de obra a fabricantes (Daikin / Mitsubishi Heavy) para VRF 120 kW con BACnet',
        priority: 'alta',
        review_state: 'not_reviewed',
        status: 'proposed',
        due_date: '2026-10-10',
        assigned_to: 'Alejandro López',
      },
      {
        id: 'pt-003',
        source_email_id: 'em-001',
        source_excerpt: '4 recuperadores de calor entálpicos de alta eficiencia acorde a RITE',
        text: 'Calcular red de conductos de chapa y comprobar caudales de los 4 recuperadores entálpicos F7+F9',
        priority: 'media',
        review_state: 'not_reviewed',
        status: 'proposed',
        due_date: '2026-10-12',
      },
    ],
    propuestas_siguientes_pasos: [
      {
        id: 'pns-001',
        source_email_id: 'em-001',
        source_excerpt: 'Agradeceríamos confirmación de recepción y si veis viable presentar oferta.',
        text: 'Confirmar recepción a Gabriel Muñoz (Bertolín) y agendar reunión técnica previa de dudas',
        proposed_date: '2026-10-07T10:00:00',
        review_state: 'accepted',
        review_actor: 'Alejandro López',
        reviewed_at: '2026-10-05T15:05:00+02:00',
        status: 'planned', // Materializado a planned
        client_name: 'Grupo Bertolín',
        calendar_action_id: 'cal-act-001',
      },
      {
        id: 'pns-002',
        source_email_id: 'em-001',
        source_excerpt: 'antes del próximo viernes 17 a las 14:00h',
        text: 'Entrega formal de la oferta económica a licitaciones@grupobertolin.es',
        proposed_date: '2026-10-16T12:00:00',
        review_state: 'not_reviewed',
        status: 'proposed',
        client_name: 'Grupo Bertolín',
      },
    ],
  },
  'em-002': {
    id: 'an-002',
    email_id: 'em-002',
    created_at: '2026-10-06T09:20:00+02:00',
    model: 'Gemini 3.8 Flash (Local B2B Extraction Engine)',
    resumen:
      'Edifesa traslada requerimiento de la Dirección Facultativa en Hospital La Fe: sustitución de válvulas motorizadas de 3 vías por válvulas PICV (presión independiente) en fancoils a 4 tubos de Pabellón B. Requieren estudio del sobrecoste antes de la reunión de obra de este jueves a las 11:30h.',
    preguntas: [
      '¿Qué fabricante de válvulas PICV está homologado en el pliego del Hospital La Fe (ej. Danfoss, Belimo o IMI)?',
    ],
    compromisos: [
      {
        id: 'comp-03',
        debtor: 'ACLIMAR',
        description: 'Recalcular partida con suplemento de válvulas PICV antes del 07/10.',
        deadline: '2026-10-07 18:00',
        source_excerpt: '¿Podéis recalcular la partida con el suplemento de las PICV antes de mañana?',
      },
    ],
    propuestas_tareas: [
      {
        id: 'pt-004',
        source_email_id: 'em-002',
        source_excerpt: 'sustituir las válvulas motorizadas de 3 vías por válvulas PICV',
        text: 'Pedir oferta urgente a Belimo/Danfoss de 38 válvulas PICV con actuador modulante 0-10V',
        priority: 'alta',
        review_state: 'not_reviewed',
        status: 'proposed',
        due_date: '2026-10-06',
        assigned_to: 'Alejandro López',
      },
    ],
    propuestas_siguientes_pasos: [
      {
        id: 'pns-003',
        source_email_id: 'em-002',
        source_excerpt: 'Tenemos reunión de obra el jueves a las 11:30 en el hospital.',
        text: 'Asistir a Reunión de Obra Hospital La Fe Pabellón B con Carlos Ferrando',
        proposed_date: '2026-10-08T11:30:00',
        review_state: 'accepted',
        review_actor: 'Alejandro López',
        reviewed_at: '2026-10-06T09:40:00+02:00',
        status: 'planned',
        client_name: 'Edifesa Obras y Proyectos',
        calendar_action_id: 'cal-act-002',
      },
    ],
  },
};

export const INITIAL_CALENDAR_ACTIONS: CalendarAction[] = [
  {
    id: 'cal-act-001',
    next_step_id: 'pns-001',
    title: 'Reunión técnica dudas VRF Policía Local - Gabriel Muñoz (Bertolín)',
    start_time: '2026-10-07T10:00:00+02:00',
    end_time: '2026-10-07T11:00:00+02:00',
    timezone: 'Europe/Madrid',
    description:
      'Reunión preparatoria para resolver dudas sobre mediciones BC3, legalización y trazado de cubierta en obra de 2ª Unidad Distrito Policía Local. Calendario Alex Google.',
    calendar_name: 'Alex Google',
    state: 'prepared', // Ready for human explicit approval!
    prepared_at: '2026-10-05T15:10:00+02:00',
    client_ref: 'Grupo Bertolín',
    actor: 'Alejandro López',
  },
  {
    id: 'cal-act-002',
    next_step_id: 'pns-003',
    title: 'Reunión de Obra Hospital La Fe Pabellón B (Edifesa + DF)',
    start_time: '2026-10-08T11:30:00+02:00',
    end_time: '2026-10-08T13:00:00+02:00',
    timezone: 'Europe/Madrid',
    description:
      'Definición de válvulas PICV en fancoils 4 tubos con Carlos Ferrando y Dirección Facultativa.',
    calendar_name: 'Alex Google',
    state: 'created', // Ya creado y sincronizado
    prepared_at: '2026-10-06T09:42:00+02:00',
    created_at: '2026-10-06T09:45:12+02:00',
    remote_event_id: 'gcal_ev_849204918231',
    client_ref: 'Edifesa Obras y Proyectos',
    actor: 'Alejandro López',
  },
];

export const INITIAL_DRAFT_PROPOSALS: EmailDraftProposal[] = [
  {
    id: 'prop-001',
    source_record_id: 'em-001',
    conversation_id: 'conv-bertolin-policia-01',
    source_subject: 'Petición oferta - SEGUNDA UNIDAD DE DISTRITO POLICIA LOCAL VALENCIA',
    source_sender: 'Gabriel Muñoz <gmunoz@grupobertolin.es>',
    source_date: '2026-10-05T14:32:00+02:00',
    actor: 'Alejandro López',
    created_at: '2026-10-05T15:20:00+02:00',
    revisions: [
      {
        id: 'rev-001-v1',
        proposal_id: 'prop-001',
        version: 1,
        from: 'Alejandro López <alejandro.lopez@aclimar.es>',
        to: ['Gabriel Muñoz <gmunoz@grupobertolin.es>'],
        cc: [],
        subject: 'Re: Petición oferta - SEGUNDA UNIDAD DE DISTRITO POLICIA LOCAL VALENCIA',
        body: `Hola Gabriel,

Confirmamos recepción de la documentación para la Segunda Unidad de Distrito de la Policía Local de Valencia.

Hemos descargado los planos y el departamento de estudios de ACLIMAR ya está analizando el sistema VRF de 120 kW y la ventilación con los 4 recuperadores RITE.

¿Podríais facilitarnos el archivo de mediciones en formato BC3 para agilizar la valoración?
Tendréis nuestra propuesta completa antes del viernes 17 a las 14:00h tal y como solicitáis.

Un cordial saludo,
Alejandro López
Delegado Comercial ACLIMAR`,
        created_at: '2026-10-05T15:20:00+02:00',
        actor: 'Alejandro López',
        previous_revision_id: null,
      },
    ],
    current_revision_id: 'rev-001-v1',
    review: {
      id: 'revw-001',
      revision_id: 'rev-001-v1',
      state: 'accepted',
      actor: 'Alejandro López',
      timestamp: '2026-10-05T15:25:00+02:00',
      notes: 'Borrador revisado y aceptado. Listo para preparar EmailDraftAction inmutable.',
    },
  },
];

export const INITIAL_DRAFT_ACTIONS: EmailDraftAction[] = [
  // 1. Aprobada y lista para "Create mailbox draft" (IMAP APPEND to "Borradores Asistente")
  {
    id: 'act-draft-001',
    source_record_id: 'em-001',
    conversation_id: 'conv-bertolin-policia-01',
    revision_id: 'rev-001-v1',
    review_id: 'revw-001',
    accepted_review_id: 'revw-001',
    from_address: 'alejandro.lopez@aclimar.es',
    to_json: ['gmunoz@grupobertolin.es'],
    cc_json: [],
    subject: 'Re: Petición oferta - SEGUNDA UNIDAD DE DISTRITO POLICIA LOCAL VALENCIA',
    body: `Hola Gabriel,\r\n\r\nConfirmamos recepción de la documentación para la Segunda Unidad de Distrito de la Policía Local de Valencia.\r\n\r\nHemos descargado los planos y el departamento de estudios de ACLIMAR ya está analizando el sistema VRF de 120 kW y la ventilación con los 4 recuperadores RITE.\r\n\r\n¿Podríais facilitarnos el archivo de mediciones en formato BC3 para agilizar la valoración?\r\nTendréis nuestra propuesta completa antes del viernes 17 a las 14:00h tal y como solicitáis.\r\n\r\nUn cordial saludo,\r\nAlejandro López\r\nDelegado Comercial ACLIMAR`,
    message_date: 'Mon, 05 Oct 2026 15:30:00 +0200',
    message_id: '<draft.20261005.153000.89123.aclimar@local>',
    in_reply_to: '<20261005.143209.78219.gmunoz@grupobertolin.es>',
    references_json: [
      '<init.rfp.20261002@policialocalvalencia.es>',
      '<20261005.143209.78219.gmunoz@grupobertolin.es>',
    ],
    target_folder: 'INBOX.Drafts.Borradores Asistente',
    target_folder_label: 'Borradores Asistente',
    payload_digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    state: 'approved', // Waiting for explicit "Create mailbox draft"
    actor: 'Alejandro López',
    remote_uid: null,
    uidvalidity: null,
    failure_code: null,
    invalidated_at: null,
    invalidated_by: null,
    invalidation_reason: null,
    invalidation_provenance: null,
    replaces_action_id: null,
    created_at: '2026-10-05T15:30:00+02:00',
  },

  // 2. Acción invalidada para demostrar el flujo estricto "invalidated -> Prepare Replacement"
  {
    id: 'act-draft-002-legacy',
    source_record_id: 'em-002',
    conversation_id: 'conv-edifesa-lafe-02',
    revision_id: 'rev-002-old',
    review_id: 'revw-002-old',
    accepted_review_id: 'revw-002-old',
    from_address: 'alejandro.lopez@aclimar.es',
    to_json: ['obras@edifesa.es'],
    cc_json: [],
    subject: 'Re: Revisión esquema hidráulico fancoils - REFORMA HOSPITAL LA FE PABELLÓN B',
    body: `Estimado Carlos,\r\n\r\nEstamos recalculando con Danfoss el suplemento de PICV.\r\n\r\nSaludos.`,
    message_date: 'Mon, 05 Oct 2026 18:00:00 +0200',
    message_id: '<draft.20261005.180000.11902.aclimar@local>',
    in_reply_to: '<20261006.091540.33910.obras@edifesa.es>',
    references_json: ['<20261006.091540.33910.obras@edifesa.es>'],
    target_folder: 'INBOX.Drafts.Borradores Asistente',
    target_folder_label: 'Borradores Asistente',
    payload_digest: '7a9f24c08912de54316887ef1c149afbf4c8996fb92427ae41e4649b934ca495',
    state: 'invalidated', // Terminal, conserva snapshot intacto
    actor: 'Alejandro López',
    remote_uid: null,
    uidvalidity: null,
    failure_code: 'RFC_REFERENCES_CORRUPT',
    invalidated_at: '2026-10-05T18:45:00+02:00',
    invalidated_by: 'Alejandro López',
    invalidation_reason: 'Error en delimitador de cabecera References previa; detectado conflicto en saltos CRLF.',
    invalidation_provenance: 'Auditoría interna RFC 2822 previa a APPEND',
    replaces_action_id: null,
    created_at: '2026-10-05T18:00:00+02:00',
  },

  // 3. Acción en estado UNCERTAIN para demostrar el flujo "uncertain -> Reconcile" read-only
  {
    id: 'act-draft-003-uncertain',
    source_record_id: 'em-003',
    conversation_id: 'conv-ferrovial-malvarrosa-03',
    revision_id: 'rev-003-v1',
    review_id: 'revw-003',
    accepted_review_id: 'revw-003',
    from_address: 'alejandro.lopez@aclimar.es',
    to_json: ['compras@ferrovial.es'],
    cc_json: [],
    subject: 'Re: Adjudicación provisional UTA y conductos - POLIDEPORTIVO MALVARROSA',
    body: `Estimada Marta,\r\n\r\nMuchas gracias por la comunicación. Quedamos a la espera del contrato marco y del requerimiento de PSS para tramitar la documentación de obra de inmediato.\r\n\r\nUn saludo cordial,\r\nAlejandro López`,
    message_date: 'Tue, 06 Oct 2026 08:30:00 +0200',
    message_id: '<draft.20261006.083000.77665.aclimar@local>',
    in_reply_to: '<20261004.180211.51209.compras@ferrovial.es>',
    references_json: ['<20261004.180211.51209.compras@ferrovial.es>'],
    target_folder: 'INBOX.Drafts.Borradores Asistente',
    target_folder_label: 'Borradores Asistente',
    payload_digest: '31cb54a88912de54316887ef1c149afbf4c8996fb92427ae41e4649b934ca888',
    state: 'uncertain', // Timeout en socket tras APPEND
    actor: 'Alejandro López',
    remote_uid: null,
    uidvalidity: null,
    failure_code: 'IMAP_TIMEOUT_POST_SEND',
    invalidated_at: null,
    invalidated_by: null,
    invalidation_reason: null,
    invalidation_provenance: null,
    replaces_action_id: null,
    created_at: '2026-10-06T08:30:00+02:00',
  },
];

export const INITIAL_COMMERCIAL_NOTES: CommercialNote[] = [
  {
    id: 'note-001',
    type: 'reunion',
    client: 'Grupo Bertolín',
    project: 'Policía Local Valencia - Campanar',
    title: 'Alineación previa con Gabriel Muñoz (Compras Bertolín)',
    content:
      'Llamada telefónica de 15 min. Confirma que la mesa de contratación valora especialmente plazo de entrega de equipos VRF y la reducción acústica de las UTAs en cubierta. Les preocupa el suministro de Daikin por plazos de fábrica; proponen tener alternativa con Mitsubishi Heavy.',
    date: '2026-10-05T16:00:00+02:00',
    actor: 'Alejandro López',
    extracted_tasks: ['Comparar plazos entrega Daikin VRF vs Mitsubishi Heavy'],
    extracted_next_steps: ['Reunión técnica presencial previa el miércoles 07'],
  },
  {
    id: 'note-002',
    type: 'visita',
    client: 'Edifesa Obras y Proyectos',
    project: 'Reforma Hospital La Fe Pabellón B',
    title: 'Visita de replanteo a sala técnica y patinillos',
    content:
      'Revisión en planta 2 con el encargado de obra. Los patinillos para los montantes de fancoils están bastante congestionados por tuberías de fontanería. Necesitaremos codos de 45º para salvar bajantes.',
    date: '2026-10-04T12:30:00+02:00',
    actor: 'Alejandro López',
  },
];

export const INITIAL_WHATSAPP_SNIPPETS: WhatsAppSnippet[] = [
  {
    id: 'wa-001',
    contact_name: 'Gabriel Muñoz (Bertolín)',
    phone: '+34 619 44 28 90',
    date: '2026-10-05T17:15:00+02:00',
    raw_text: `[17:12] Gabriel Bertolín: Alex, te acabo de subir el BC3 al Drive. Bájatelo cuando puedas.
[17:13] Alex ACLIMAR: Perfecto Gabriel, ya lo tenemos. Mañana te decimos si falta alguna partida.
[17:15] Gabriel Bertolín: Ojo con el control BACnet, que el técnico del ayuntamiento es muy exigente con los mapeos de variables.`,
    status: 'analyzed',
    client_ref: 'Grupo Bertolín',
    extracted_commitments: ['Revisar partidas del BC3 subido al Drive'],
    extracted_tasks: ['Verificar compatibilidad de mapeo BACnet con técnico municipal'],
  },
  {
    id: 'wa-002',
    contact_name: 'Vicente Arquitecto (Patraix)',
    phone: '+34 655 12 87 34',
    date: '2026-10-06T10:45:00+02:00',
    raw_text: `[10:42] Vicente: Alex, nos encaja la solución de recuperadores individuales. Pásanos el esquema dwg en cuanto puedas para meterlo en la separata visada.
[10:45] Alex ACLIMAR: Te lo pasamos el jueves por la mañana sin falta Vicente.`,
    status: 'analyzed',
    client_ref: 'Estudio Arquitectura',
    extracted_commitments: ['Entregar esquema DWG de recuperadores individuales el jueves antes de las 14h'],
    extracted_tasks: ['Exportar esquema CAD de ventilación Residencial Patraix'],
  },
];

export const INITIAL_CRM_RECORDS: CrmRecord[] = [
  {
    id: 'crm-001',
    code: 'OFR-2026-089',
    title: '2ª Unidad Distrito Policía Local Campanar',
    type: 'oferta',
    client: 'Grupo Bertolín',
    stage: 'Estudio',
    budget: 215000,
    last_api_sync: '2026-10-05T18:00:00+02:00',
    sync_status: 'synced',
  },
  {
    id: 'crm-002',
    code: 'OBR-2025-042',
    title: 'Hospital La Fe Pabellón B - Fancoils 4T',
    type: 'obra',
    client: 'Edifesa Obras y Proyectos',
    stage: 'En negociación',
    budget: 98400,
    last_api_sync: '2026-10-06T08:00:00+02:00',
    sync_status: 'synced',
  },
  {
    id: 'crm-003',
    code: 'OBR-2026-015',
    title: 'Polideportivo Malvarrosa - Climatización y UTA',
    type: 'obra',
    client: 'Ferrovial Construcción',
    stage: 'Adjudicada',
    budget: 184500,
    last_api_sync: '2026-10-05T12:00:00+02:00',
    sync_status: 'synced',
  },
  {
    id: 'crm-004',
    code: 'CLI-0012',
    title: 'Grupo Bertolín S.A.U.',
    type: 'cliente',
    client: 'Grupo Bertolín S.A.U.',
    stage: 'En negociación',
    budget: 0,
    last_api_sync: '2026-10-04T10:00:00+02:00',
    sync_status: 'synced',
  },
];

export const INITIAL_AUDIT_LOG: AuditEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-05T14:35:10+02:00',
    actor: 'Gemini 3.8 Flash (Local B2B Extraction Engine)',
    type: 'analysis_completed',
    entity: 'EmailMessage',
    entity_id: 'em-001',
    outcome: 'Análisis comercial completado con 3 preguntas, 2 compromisos, 3 tareas y 2 siguientes pasos',
    provenance: 'Proceso background FastAPI IMAP sync',
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-05T15:00:00+02:00',
    actor: 'Alejandro López',
    type: 'proposal_reviewed',
    entity: 'ProposedTask',
    entity_id: 'pt-001',
    outcome: 'Propuesta aceptada: Descargar documentación técnica de Policía Local Valencia',
    provenance: 'Interfaz Web Local (127.0.0.1)',
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-05T15:02:00+02:00',
    actor: 'Alejandro López',
    type: 'task_materialized',
    entity: 'Task',
    entity_id: 'pt-001',
    outcome: 'Tarea materializada a estado pending con vencimiento 2026-10-08',
    provenance: 'Transición explícita autorizada por usuario',
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-05T15:05:00+02:00',
    actor: 'Alejandro López',
    type: 'proposal_reviewed',
    entity: 'ProposedNextStep',
    entity_id: 'pns-001',
    outcome: 'Propuesta aceptada: Confirmar recepción a Gabriel Muñoz (Bertolín)',
    provenance: 'Interfaz Web Local (127.0.0.1)',
  },
  {
    id: 'aud-005',
    timestamp: '2026-10-05T15:06:00+02:00',
    actor: 'Alejandro López',
    type: 'next_step_materialized',
    entity: 'NextStep',
    entity_id: 'pns-001',
    outcome: 'Siguiente paso materializado a estado planned (2026-10-07 10:00)',
    provenance: 'Transición autorizada por usuario',
  },
  {
    id: 'aud-006',
    timestamp: '2026-10-05T15:10:00+02:00',
    actor: 'Alejandro López',
    type: 'calendar_action_prepared',
    entity: 'CalendarAction',
    entity_id: 'cal-act-001',
    outcome: 'Snapshot de evento preparado para calendario "Alex Google"',
    provenance: 'NextStep planned -> Snapshot inmutable generado. Esperando aprobación explícita.',
  },
  {
    id: 'aud-007',
    timestamp: '2026-10-05T15:30:00+02:00',
    actor: 'Alejandro López',
    type: 'draft_replacement_prepared',
    entity: 'EmailDraftAction',
    entity_id: 'act-draft-001',
    outcome: 'EmailDraftAction inmutable preparada con destino INBOX.Drafts.Borradores Asistente. Digest: e3b0c4...',
    provenance: 'MIME RFC 2822 compilado. Estado: approved. Cero SMTP.',
  },
  {
    id: 'aud-008',
    timestamp: '2026-10-05T18:45:00+02:00',
    actor: 'Alejandro López',
    type: 'draft_action_invalidated',
    entity: 'EmailDraftAction',
    entity_id: 'act-draft-002-legacy',
    outcome: 'Acción invalidada terminalmente por fallo RFC_REFERENCES_CORRUPT. Snapshot conservado.',
    provenance: 'Mecanismo de seguridad de invalidación auditable',
  },
  {
    id: 'aud-009',
    timestamp: '2026-10-06T08:30:15+02:00',
    actor: 'Alejandro López',
    type: 'draft_append_uncertain',
    entity: 'EmailDraftAction',
    entity_id: 'act-draft-003-uncertain',
    outcome: 'Timeout en socket remoto tras comando APPEND. Marcado como uncertain. Prohibido reintentar sin reconciliación.',
    provenance: 'Worker IMAP Append (puerto 993 TLS)',
  },
  {
    id: 'aud-010',
    timestamp: '2026-10-06T09:45:12+02:00',
    actor: 'Alejandro López',
    type: 'calendar_action_created',
    entity: 'CalendarAction',
    entity_id: 'cal-act-002',
    outcome: 'Evento creado con éxito en Google Calendar "Alex Google" (ID remoto: gcal_ev_849204918231)',
    provenance: 'Aprobación explícita por usuario tras snapshot',
  },
];
