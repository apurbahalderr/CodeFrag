'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch(() => setStatus('Could not reach backend'));
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>CodeFrag</h1>
      <p>Backend status: {status}</p>
    </main>
  );
}