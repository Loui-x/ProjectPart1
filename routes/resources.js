const { new: _new, index, show, create, edit, update, delete: _delete } = require('../controllers/ResourceController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  router.get('/resources', index); // public
  router.get('/resources/new', auth, _new); // authenticated
  router.post('/resources', auth, create);  // authenticated
  router.post('/resources/update', auth, update);  // authenticated
  router.post('/resources/delete', auth, _delete);  // authenticated
  router.get('/resources/:id/edit', auth, edit);  // authenticated
  router.get('/resources/:id', show); // public
};