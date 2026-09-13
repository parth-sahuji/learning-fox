import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import App from './App.jsx';

export function render(url) {
  const html = renderToString(<App ssrPath={url} />);
  const helmet = Helmet.renderStatic(); // must be read synchronously right after render - react-helmet v6's side-effect model
  return { html, helmet };
}
