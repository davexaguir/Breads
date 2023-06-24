const express = require('express')
const breads = express.Router()
const Bread = require('../models/bread.js')
const Baker = require('../models/baker.js')

// NEW
breads.get('/new', (req, res) => {
  Baker.find()
  .then(foundBakers => {
    res.render('new', {
      bakers: foundBakers
    }) 
  })  
})

// INDEX
breads.get('/', async (req, res) => {
  const foundBakers = await Baker.find().lean()
  const foundBreads = await Bread.find().limit(15).lean()
      res.render('index', {
        breads: foundBreads,
        bakers: foundBakers,
        title: 'Index Page'
      })
    })

// EDIT
breads.get('/:id/edit', (req, res) => {
  Baker.find()
    .then(foundBakers => {
        Bread.findById(req.params.id)
          .then(foundBread => {
            res.render('edit', {
                bread: foundBread, 
                bakers: foundBakers 
            })
          })
    })
})



// SHOW
breads.get('/:id', (req, res) => {
  Bread.findById(req.params.id)
    .populate('baker')
    .then(foundBread => {
      res.render('show', {
        bread: foundBread
      })
    })
    .catch(err => {
      res.send('404')
    })
})
  
  
  //Create
  breads.post('/', express.urlencoded({ extended: true }),(req, res)=>{
    // console.log(req.body)
    if (!req.body.image) {
      req.body.image = undefined
    }
    if(req.body.hasGluten === 'on'){
      req.body.hasGluten = 'true'
    } else {
      req.body.hasGluten = 'false'
    }
    Bread.create(req.body)
    .then(() => {
      res.redirect('/breads');
    })
    .catch((error) => {
      console.error('Error creating bread:', error);
      res.status(400).send('Validation failed. this bread could not be created.');
    });
});

  //Delete:
  breads.delete('/:id', (req, res) => {
    Bread.findByIdAndDelete(req.params.id).then(deleteBread => {
      res.status(303).redirect('/breads')
    })
  })
  
  // UPDATE
  breads.put('/:id', express.urlencoded({ extended: true }), (req, res) => {
    if(req.body.hasGluten === 'on'){
      req.body.hasGluten = true
    } else {
      req.body.hasGluten = false
    }
    Bread.findByIdAndUpdate(req.params.id, req.body, {new: true}).then(
      (updatedBread) => {
      console.log(updatedBread)
      res.redirect(`/breads/${req.params.id}`)
    })
  })
  

module.exports = breads