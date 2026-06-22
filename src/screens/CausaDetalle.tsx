import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode, CSSProperties } from "react";
import {
  ChevronLIcon,
  BuildingIcon,
  UserIcon,
  CalendarIcon,
  ScaleIcon,
  SparkleIcon,
  MoreIcon,
  PlusIcon,
  UploadIcon,
  DocIcon,
  LinkIcon,
  CheckIcon,
  EyeIcon,
  DownloadIcon,
} from "@/components/primitives/icons";
import { SemaforoRing } from "@/components/primitives/SemaforoRing";
import { Avatar } from "@/components/primitives/Avatar";
import { Card } from "@/components/primitives/Card";
import { Btn } from "@/components/primitives/Btn";
import { Pill } from "@/components/primitives/Pill";
import { useCausa } from "@/hooks/useCausa";
import { useActuaciones } from "@/hooks/useActuaciones";
import { useDocumentos } from "@/hooks/useDocumentos";
import { usePartes } from "@/hooks/usePartes";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import { Splash } from "@/components/Splash";
import { PdfViewerModal } from "@/components/PdfViewerModal";
import { fetchBlob } from "@/lib/api";
import pdfIcon from "@/assets/file-icons/pdf.png";
import wordIcon from "@/assets/file-icons/word.jpg";
import imageIcon from "@/assets/file-icons/image.png";
import { useDeadlines } from "@/hooks/useDeadlines";
import { fmtCLP, fmtDate } from "@/lib/format";
import type { Actuacion, Causa, Plazo } from "@/data/types";

/* ── page chrome ── */
const pageCss: CSSProperties = {
  padding: "36px 40px 56px",
  maxWidth: 1240,
  margin: "0 auto",
};

/* ── section sub-header ── */
function SubH({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--fj-body)",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: "var(--fj-ink3)",
        marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

/* ── key/value grid ── */
type GridItem = [string, ReactNode];

function DataGrid({ items }: { items: GridItem[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        rowGap: 12,
        columnGap: 24,
        alignItems: "baseline",
      }}
    >
      {items.flatMap(([k, v], i) => [
        <div
          key={`k${i}`}
          style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)" }}
        >
          {k}
        </div>,
        <div
          key={`v${i}`}
          style={{ fontFamily: "var(--fj-body)", fontSize: 13, color: "var(--fj-ink)", fontWeight: 500 }}
        >
          {v}
        </div>,
      ])}
    </div>
  );
}

/* ── hero meta item ── */
function MetaItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ marginTop: 2, color: "var(--fj-ink3)", display: "inline-flex" }}>
        {icon}
      </span>
      <div>
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 10.5,
            fontWeight: 600,
            color: "var(--fj-ink3)",
            textTransform: "uppercase",
            letterSpacing: ".12em",
            marginBottom: 2,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--fj-body)",
            fontSize: 13,
            color: "var(--fj-ink)",
            display: "flex",
            alignItems: "center",
            minHeight: 20,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

/* ── party card ── */
function ParteCard({
  rol,
  nombre,
  rep,
  inverted = false,
}: {
  rol: string;
  nombre: string;
  rep: string;
  inverted?: boolean;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 10,
        background: inverted ? "var(--fj-panel2)" : "var(--fj-primary-soft)",
        border: `1px solid ${inverted ? "var(--fj-line)" : "transparent"}`,
      }}
    >
      <div
        style={{
          fontFamily: "var(--fj-body)",
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: inverted ? "var(--fj-ink3)" : "var(--fj-primary)",
          marginBottom: 8,
        }}
      >
        {rol}
      </div>
      <div
        style={{
          fontFamily: "var(--fj-heading)",
          fontSize: 17,
          fontWeight: 500,
          color: "var(--fj-ink)",
          lineHeight: 1.25,
        }}
      >
        {nombre}
      </div>
      <div
        style={{ fontFamily: "var(--fj-body)", fontSize: 12, color: "var(--fj-ink3)", marginTop: 6 }}
      >
        Patrocinio: {rep}
      </div>
    </div>
  );
}

