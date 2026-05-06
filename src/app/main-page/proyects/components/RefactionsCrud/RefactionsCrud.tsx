'use client';

import RefactionsDetail from './components/RefactionsDetail';
import RefactionsForm from './components/RefactionsForm';
import RefactionsList from './components/RefactionsList';
import { useRefactionsCrud } from './hooks/useRefactionsCrud';
import type { CrudScope } from '../types';

type RefactionsCrudProps = {
  scope: CrudScope;
};

const RefactionsCrud = ({ scope }: RefactionsCrudProps) => {
  const { crudView } = useRefactionsCrud(scope);

  if (crudView === 'form') return <RefactionsForm scope={scope} />;

  return (
    <>
      <RefactionsList scope={scope} />
      <RefactionsDetail scope={scope} open={crudView === 'detail'} />
    </>
  );
};

export default RefactionsCrud;
