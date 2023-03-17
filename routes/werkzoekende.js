var express = require('express');
const Werkzoekende = require("../public/javascripts/mongomodels/werkzoekende");
var router = express.Router();

/* GET werkzoekende overview */
router.get('/', async function(req, res) {
    try {
        const dbWerkzoekende = await Werkzoekende.find();
        res.render('werkzoekende', {werkzoekende: dbWerkzoekende,errors:[]});
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});