/* ── Tab: Información ── */
function TabInfo({
  causa,
  onOpenModal,
  partes,
  latestActuacion,
}: {
  causa: Causa;
  onOpenModal: (modal: string) => void;
  partes: Array<{ participante: string; rut: string; nombre: string }>;
  latestActuacion: Actuacion | undefined;
}) {
  const caratulaParts = causa.caratula.split(" / ");

  // Party litigantes
  const dteLitigante = partes.find((p) => p.participante === "DTE.");
  const ddoLitigante = partes.find((p) => p.participante === "DDO.");

  const dteNombre = dteLitigante
    ? _cleanName(dteLitigante.nombre)
    : (caratulaParts[0] ?? "—");
  const ddoNombre = ddoLitigante
    ? _cleanName(ddoLitigante.nombre)
    : (caratulaParts[1] ?? "—");

  // Demandante rep: AB.DTE first, then AP.DTE
  const abDte = partes.find((p) => p.participante === "AB.DTE");
  const apDte = partes.find((p) => p.participante === "AP.DTE");
  const dteRep = abDte
    ? _cleanName(abDte.nombre)
    : apDte
    ? _cleanName(apDte.nombre)
    : "Sin representación informada";

  // Demandado reps: AB.DDO first, then AP.DDO; join if multiple
  const ddoLawyers = partes.filter(
    (p) => p.participante === "AB.DDO" || p.participante === "AP.DDO",
  );
  const ddoRep =
    ddoLawyers.length === 0
      ? "Sin representación informada"
      : ddoLawyers.length === 1
      ? _cleanName(ddoLawyers[0].nombre)
      : `${_cleanName(ddoLawyers[0].nombre)} (+${ddoLawyers.length - 1})`;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
      {/* Left column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card pad={22}>
          <SubH>Identificación</SubH>
          <DataGrid
            items={[
              ["ROL", <span style={{ fontFamily: "var(--fj-mono)" }}>{causa.rol}</span>],
              ["RIT", <span style={{ fontFamily: "var(--fj-mono)" }}>{causa.rit ?? "—"}</span>],
              ["Materia", causa.materia],
              ["Tribunal", causa.tribunal],
            ]}
          />
        </Card>

        <Card pad={22}>
          <SubH>Partes</SubH>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <ParteCard rol="Demandante" nombre={dteNombre} rep={dteRep} />
            <ParteCard
              rol="Demandado"
              nombre={ddoNombre}
              rep={ddoRep}
              inverted
            />
          </div>
        </Card>

      </div>

      {/* Right column */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <Card pad={22}>
          <SubH>Acciones rápidas</SubH>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Btn
              kind="secondary"
              icon={<PlusIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
            >
              Agregar plazo
            </Btn>
            <Btn
              kind="secondary"
              icon={<UploadIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
              onClick={() => onOpenModal("subir-documento")}
            >
              Subir documento
            </Btn>
            <Btn
              kind="secondary"
              icon={<DocIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
            >
              Registrar escrito
            </Btn>
            <Btn
              kind="secondary"
              icon={<LinkIcon size={14} strokeWidth={1.6} />}
              style={{ justifyContent: "flex-start" }}
            >
              Vincular causa
            </Btn>
          </div>
        </Card>

        <Card pad={22}>
          <SubH>Última actuación</SubH>
          <div
            style={{
              fontFamily: "var(--fj-body)",
              fontSize: 13,
              color: "var(--fj-ink2)",
              lineHeight: 1.5,
            }}
          >
            <Pill tone="primary" style={{ marginBottom: 10 }}>
              Hace {causa.diasUltima} día{causa.diasUltima === 1 ? "" : "s"}
            </Pill>
            <p style={{ margin: 0, color: "var(--fj-ink)" }}>
              {latestActuacion ? latestActuacion.titulo : "Sin actuaciones registradas."}
            </p>
            <p style={{ margin: "8px 0 0", color: "var(--fj-ink3)", fontSize: 12 }}>
              Registrada por el tribunal el {fmtDate(causa.ultimaActuacion)}.
            </p>
          </div>
        </Card>

      </div>
    </div>
  );
}

/* ── Tab: Plazos ── */
function TabPlazos({
  plazos,
  onOpenModal,
}: {
  plazos: Plazo[];
  onOpenModal: (modal: string) => void;
}) {
  if (plazos.length === 0) {
    return (
      <Card
        pad={40}
        style={{ textAlign: "center", color: "var(--fj-ink3)", fontFamily: "var(--fj-body)" }}
      >
        Sin plazos activos.
      </Card>
    );
  }

  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--fj-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SubH>Plazos asociados</SubH>
        <Btn
          size="sm"
          kind="primary"
          icon={<PlusIcon size={13} strokeWidth={1.6} />}
          onClick={() => onOpenModal("nuevo-plazo")}
        >
          Agregar plazo
        </Btn>
      </div>
      {plazos.map((p, i) => (
        <div
          key={p.id}
          style={{
            padding: "16px 20px",
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto",
            gap: 16,
            alignItems: "center",
            borderBottom: i === plazos.length - 1 ? "none" : "1px solid var(--fj-line)",
          }}
        >
          <SemaforoRing status={p.semaforo} size={28} />
          <div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 14,
                color: "var(--fj-ink)",
                fontWeight: 500,
              }}
            >
              {p.descripcion}
            </div>
            <div
              style={{
                fontFamily: "var(--fj-body)",
                fontSize: 11.5,
                color: "var(--fj-ink3)",
                marginTop: 3,
              }}
            >
              {p.dias} días {p.tipoDias} · {fmtDate(p.fechaInicio)} → {fmtDate(p.fechaVencimiento)}
            </div>
          </div>
          <Pill
            tone={
              p.estado === "vencido"
                ? "rojo"
                : p.estado === "proximo"
                ? "amarillo"
                : p.estado === "cumplido"
                ? "verde"
                : "neutral"
            }
          >
            {p.estado}
          </Pill>
          {p.estado === "cumplido" ? (
            <Pill tone="verde" subtle>
              <CheckIcon size={11} strokeWidth={2} />
              Cumplido
            </Pill>
          ) : (
            <Btn size="sm" kind="ghost" icon={<CheckIcon size={13} strokeWidth={1.8} />}>
              Marcar cumplido
            </Btn>
          )}
        </div>
      ))}
    </Card>
  );
}

