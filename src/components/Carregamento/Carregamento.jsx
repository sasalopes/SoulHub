import React from 'react';
import { Spinner } from 'react-bootstrap';

export const Carregamento = () => {
  return (
    <div className="text-center mt-5 vh-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default Carregamento;
