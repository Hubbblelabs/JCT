/**
 * Section/Tab shapes for the block editor.
 *
 * These used to describe a *second* program content model (`content.tabs`,
 * rendered by TabsProgramLayout). Nothing rendered it — the public program page
 * reads `tabsConfig` + `blocks` — so the layout, the editor panel that wrote it
 * and the migrate-tabs route that generated it were removed, along with the
 * `TabsProgram` type and its normalizer.
 *
 * What survives is the editing shape itself, which the Engineering Research
 * page reuses: `ResearchTabValue` in `validation/engineeringPages.ts` mirrors
 * `Tab`, so both are editable through the one `<ProgramTabsEditor />`.
 */
export type Section =
  | { kind: "richText"; html: string }
  | {
      kind: "stats";
      items: { label: string; value: string; sub?: string }[];
    }
  | { kind: "list"; title?: string; items: string[] }
  | {
      kind: "cards";
      title?: string;
      items: { title: string; description: string; image?: string }[];
    }
  | { kind: "image"; src: string; caption?: string }
  | {
      kind: "people";
      items: {
        name: string;
        title: string;
        image?: string;
        email?: string;
        qualifications?: string;
      }[];
    };

export type Tab = {
  id: string;
  label: string;
  icon?: string;
  sections: Section[];
};
