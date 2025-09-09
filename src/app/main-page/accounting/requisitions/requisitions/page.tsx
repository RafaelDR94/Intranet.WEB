import React from 'react';

import RequisitionsForm from '../components/RequisitionsForm/RequisitionsForm';

import ExcelLoader from './components/ExcelLoader/ExcelLoader';

const Requisitions = () => {

  return (
    <>
      <ExcelLoader />
      <RequisitionsForm />
    </>
  );
};

export default Requisitions;
