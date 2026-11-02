import React from 'react';
import { Link } from 'react-router-dom';
import { getSessionUser } from '../session';

const NotFound = () => {
  const user = getSessionUser();
  const home = !user ? '/login' : user.role !== 0 ? '/admin/dashboard' : `/home/${user._id}`;

  return (
    <main className="not-found">
      <img src="/jungleplant2-drc.png" alt="" aria-hidden="true" />
      <h1>404</h1>
      <p>This page seems to have wilted.</p>
      <Link to={home}>Back to the garden</Link>
    </main>
  );
};

export default NotFound;
