export function getPaginatedQueryPosition({
  page,
  limitPerPage,
  documents,
}: {
  page: number;
  limitPerPage: number;
  documents: number;
}) {
  const pages = Math.ceil(documents / limitPerPage) || 1;

  // limits page between 1 and pages
  const validatedPage = Math.min(Math.max(page, 1), pages);
  return {
    pages,
    page: validatedPage,
    skip: limitPerPage * (validatedPage - 1),
  };
}
