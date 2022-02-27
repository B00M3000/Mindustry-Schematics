export async function parseFormData<T extends Record<string, string>>(
  request: Request,
): Promise<T | null> {
  const type = request.headers.get('content-type');
  if (
    !type?.startsWith('multipart/form-data') &&
    !type?.startsWith('application/x-www-form-urlencoded')
  )
    return null;
  const formData = await request.formData();
  const result: Record<string, FormDataEntryValue> = {};
  formData.forEach((value, key) => {
    result[key] = value;
  });
  return result as T;
}

export async function parseText(request: Request): Promise<string | null> {
  const type = request.headers.get('content-type');
  if (!type?.startsWith('text')) return null;
  return request.text();
}