/* ── Tab: Documentos ── */
const iconBtnCss: CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 6,
  border: "none",
  background: "transparent",
  color: "var(--fj-ink3)",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

type FileKind = "pdf" | "word" | "image" | "other";

const FILE_ICON: Record<FileKind, string> = {
  pdf: pdfIcon,
  word: wordIcon,
  image: imageIcon,
  other: pdfIcon, // PJUD documents are PDFs by default
};

function fileKind(nombre: string): FileKind {
  const ext = nombre.toLowerCase().match(/\.([a-z0-9]{2,4})$/)?.[1];
  if (!ext || ext === "pdf") return "pdf";
  if (ext === "doc" || ext === "docx" || ext === "rtf") return "word";
  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "tif", "tiff"].includes(ext)) return "image";
  return "other";
}

/* File-type thumbnail using the provided PDF / Word / image icons. */
function DocThumb({ kind }: { kind: FileKind }) {
  return (
    <img
      src={FILE_ICON[kind]}
      alt={kind}
      style={{ width: 34, height: 40, objectFit: "contain", flex: "0 0 auto" }}
    />
  );
}

async function openDocument(downloadUrl: string, mode: "view" | "download", filename: string) {
  // For "view" we must pre-open the tab synchronously (popup-blocker safe).
  const win = mode === "view" ? window.open("", "_blank") : null;
  try {
    const blob = await fetchBlob(downloadUrl);
    const url = URL.createObjectURL(blob);
    if (mode === "download") {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
      a.click();
    } else if (win) {
      win.location.href = url;
    } else {
      window.open(url, "_blank");
    }
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch {
    if (win) win.close();
    alert("No se pudo abrir el documento (puede no estar descargado todavía).");
  }
}

/* PJUD doc_type codes → human-readable Spanish labels. */
const DOC_TYPE_LABELS: Record<string, string> = {
  resolution: "Resolución",
  resolucion: "Resolución",
  escrito_doc: "Escrito",
  escrito_cert: "Certificación de escrito",
  escrito: "Escrito",
  cert_envio: "Certificado de envío",
  certificado: "Certificado",
  demanda: "Demanda",
  mandamiento: "Mandamiento",
  notificacion: "Notificación",
  exhorto: "Exhorto",
  ebook: "Expediente digital",
};

function docLabel(d: { nombre: string; docType?: string }): string {
  // A real filename with an extension → show it as-is.
  if (/\.[a-z0-9]{2,4}$/i.test(d.nombre)) return d.nombre;
  const key = (d.docType ?? d.nombre ?? "").toLowerCase().trim();
  if (DOC_TYPE_LABELS[key]) return DOC_TYPE_LABELS[key];
  return key
    ? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Documento";
}


function TabDocumentos({
  causaId,
  onOpenModal,
}: {
  causaId: string;
  onOpenModal: (modal: string) => void;
}) {
  const { data: docs = [], isLoading } = useDocumentos(causaId);
  const [viewer, setViewer] = useState<{ name: string; url: string | null; downloadUrl: string } | null>(null);

  const DOCS_PER_PAGE = 8;
  const [docPage, setDocPage] = useState(1);
  useEffect(() => setDocPage(1), [causaId]);
  const totalDocPages = Math.max(1, Math.ceil(docs.length / DOCS_PER_PAGE));
  const page = Math.min(docPage, totalDocPages);
  const pageDocs = docs.slice((page - 1) * DOCS_PER_PAGE, page * DOCS_PER_PAGE);

  const handleView = async (d: (typeof docs)[number]) => {
    const name = docLabel(d);
    setViewer({ name, url: null, downloadUrl: d.downloadUrl! });
    try {
      const blob = await fetchBlob(d.downloadUrl!);
      setViewer({ name, url: URL.createObjectURL(blob), downloadUrl: d.downloadUrl! });
    } catch {
      setViewer(null);
      alert("No se pudo abrir el documento.");
    }
  };

  const closeViewer = () =>
    setViewer((v) => {
      if (v?.url) URL.revokeObjectURL(v.url);
      return null;
    });

  return (
    <Card pad={0} style={{ overflow: "hidden" }}>
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--fj-line)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SubH>Documentos y escritos</SubH>
        <Btn
          size="sm"
          kind="primary"
          icon={<UploadIcon size={13} strokeWidth={1.6} />}
          onClick={() => onOpenModal("subir-documento")}
        >
          Subir documento
        </Btn>
      </div>

      {isLoading && (
        <div style={{ padding: "28px 20px" }}>
          <Splash inline label="Cargando documentos" />
        </div>
      )}

      {!isLoading && docs.length === 0 && (
        <div
          style={{
            padding: "28px 20px",
            fontFamily: "var(--fj-body)",
            fontSize: 13,
            color: "var(--fj-ink3)",
          }}
        >
          Sin documentos registrados para esta causa.
        </div>
      )}

      {!isLoading &&
        pageDocs.map((d, i) => {
          const kind = fileKind(d.nombre);
          const isPdf = kind === "pdf";
          // Only GCS-stored docs are downloadable without a live PJUD session.
          const viewable = d.status === "stored" && Boolean(d.downloadUrl);
          const title = docLabel(d);
          return (
            <div
              key={d.id}
              style={{
                padding: "14px 20px",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto auto",
                gap: 14,
                alignItems: "center",
                borderBottom: i === pageDocs.length - 1 ? "none" : "1px solid var(--fj-line)",
              }}
            >
              <DocThumb kind={kind} />
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 13.5,
                    color: "var(--fj-ink)",
                    fontWeight: 500,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--fj-body)",
                    fontSize: 11.5,
                    color: viewable ? "var(--fj-ink3)" : "var(--fj-amarillo)",
                    marginTop: 2,
                  }}
                >
                  {isPdf ? "Documento PDF" : "Documento"}
                  {d.fecha && d.fecha !== "—"
                    ? ` · ${fmtDate(d.fecha)}`
                    : " · sin fecha en los datos de PJUD"}
                  {viewable ? "" : " · no descargado aún"}
                </div>
              </div>
              {/* file-format chip */}
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  color: "var(--fj-ink3)",
                  border: "1px solid var(--fj-line)",
                  borderRadius: 4,
                  padding: "2px 6px",
                }}
              >
                {isPdf ? "PDF" : (d.nombre.match(/\.([a-z0-9]{2,4})$/i)?.[1] ?? "DOC").toUpperCase()}
              </span>
              <button
                style={{ ...iconBtnCss, opacity: viewable ? 1 : 0.35, cursor: viewable ? "pointer" : "not-allowed" }}
                title={viewable ? "Ver documento" : "No disponible todavía"}
                disabled={!viewable}
                onClick={() => viewable && handleView(d)}
              >
                <EyeIcon size={15} strokeWidth={1.6} />
              </button>
              <button
                style={{ ...iconBtnCss, opacity: viewable ? 1 : 0.35, cursor: viewable ? "pointer" : "not-allowed" }}
                title={viewable ? "Descargar" : "No disponible todavía"}
                disabled={!viewable}
                onClick={() => viewable && openDocument(d.downloadUrl!, "download", title)}
              >
                <DownloadIcon size={15} strokeWidth={1.6} />
              </button>
            </div>
          );
        })}

      {!isLoading && docs.length > DOCS_PER_PAGE && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderTop: "1px solid var(--fj-line)",
            fontFamily: "var(--fj-body)",
            fontSize: 12.5,
            color: "var(--fj-ink3)",
          }}
        >
          <span>
            {(page - 1) * DOCS_PER_PAGE + 1}–{Math.min(page * DOCS_PER_PAGE, docs.length)} de {docs.length}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{ ...iconBtnCss, opacity: page <= 1 ? 0.35 : 1, cursor: page <= 1 ? "not-allowed" : "pointer" }}
              disabled={page <= 1}
              onClick={() => setDocPage((p) => Math.max(1, p - 1))}
              title="Anterior"
            >
              <ChevronLeft size={16} strokeWidth={1.8} />
            </button>
            <span style={{ minWidth: 64, textAlign: "center" }}>
              {page} / {totalDocPages}
            </span>
            <button
              style={{ ...iconBtnCss, opacity: page >= totalDocPages ? 0.35 : 1, cursor: page >= totalDocPages ? "not-allowed" : "pointer" }}
              disabled={page >= totalDocPages}
              onClick={() => setDocPage((p) => Math.min(totalDocPages, p + 1))}
              title="Siguiente"
            >
              <ChevronRight size={16} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      )}

      {viewer && (
        <PdfViewerModal
          name={viewer.name}
          url={viewer.url}
          onClose={closeViewer}
          onDownload={() => openDocument(viewer.downloadUrl, "download", viewer.name)}
        />
      )}
    </Card>
  );
}

