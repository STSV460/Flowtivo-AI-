import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from './App';

export { services, email, brand } from './data/content';

export function render(path: string) {
  return renderToString(<MemoryRouter initialEntries={[path]}><AppContent /></MemoryRouter>);
}
