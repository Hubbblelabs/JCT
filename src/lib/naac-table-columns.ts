import type { BuiltinColumn } from "@/lib/table-columns";
import type { NaacPageValue } from "@/lib/validation";

/**
 * Built-in columns of the NAAC appeal tables. Their default names come from
 * the table's older `columns` label object, so a renamed heading carries over
 * into the editable column list (`columnList`).
 *
 * The quantitative table's default header has two rows — "Values" over SSR and
 * DVV, "Marks" over Awarded and Requested. A column list is one row, so there
 * those four are named in full ("Values (SSR)").
 */

type QualitativeLabels = NaacPageValue["qualitative"]["columns"];
type QuantitativeLabels = NaacPageValue["quantitative"]["columns"];

export function naacQualitativeBuiltins(l: QualitativeLabels): BuiltinColumn[] {
  return [
    { id: "metric", label: l.metric, locked: true, placeholder: "2.2.1" },
    { id: "description", label: l.description, multiline: true },
    { id: "expertsMarks", label: l.expertsMarks, placeholder: "2" },
    { id: "marksRequested", label: l.marksRequested, placeholder: "4" },
    { id: "justification", label: l.justification, multiline: true },
  ];
}

export function naacQuantitativeBuiltins(
  l: QuantitativeLabels,
): BuiltinColumn[] {
  return [
    { id: "metric", label: l.metric, locked: true, placeholder: "3.4.3" },
    { id: "parameter", label: l.parameter, multiline: true },
    {
      id: "ssr",
      label: `${l.values} (${l.ssr})`,
      placeholder: "11/10/5/4/4, 30",
    },
    {
      id: "dvv",
      label: `${l.values} (${l.dvv})`,
      placeholder: "5/8/4/2/3, 22",
    },
    { id: "awarded", label: `${l.marks} (${l.awarded})`, placeholder: "1" },
    {
      id: "requested",
      label: `${l.marks} (${l.requested})`,
      placeholder: "2",
    },
    { id: "justification", label: l.justification, multiline: true },
  ];
}

/** Cell styling by column — marks are centred, the requested mark stands out. */
export const NAAC_CENTERED = new Set([
  "expertsMarks",
  "marksRequested",
  "ssr",
  "dvv",
  "awarded",
  "requested",
]);
export const NAAC_HIGHLIGHTED = new Set(["marksRequested", "requested"]);