/* ── Timeline tone helper ── */
type TimelineTone = "primary" | "neutral" | "amarillo" | "verde";

function toneByType(tipo: string): { tone: TimelineTone; bg: string; fg: string } {
  if (tipo === "Resolución")
    return { tone: "primary", bg: "var(--fj-primary-soft)", fg: "var(--fj-primary)" };
  if (tipo === "Escrito")
    return { tone: "neutral", bg: "var(--fj-panel2)", fg: "var(--fj-ink2)" };
  if (tipo === "Notificación")
    return { tone: "amarillo", bg: "var(--fj-amarillo-soft)", fg: "var(--fj-amarillo)" };
  if (tipo === "Ingreso")
    return { tone: "verde", bg: "var(--fj-verde-soft)", fg: "var(--fj-verde)" };
  return { tone: "neutral", bg: "var(--fj-panel2)", fg: "var(--fj-ink2)" };
}

/* ── Tab: Timeline ── */
function TabTimeline({ causaId }: { causaId: string }) {
  const { data: evs = [] } = useActuaciones(causaId);
  return (
    <Card pad={28}>
      <SubH>Línea de tiempo</SubH>
      <div style={{ position: "relative", paddingLeft: 32 }}>
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 8,
            bottom: 8,
            width: 1,
            background: "var(--fj-line-strong)",
          }}
        />
        {evs.map((e, i) => {
          const t = toneByType(e.tipo);
          return (
            <div key={i} style={{ position: "relative", paddingBottom: 24 }}>
              <span
                style={{
                  position: "absolute",
                  left: -27,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: t.bg,
                  border: `2px solid ${t.fg}`,
                }}
              />
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <Pill tone={t.tone}>{e.tipo}</Pill>
                <span
                  style={{ fontFamily: "var(--fj-body)", fontSize: 11.5, color: "var(--fj-ink3)" }}
                >
                  {fmtDate(e.fecha)}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--fj-heading)",
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--fj-ink)",
                  marginTop: 6,
                }}
              >
                {e.titulo}
              </div>
              <div
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 12.5,
                  color: "var(--fj-ink3)",
                  marginTop: 3,
                }}
              >
                {e.actor}
                {e.adjuntos > 0
                  ? ` · ${e.adjuntos} adjunto${e.adjuntos === 1 ? "" : "s"}`
                  : ""}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ── Tab bar ── */
