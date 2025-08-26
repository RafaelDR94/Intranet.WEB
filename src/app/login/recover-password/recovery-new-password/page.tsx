import { Suspense } from 'react';
import RecoverPassword from './components/RecoverPassword/RecoverPassword';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RecoverPassword />
    </Suspense>
  );
}