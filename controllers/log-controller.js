let express = require('express');
let router = express.Router();
let validateSession = require('../middleware/validate-session');
let Log = require('../db').import('../models/log');

router.get('/practice', validateSession, function(req,res)
{
    res.send("This is a practice route!")
});

router.post('/create', validateSession, (req,res) =>{
    const logEntry = {
        description: req.body.workout.description,
        definition: req.body.workout.definition,
        result: req.body.workout.result,
        owner_id: req.user.id
    }
    Log.create(logEntry)
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({error:err}))
});

router.get("/", (req,res) => {
    Log.findAll()
        .then(logs=> res.status(200).json(logs))
        .catch(err => res.status(500).json({error:err}))
});

router.get("/mine", validateSession, (req,res) => {
    let userid = req.user.id
    Log.findAll({
        where: {owner_id: userid}
    })
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({error:err}))
});

router.get('/:description', function (req, res){
    let description = req.params.description;

    Log.findAll({
        where:{ description: description}
    })
    .then(logs => res.status(200).json(logs))
    .catch(err => res.status(500).json({error:err}))
});

router.put("/update/:entryId", validateSession, function (req,res){
    const updateLogEntry = {
        description: req.body.workout.description,
        definition: req.body.workout.definition,
        result: req.body.workout.result,
        owner_id: req.user.id
    };

    const query = { where: {id: req.params.entryId, owner_id: req.user.id} };
    
    Log.update(req.body.workout, query)
    .then((logs) => res.status(200).json(logs))
    .catch((err) => res.status(500).json({error:err}))
});

router.delete("/delete/:id", validateSession, function (req,res){
    const query = { where: {id: req.params.id, owner_id: req.user.id}};

    Log.destroy(query)
    .then(() => res.status(200).json ({message: "Log Entry Removed"}))
    .catch((err) => res.status(500).json ({error:err}));
});

module.exports = router;