import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  const session = locals.user && {
    ...locals.user,
    access: locals.user?.access.toString(),
  };

  return {
    session,
  };
};
