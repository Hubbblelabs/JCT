/**
 * The admin component kit.
 *
 * Every admin screen builds from these. If a screen needs markup that is not
 * here, add it here rather than inlining it — the drift this kit replaces
 * started as one page "just this once" writing its own table.
 */
export { PageShell } from "./PageShell";
export { DataTable, type Column, type BulkAction } from "./DataTable";
export { Drawer } from "./Drawer";
export { SaveBar, type SaveState } from "./SaveBar";
export { SortableList } from "./SortableList";
export { useUnsavedGuard } from "./useUnsavedGuard";
export {
  Banner,
  EmptyState,
  Fieldset,
  PublishBadge,
  SectionLabel,
  Skeleton,
  SkeletonRows,
  StatusBadge,
  VisibilityBadge,
  type StatusTone,
} from "./primitives";