type TabId = "info" | "plazos" | "documentos" | "timeline";

/* ── Firm lawyer resolution from the case litigantes ── */
const FIRM_RUT = (import.meta.env.VITE_FIRM_RUT as string | undefined) ?? "";
const _normRut = (r: string) => (r ?? "").replace(/[.\-\s]/g, "").toLowerCase();
const _cleanName = (n: string) => n.replace(/\s*\(.*\)\s*$/, "").trim();
const _initials = (n: string) => {
  const parts = n.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "SD";
};

function resolveFirmLawyer(
  partes: { participante: string; rut: string; nombre: string }[],
  selectedRut: string | null,
  fallback: { nombre: string; iniciales: string; color: string },
): { nombre: string; iniciales: string; color: string; side: string | null } {
  // Only consider lawyer litigantes (AB.* / AP.*)
  const lawyerPartes = partes.filter(
    (p) => p.participante.startsWith("AB.") || p.participante.startsWith("AP."),
  );

  // Priority 1: the selected abogado if she appears in this case
  const selectedMatch = selectedRut
    ? lawyerPartes.find((p) => _normRut(p.rut) === _normRut(selectedRut))
    : undefined;

  // Priority 2: firm RUT (Carla / account holder)
  const firmMatch = FIRM_RUT
    ? lawyerPartes.find((p) => _normRut(p.rut) === _normRut(FIRM_RUT))
    : undefined;

  const match = selectedMatch ?? firmMatch;
  if (!match) return { ...fallback, side: null };

  const nombre = _cleanName(match.nombre);
  const side = match.participante.includes("DTE")
    ? "Demandante"
    : match.participante.includes("DDO")
    ? "Demandado"
    : null;
  return { nombre, iniciales: _initials(nombre), color: fallback.color, side };
}

