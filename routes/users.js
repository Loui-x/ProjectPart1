const { new: _new, create: create  } = require('../controllers/UsersController');

module.exports = router => {
  router.get('/users/new', _new);
  router.post('/users', create);
};