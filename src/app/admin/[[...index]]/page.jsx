'use client';

import { Studio } from 'sanity';
import config from '../../../../sanity.config.js';

export default function AdminPage() {
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={config} />
    </div>
  );
}
