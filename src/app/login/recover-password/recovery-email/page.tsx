import { Suspense } from 'react';

import RecoverEmailClient from './components/RecoverEmailClient/RecoverEmailClient';

export default function RecoveryEmailPage() {
  return (
    <Suspense fallback={null}>
      <RecoverEmailClient />
    </Suspense>
  );
}