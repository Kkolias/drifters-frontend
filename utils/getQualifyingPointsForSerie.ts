import { DriftSerie } from "~/enums/drift-serie.enum";

export function getQualifyingPositionPointBySerie(
  serie: DriftSerie | null,
  position: number
) {
  if (!serie) return 0;
  if (serie === DriftSerie.dmec) {
    return getDmecQualifyingPositionPoint(position);
  } else if (serie === DriftSerie.driftsmpro) {
    return getSmdriftQualifyingPositionPoint(position);
  } else {
    return 0;
  }
}

function getDmecQualifyingPositionPoint(position: number) {
  if (position > 8) return 0;
  return 9 - position;
}

function getSmdriftQualifyingPositionPoint(position: number) {
  if (position > 16) return 0;
  return 17 - position;
}

