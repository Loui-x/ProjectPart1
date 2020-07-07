
const { new: _new, create, delete: _delete } = require('../controllers/SessionsController');

module.exports = router => {
  router.get('/login', _new);
  router.post('/authenticate', create);
  router.get('/logout', _delete);
};