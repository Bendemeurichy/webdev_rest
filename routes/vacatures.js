var express = require('express');
var router = express.Router();
const Vacature = require('../public/javascripts/mongomodels/vacatures');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try{
        const dbvacatures = await Vacature.find();
        res.render('vacatures', { vacatures: dbvacatures});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;