import { createServerlessContactHandler } from './vercel-contact.mjs';

export function createNetlifyContactHandler(options) {
  const contact = createServerlessContactHandler(options);
  return (request, context) => {
    // Use Netlify's trusted runtime IP, never a visitor-supplied forwarding header.
    const headers = new Headers(request.headers);
    headers.set('x-forwarded-for', context?.ip || 'unknown');
    return contact(new Request(request, { headers }));
  };
}
