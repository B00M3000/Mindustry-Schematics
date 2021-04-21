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

router.get('/', (req, res) => {
  res.render('user_token_login', {
    
  });
});
