import { createNetlifyContactHandler } from '../../server/netlify-contact.mjs';

export default createNetlifyContactHandler();

export const config = { path:'/api/contact' };
