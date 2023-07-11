import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

function Main(): JSX.Element {
  return (
    <>
      <h1 className="mb-1">Список дел</h1>
      <NavBar />
      <Outlet />
    </>
  );
}

export default Main;
