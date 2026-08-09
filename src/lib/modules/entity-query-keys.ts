/**
 * Creates the standard React Query key hierarchy for a domain entity.
 *
 * Keep entity-specific keys beside the module when the module needs more
 * than list/detail keys; this helper only covers the proven common shape.
 */
export function createEntityQueryKeys<const TEntity extends string>(
  entity: TEntity,
) {
  const all = [entity] as const;

  return {
    all,
    lists: () => [...all, "list"] as const,
    list: <TParams>(params: TParams) => [...all, "list", params] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: string) => [...all, "detail", id] as const,
  } as const;
}
