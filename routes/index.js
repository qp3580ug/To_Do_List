var express = require('express');
var router = express.Router();
var Task = require('../models/task');

/* GET home page. */
router.get('/', function(req, res, next) {

  Task.find( {completed: false} )
    .then( (docs) => {
      res.render('index', {title: 'Incomplete tasks', tasks: docs} );
    })
    .catch( (err) => {
      next(err);
    });

});

router.post('/add', function(req, res, next){

  if (req.body.text) {
    var t = new Task({ text: req.body.text, completed: false})
    t.save().then( (newTask) => {
      console.log('The new task created is ', newTask);
      res.redirect('/');
    }).catch( () => {
      next(err);
    });
  }
  else {
    req.flash('error', 'Please enter a task.')
    res.redirect('/');
  }
});

router.post('/done', function(req, res, next){

  Task.findByIdAndUpdate( req.body._id, {completed: true})
    .then( (originalTask) => {
      if (originalTask) {
        req.flash('info', originalTask.text + ' marked as done!');
        res.redirect('/');
      } else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      }
    })
    .catch( (err) => {
      next(err);
    });
});

router.get('/completed', function(req, res, next){

  Task.find({completed:true})
    .then( (docs) => {
    res.render('completed_tasks', {tasks: docs });
  })
  .catch( (err) => {
    next(err);
  });
});

router.post('/delete', function(req, res, next){

  Task.findByIdAndRemove(req.body._id)
    .then( (deletedTask) => {
      if (deletedTask) {
        req.flash('info', 'Task deleted.')
        res.redirect('/');
      } else {
        var error = new Error('Task Not Found')
        error.status = 404;
        next(err);
      }
    })
    .catch( (err) => {
      next(err);
    })
});

router.post('/alldone', function(req, res, next){
  Task.updateMany({completed: false}, {completed: true})
    .then( () => {
      req.flash('info', 'All tasks are done!');
      res.redirect('/');
    })
    .catch( (err) => {
      next(err);
    });
});

router.get('/task/:_id', function(req, res, next){
  Task.findById(req.params._id)
    .then( (doc) => {
      if (doc) {
        res.render('task', {task: doc});
      }
    })
    .catch( (err) => {
      next(err);
    });
});



module.exports = router;
