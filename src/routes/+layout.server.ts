import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals, depends }) => {
  const session: App.PageData['session'] = locals.user
    ? {
        ...locals.user,
        access: locals.user?.access.toString(),
      }
    : {};

  depends('app:logout');

  return { session };
};
