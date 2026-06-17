import type {
  Abogado,
  Actuacion,
  Causa,
  DeadlineItem,
  Documento,
  Plazo,
  PlazosEstado,
  SemaforoColor,
  SemaforoValue,
} from "@/data/types";

// ---------------------------------------------------------------------------
// Backend response shapes
// ---------------------------------------------------------------------------

export interface CaseResponse {
  id: number;
  rol: string;
  competencia: string;
  court: { id: number; name: string; region: string };
  plaintiff: string | null;
  defendant: string | null;
  procedure: string | null;
  status: string;
  filed_at: string;
  last_movement_at: string;
  created_at: string;
  updated_at: string;
  procedural_state: string | null;
  semaforo: string | null;
  next_deadline_at: string | null;
}

export interface MovementResponse {
  id: number;
  folio: string | null;
  stage: string;
  procedure: string;
  description: string;
  movement_date: string;
  created_at: string;
}

export interface DocumentResponse {
  id: number;
  doc_type: string;
  pjud_endpoint: string | null;
  filename: string | null;
  status: string;
  available: boolean;
  download_url: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PLACEHOLDER_ABOGADO: Abogado = {
  id: 'system',
  nombre: 'Segal & Abogados',
  iniciales: 'SA',
  color: '#6366f1',
};

function wholeDaysBetween(from: string, to: Date): number {
  const fromDate = new Date(from);
  return Math.floor((to.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
}

function computeEstado(diasHabilesRemaining: number): PlazosEstado {
  if (diasHabilesRemaining <= 0) return 'vencido';
  if (diasHabilesRemaining <= 3) return 'proximo';
  return 'pendiente';
}

function computeSemaforo(diasHabilesRemaining: number): SemaforoColor {
  if (diasHabilesRemaining <= 0) return 'rojo';
  if (diasHabilesRemaining <= 3) return 'amarillo';
  return 'verde';
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

export function caseToCausa(c: CaseResponse): Causa {
  return {
    id: String(c.id),
    rol: c.rol,
    rit: null,
    caratula: `${c.plaintiff ?? '—'} / ${c.defendant ?? '—'}`,
    tribunal: c.court?.name ?? '—',
    materia: c.procedure ?? '—',
    abogado: PLACEHOLDER_ABOGADO,
    semaforo: (c.semaforo as SemaforoValue) ?? null,
    fechaIngreso: c.filed_at,
    ultimaActuacion: c.last_movement_at,
    diasUltima: wholeDaysBetween(c.last_movement_at, new Date()),
    cuantia: null,
    procedural_state: c.procedural_state ?? undefined,
    next_deadline_at: c.next_deadline_at ?? null,
  };
}

export function movementToActuacion(m: MovementResponse): Actuacion {
  return {
    fecha: m.movement_date,
    tipo: m.procedure || m.stage,
    titulo: m.description,
    actor: m.stage,
    adjuntos: 0,
  };
}

export function docToDocumento(d: DocumentResponse): Documento {
  return {
    id: String(d.id),
    nombre: d.filename ?? d.doc_type,
    peso: '—',
    fecha: '—',
    autor: '—',
    docType: d.doc_type,
    available: d.available,
    status: d.status,
    downloadUrl: d.download_url,
  };
}

export function deadlineItemToPlazo(item: DeadlineItem, caseId: number): Plazo {
  return {
    id: item.deadline_type,
    causaId: String(caseId),
    descripcion: item.label,
    dias: Math.abs(item.dias_habiles_remaining),
    tipoDias: 'habiles',
    fechaInicio: item.triggered_at,
    fechaVencimiento: item.due_date,
    estado: computeEstado(item.dias_habiles_remaining),
    diasRestantes: item.dias_habiles_remaining,
    semaforo: computeSemaforo(item.dias_habiles_remaining),
  };
}
