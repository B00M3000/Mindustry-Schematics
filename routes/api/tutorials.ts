import { Router } from 'express';
import { mapTutorials } from '../../util';

const tutorials = mapTutorials();

const router = Router();
export default router;
type TutorialInfo = {
  title: string;
  name: string;
};
router.get('/', (req, res) => {
  const data: TutorialInfo[] = [];
  tutorials.forEach((value, key) => {
    data.push({
      title: value.title,
      name: key,
    });
  });
  res.send(data);
});
router.get('/:name', (req, res) => {
  const { name } = req.params;
  const tutorial = tutorials.get(name);
  if (!tutorial) return res.redirect('/help');
  res.send(tutorial.html);
});
