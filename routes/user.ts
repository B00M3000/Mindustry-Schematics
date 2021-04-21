import { Router } from 'express';
import UserTokenSchema, { UserTokenDocument } from '../schemas/UserToken';

const router = Router();
export default router;

router.post('/login', async (req, res) => {
  const { token } = req.body
  if(!token) return res.redirect("/user")
  
  res.cookie('token', token)
  res.redirect('/user')
})

router.post('/logout', async (req, res) => {
  res.cookie('token', '')
  res.redirect('/user')
})

router.post('/:token', async (req, res) => {
  if(!res.locals.user || res.locals.user.access != "admin") return res.sendStatus(403)

  const { username, token, access } = req.body
  const _token = req.params.token
  if(res.locals.user && res.locals.user.token == req.params.token) res.cookie('token', token)
  const response = await UserTokenSchema.updateOne({
    token: _token
  }, {
    username,
    token,
    access,
  })
  res.sendStatus(200)
})

router.get('/', (req, res) => {
  res.render('user_token_login')
});
