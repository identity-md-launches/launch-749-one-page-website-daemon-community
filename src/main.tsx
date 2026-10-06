import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';

const root = document.getElementById('root')!;
// Production HTML is prerendered; Vite development starts with an empty root.
if (root.querySelector('main')) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
