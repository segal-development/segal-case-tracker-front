export interface Abogado {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  iniciales: string;
  color: string;
  cargo: string;
  contexto: string;
  empresa: string;
}

export type SemaforoColor = "rojo" | "amarillo" | "verde";
/** Null means the backend returned no semáforo (non juicio-ejecutivo cases). */
export type SemaforoValue = SemaforoColor | null;
export type PlazosEstado = "proximo" | "pendiente" | "vencido" | "cumplido";

export interface Causa {
  id: string;
  rol: string;
  rit: string | null;
  caratula: string;
  tribunal: string;
  materia: string;
  abogado: Abogado;
  semaforo: SemaforoValue;
  fechaIngreso: string;
  ultimaActuacion: string;
  cuantia: number | null;
  diasUltima: number;
  /** Optional fields populated from the backend (undefined for mock-sourced data) */
  procedural_state?: string;
  next_deadline_at?: string | null;
}

export interface Plazo {
  id: string;
  causaId: string;
  descripcion: string;
  dias: number;
  tipoDias: "habiles" | "corridos";
  fechaInicio: string;
  fechaVencimiento: string;
  estado: PlazosEstado;
  diasRestantes: number;
  semaforo: SemaforoColor;
}

export interface Actuacion {
  fecha: string;
  tipo: string;
  titulo: string;
  actor: string;
  adjuntos: number;
}

export interface Documento {
  id: string;
  nombre: string;
  peso: string;
  fecha: string;
  autor: string;
}

export interface ProdAbogado {
  abogadoId: string;
  nombre: string;
  causasActivas: number;
  causasCerradas: number;
  plazosVencidos: number;
  plazosCumplidos: number;
  tasaCumplimiento: number;
}

export interface TrendDay {
  fecha: string;
  causasNuevas: number;
  causasCerradas: number;
  plazosCreados: number;
  plazosCumplidos: number;
}

export type NotifTipo = "vencimiento" | "nueva" | "plazo" | "asignacion" | "documento";

export interface Notificacion {
  id: string;
  tipo: NotifTipo;
  texto: string;
  tiempo: string;
  leido: boolean;
}

export interface SemaforoSummary {
  verde: number;
  amarillo: number;
  rojo: number;
  total: number;
}

export interface ResumenPlazos {
  total: number;
  pendientes: number;
  proximos: number;
  vencidos: number;
  cumplidos: number;
}

export interface SyncEvent {
  hora: string;
  origen: string;
  evento: string;
  estado: "ok" | "warn";
}

export interface SinAsignar {
  rol: string;
  caratula: string;
  tribunal: string;
  ingreso: string;
}

export interface DataQualityItem {
  titulo: string;
  n: number;
  total: number;
  severidad: SemaforoColor;
}

export interface AdminData {
  SYNC_EVENTS: SyncEvent[];
  SIN_ASIGNAR: SinAsignar[];
  DATA_QUALITY: DataQualityItem[];
  OPERACIONES_HOY: {
    causasIngresadas: number;
    documentosSubidos: number;
    plazosCreados: number;
    notificacionesEnviadas: number;
  };
}

export interface FinancieroData {
  cuantiaTotal: number;
  cuantiaRiesgo: number;
  honorariosMes: number;
  honorariosProyeccion: number;
  facturacionTrimestre: Array<{ mes: string; v: number }>;
}

export interface Parte {
  participante: string;
  rut: string;
  persona_type: string;
  nombre: string;
}

export interface DeadlineItem {
  deadline_type: string;
  label: string;
  legal_basis: string;
  due_date: string;
  triggered_at: string;
  dias_habiles_remaining: number;
  status: string;
  source_movement_id: number | null;
}

export interface ProximaAccion {
  deadline_type: string;
  label: string;
  due_date: string;
  dias_habiles_remaining: number;
  description: string;
}

export interface DeadlineResponse {
  case_id: number;
  procedural_state: string;
  semaforo: string;
  active_deadlines: DeadlineItem[];
  proxima_accion: ProximaAccion | null;
  abandono_risk: string;
  prescripcion_risk: string;
  disclaimer: string;
}
