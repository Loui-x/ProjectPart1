// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation
*/
const viewPath = 'resources';
const DayOff = require('../models/Resource');
const User = require('../models/User');

/*
  The resource controller must contain the 7 resource actions:
  */
 /*
  - index
  */
 exports.index = async (req, res) => {
  try {
    const daysOff = await DayOff
      .find()
      .populate('user')
      .sort({updatedAt: 'desc'});
console.log(daysOff);
    res.render(`${viewPath}/index`, {
      pageTitle: 'Archive',
      daysOff:daysOff
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying the index: ${error}`);
    res.redirect('/');
  }
};
 /*
  - show
  */
 exports.show = async (req, res) => {
  try {
    const dayoffs = await DayOff.findById(req.params.id)
      .populate('user');
    //console.log(dayoff);
    res.render(`${viewPath}/show`, {
      pageTitle: dayoffs.title,
      dayoffs:dayoffs
    });
  } catch (error) {
    req.flash('danger', `Thesre was an error displaying this Holiday Reservation: ${error}`);
    res.redirect('/');
  }
};
 /*

  - new
   */
  exports.new = (req, res) => {
    res.render(`${viewPath}/new`, {
      pageTitle: 'Holiday Reservation'
    });
  };
 /*
  - create
  */
 exports.create = async (req, res) => {
  try {
    console.log(req.session.passport);
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    console.log('User', user);
    const dayoff = await DayOff.create({user: user._id, ...req.body});

    req.flash('success', 'Holiday Reservation made successfully');
    res.redirect(`/resources/${dayoff.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this reservation : ${error}`);
    req.session.formData = req.body;
    res.redirect('/resources/new');
  }
};
 /*
  - edit
  */
 exports.edit = async (req, res) => {
   console.log("inside");
  try {
    const dayoff = await DayOff.findById(req.params.id);
    console.log(dayoff);
    res.render(`${viewPath}/edit`, {
      pageTitle: dayoff.title,
      formData: dayoff
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this reservation: ${error}`);
    res.redirect('/');
  }
};
 /*

  - update
  */
 exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let dayoff = await DayOff.findById(req.body.id);
    if (!dayoff) throw new Error('No Reservations made');
console.log("got the reservation");
    const attributes = {user: user._id, ...req.body};
    console.log(attributes);
    await DayOff.validate(attributes);
    await DayOff.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The reservation was updated successfully');
    res.redirect(`/resources/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this reservation: ${error}`);
    res.redirect(`/resources/${req.body.id}/edit`);
  }
};
 /*
  - delete
*/
exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await DayOff.deleteOne({_id: req.body.id});
    req.flash('success', 'The holiday reservation was deleted successfully');
    res.redirect(`/resources`);
  } catch (error) {
    req.flash('danger', `There was an error removing the reservation!: ${error}`);
    res.redirect(`/resources`);
  }
};