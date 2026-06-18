import { useMemo, useCallback, useState } from "react";
import { useCausas } from "@/hooks/useCausas";
import { useSelectedLawyer } from "@/lawyer/LawyerProvider";
import type { Causa } from "@/data/types";

export interface Novedad {
  causa: Causa;
  ultima: string;
  isNew: boolean;
}

type Snapshot = Record<string, string>; // caseId -> ultimaActuacion seen

function snapshotKey(rut: string) {
  return `sd_novedades_snapshot_${rut}`;
}

function readSnapshot(rut: string): Snapshot {
  try {
    const raw = localStorage.getItem(snapshotKey(rut));
    return raw ? (JSON.parse(raw) as Snapshot) : {};
  } catch {
    return {};
  }
}

function writeSnapshot(rut: string, snapshot: Snapshot) {
  localStorage.setItem(snapshotKey(rut), JSON.stringify(snapshot));
}

/** Parse only the date part ("YYYY-MM-DD") from an ISO string to avoid TZ shifts. */
function dateOnly(iso: string): string {
  return iso.split("T")[0] ?? iso;
}

const TWENTY_ONE_DAYS_MS = 21 * 24 * 60 * 60 * 1000;

function isWithin21Days(iso: string): boolean {
  const d = new Date(dateOnly(iso) + "T12:00:00");
  if (isNaN(d.getTime())) return false;
  return Date.now() - d.getTime() <= TWENTY_ONE_DAYS_MS;
}

export function useNovedades() {
  const { abogado } = useSelectedLawyer();
  const rut = abogado?.rut ?? null;
  const { data: causas = [], isLoading } = useCausas();
  // Tick forces re-read of localStorage after markAllSeen
  const [tick, setTick] = useState(0);

  const novedades = useMemo<Novedad[]>(() => {
    void tick; // reactive dependency — re-reads localStorage when tick changes
    if (!rut || isLoading) return [];
    const snapshot = readSnapshot(rut);

    const result: Novedad[] = [];
    for (const causa of causas) {
      const ultima = causa.ultimaActuacion;
      if (!ultima) continue;

      const seen = snapshot[causa.id];
      if (seen !== undefined) {
        // Known case: only include if there is a strictly newer movement
        if (dateOnly(ultima) > dateOnly(seen)) {
          result.push({ causa, ultima, isNew: true });
        }
      } else {
        // Unknown case (first visit / new case): include only if recent (≤ 21 days)
        if (isWithin21Days(ultima)) {
          result.push({ causa, ultima, isNew: false });
        }
      }
    }

    result.sort((a, b) => (dateOnly(b.ultima) > dateOnly(a.ultima) ? 1 : -1));
    return result;
  }, [tick, rut, causas, isLoading]);

  const markAllSeen = useCallback(() => {
    if (!rut) return;
    const snapshot = readSnapshot(rut);
    for (const causa of causas) {
      if (causa.ultimaActuacion) {
        snapshot[causa.id] = causa.ultimaActuacion;
      }
    }
    writeSnapshot(rut, snapshot);
    setTick((t) => t + 1);
  }, [rut, causas]);

  return {
    novedades,
    count: novedades.length,
    markAllSeen,
    isLoading,
  };
}
