export type UserRequisitionsListProps = {
  /**
   * Forces the table to render even if the `id` param is missing.
   * Useful for tests or embedded views.
   */
  forceVisible?: boolean;
  /** Employee identifier to fetch requisitions for. */
  userId?: string | null;
};