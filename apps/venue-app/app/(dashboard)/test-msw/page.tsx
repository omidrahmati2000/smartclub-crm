'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function TestMSWPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get('/venues/venue-1/assets');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>MSW Test Page</h1>
      <button
        onClick={testFetch}
        disabled={loading}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Testing...' : 'Test MSW Fetch'}
      </button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div>
          <h2>Result:</h2>
          <pre style={{ background: '#f5f5f5', padding: '20px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
