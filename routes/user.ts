import { User, roles } from '../auth';
import { Router } from 'express';
import UserTokenSchema from '../schemas/UserToken';

const router = Router();
export default router;

router.post('/login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.redirect('/user');

  res.cookie('token', token);
  res.redirect('/user');
});

router.post('/logout', async (req, res) => {
  res.cookie('token', '');
  res.redirect('/user');
});

router.post('/:token', async (req, res) => {
  const user = res.locals.user as User;
  if (!user || user.role < roles.admin) return res.sendStatus(403);

  const { username, token, access } = req.body;
  const _token = req.params.token;
  if (user && user.token === req.params.token) res.cookie('token', token);
  const response = await UserTokenSchema.updateOne(
    {
      token: _token,
    },
    {
      username,
      token,
      access,
    }
  );
  res.sendStatus(200);
});

router.get('/', (req, res) => {
  res.render('user_token_login');
});
