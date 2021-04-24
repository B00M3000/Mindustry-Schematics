import { User, accessLevels } from '../auth';
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
  if (!user || user.access < accessLevels.admin) return res.sendStatus(403);

  const { username, token, access } = req.body;
  const _token = req.params.token;
  if (user && user.token === req.params.token) res.cookie('token', token);
  await UserTokenSchema.findOneAndUpdate(
    {
      token: _token,
    },
    {
      username,
      token,
      access,
    },
    {
      upsert: true,
    }
  );
  res.sendStatus(200);
});

router.delete('/:token', async (req, res) => {
  const user = res.locals.user as User;
  if (!user || user.access < accessLevels.admin) return res.sendStatus(403);

  const _token = req.params.token;
  await UserTokenSchema.deleteOne({
    token: _token,
  });
});

router.get('/', (req, res) => {
  const user = res.locals.user as User | undefined;
  const options: Record<string, unknown> = {};
  if (user) {
    options.isAdmin = user.access >= accessLevels.admin;
    options.isMod = user.access >= accessLevels.mod;
  }
  res.render('user_token_login', options);
});
