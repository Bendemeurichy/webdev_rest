var express = require('express');
var router = express.Router();
const Werkzoekende = require("../public/javascripts/mongomodels/werkzoekende");

/* GET werkzoekende overview */
router.get('/', async function(req, res) {
    try {
        const dbWerkzoekende = await Werkzoekende.find();
        res.render('werkzoekenden', {werkzoekende: dbWerkzoekende,errors:[]});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/add' , async (req, res) => {
    res.render('addWerkzoekende');
});

module.exports = router;