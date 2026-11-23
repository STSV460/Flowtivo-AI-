import { createServerlessContactHandler } from '../server/vercel-contact.mjs';

export default { fetch:createServerlessContactHandler() };