/* ── Main export ── */
export function CausaDetalle({ onSubirDoc = () => {} }: { onSubirDoc?: () => void }) {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("info");
  const { data: causa } = useCausa(id);
  // Hooks must run unconditionally — keep these ABOVE the early return below.
  const { data: docsList = [] } = useDocumentos(id);
  const { data: partes = [] } = usePartes(id);
  const { data: causaPlazos = [] } = useDeadlines(id);
  const { data: actuacionesList = [] } = useActuaciones(id);
  const { abogado: selectedAbogado } = useSelectedLawyer();

  if (!causa) {
    return <Splash inline label="Cargando causa" />;
  }

  // Priority: selected abogado → firm RUT → causa.abogado fallback.
  const firmLawyer = resolveFirmLawyer(partes, selectedAbogado?.rut ?? null, causa.abogado);

  const stripeColor =
    causa.semaforo === "rojo"
      ? "var(--fj-rojo)"
      : causa.semaforo === "amarillo"
      ? "var(--fj-amarillo)"
      : causa.semaforo === "verde"
      ? "var(--fj-verde)"
      : "var(--fj-line)";

  const semLabel =
    causa.semaforo === "rojo" ? "Crítica"
    : causa.semaforo === "amarillo" ? "Atención"
    : causa.semaforo === "verde" ? "Al día"
    : (causa.semaforo as string) === "gris" ? "Sin plazo accionable"
    : "Sin seguimiento";

  const handleOpenModal = (modal: string) => {
    if (modal === "subir-documento") onSubirDoc();
  };

  const tabs: Array<{ id: TabId; label: string; badge?: number }> = [
    { id: "info", label: "Información" },
    { id: "plazos", label: "Plazos", badge: causaPlazos.length },
    { id: "documentos", label: "Documentos", badge: docsList.length },
    { id: "timeline", label: "Timeline" },
  ];

  return (
    <div style={pageCss}>
      {/* Back link */}
      <button
        onClick={() => navigate("/causas")}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          color: "var(--fj-ink3)",
          fontFamily: "var(--fj-body)",
          fontSize: 13,
          cursor: "pointer",
          padding: 0,
          marginBottom: 18,
        }}
      >
        <ChevronLIcon size={14} strokeWidth={1.6} />
        Causas
      </button>

      {/* Hero card */}
      <Card pad={28} style={{ marginBottom: 22, position: "relative", overflow: "hidden" }}>
        {/* Left color stripe */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 4,
            background: stripeColor,
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24 }}>
          {/* Left: labels + title + meta */}
          <div>
            <div
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
            >
              <span
                style={{
                  fontFamily: "var(--fj-mono)",
                  fontSize: 13,
                  color: "var(--fj-ink)",
                  fontWeight: 600,
                  background: "var(--fj-panel2)",
                  padding: "3px 8px",
                  borderRadius: 6,
                }}
              >
                {causa.rol}
              </span>
              {causa.rit && (
                <span
                  style={{ fontFamily: "var(--fj-mono)", fontSize: 12, color: "var(--fj-ink3)" }}
                >
                  RIT {causa.rit}
                </span>
              )}
              <Pill tone="neutral">{causa.materia}</Pill>
              <Pill tone={causa.semaforo ?? "neutral"}>
                <SemaforoRing status={causa.semaforo} size={12} variant="dot" />
                {semLabel}
              </Pill>
            </div>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--fj-heading)",
                fontSize: 30,
                fontWeight: 500,
                letterSpacing: "-.01em",
                color: "var(--fj-ink)",
                lineHeight: 1.15,
              }}
            >
              {causa.caratula}
            </h1>
            <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
              <MetaItem
                icon={<BuildingIcon size={16} strokeWidth={1.6} />}
                label="Tribunal"
                value={causa.tribunal}
              />
              <MetaItem
                icon={<UserIcon size={16} strokeWidth={1.6} />}
                label="Abogado"
                value={
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Avatar
                      iniciales={firmLawyer.iniciales}
                      color={firmLawyer.color}
                      nombre={firmLawyer.nombre}
                      size={20}
                    />
                    {firmLawyer.nombre}
                    {firmLawyer.side && (
                      <span
                        style={{
                          fontFamily: "var(--fj-body)",
                          fontSize: 10.5,
                          color: "var(--fj-ink3)",
                          border: "1px solid var(--fj-line)",
                          borderRadius: 999,
                          padding: "1px 7px",
                        }}
                      >
                        {firmLawyer.side}
                      </span>
                    )}
                  </span>
                }
              />
              <MetaItem
                icon={<CalendarIcon size={16} strokeWidth={1.6} />}
                label="Ingreso"
                value={fmtDate(causa.fechaIngreso)}
              />
              {causa.cuantia != null && (
                <MetaItem
                  icon={<ScaleIcon size={16} strokeWidth={1.6} />}
                  label="Cuantía"
                  value={fmtCLP(causa.cuantia)}
                />
              )}
            </div>
          </div>
          {/* Right: big ring + action buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}
          >
            <SemaforoRing status={causa.semaforo} size={64} />
            <div style={{ display: "flex", gap: 8 }}>
              <Btn
                kind="secondary"
                icon={<SparkleIcon size={14} strokeWidth={1.6} />}
                size="sm"
              >
                Asistente IA
              </Btn>
              <Btn
                kind="ghost"
                size="sm"
                style={{ width: 34, padding: "0", justifyContent: "center" }}
              >
                <MoreIcon size={15} strokeWidth={1.6} />
              </Btn>
            </div>
          </div>
        </div>
      </Card>

      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          gap: 2,
          borderBottom: "1px solid var(--fj-line)",
          marginBottom: 20,
          paddingLeft: 4,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "12px 18px",
              position: "relative",
              fontFamily: "var(--fj-body)",
              fontSize: 13.5,
              fontWeight: tab === t.id ? 600 : 500,
              color: tab === t.id ? "var(--fj-ink)" : "var(--fj-ink3)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
            {t.badge != null && (
              <span
                style={{
                  fontFamily: "var(--fj-body)",
                  fontSize: 10.5,
                  fontWeight: 600,
                  padding: "1px 7px",
                  borderRadius: 999,
                  background: "var(--fj-panel2)",
                  color: "var(--fj-ink3)",
                }}
              >
                {t.badge}
              </span>
            )}
            {tab === t.id && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  background: "var(--fj-primary)",
                  borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "info" && (
        <TabInfo
          causa={causa}
          onOpenModal={handleOpenModal}
          partes={partes}
          latestActuacion={actuacionesList[0]}
        />
      )}
      {tab === "plazos" && (
        <TabPlazos plazos={causaPlazos} onOpenModal={handleOpenModal} />
      )}
      {tab === "documentos" && <TabDocumentos causaId={causa.id} onOpenModal={handleOpenModal} />}
      {tab === "timeline" && <TabTimeline causaId={causa.id} />}
    </div>
  );
}
