import bcrypt from 'bcrypt';
import DBClient from '../../../utils/server/DBClient';
import Admin from '../../../models/Admin';
import { NextRequest, NextResponse } from 'next/server';
import { loadComponents } from 'next/dist/server/load-components';
import { withIronSession } from 'next-iron-session';
import { getSession } from 'next-auth/react';
import withSession from '../../../utils/server/withSession';

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      req.session.destroy();
      res.end();
    default:
      res.status(400).send('Bad request');
  }
});
