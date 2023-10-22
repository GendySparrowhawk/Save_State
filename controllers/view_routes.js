const router = require('express').Router();
const axios = require('axios');
const { Op, literal } = require('sequelize');
const { isLoggedIn, isAuthenticated, authenticate } = require('../utils');

const { User, Review, Favorite, Game } = require('../models');

const baseURL = 'https://api.rawg.io/api'


router.get('/', authenticate, async (req, res) => {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Game,
          attributes: [
            'id',
            'title',
            [literal("substring(description, 1, 100)"), 'description'], // Limit the description field to the first 50 characters
            'thumbnail'
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 8
    });
      
    res.render('landing', {
      errors: req.session.errors,
      user: req.user,
      reviews: reviews.map(r => r.get({ plain: true })),
    });

  });

  router.get('/all', authenticate, async (req, res) => {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
        },
        {
          model: Game,
          attributes: [
            'id',
            'title',
            [literal("substring(description, 1, 100)"), 'description'], // Limit the description field to the first 50 characters
            'thumbnail'
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
    });
      
    res.render('landing', {
      errors: req.session.errors,
      user: req.user,
      reviews: reviews.map(r => r.get({ plain: true })),
    });

  });
  
  // Show the register form
  router.get('/register',  (req, res) => {
    // Render the register form template
    res.render('register_form', {
      errors: req.session.errors,
      user: req.user
    })
      
    req.session.errors = [];
  });
  
  // GET route to show the login form
  router.get('/login', (req, res) => {
    // Render the register form template
    res.render('login_form', {
      errors: req.session.errors,
      user: req.user,
    });
  
    req.session.errors = [];
  });

  router.get('/reviews', (req, res) => {
    res.render('reviews', {
      errors: req.session.errors,
      user: req.user,
    });
  });

  router.get('/reviews/:id', async (req, res) => {
    try {
      console.log(req.user);
      const game = await Game.findByPk(req.params.id);
      
      const reviews = await Review.findAll({
        where: {
          game_id: req.params.id
        },
        include: [
          {
            model: User,
          },
          {
            model: Game,
            attributes: [
              'id',
              'game_name',
              'description',
              'thumbnail',
              'publisher',
              'developer',
              'rating',
              'released_date'
            ]
          }
        ],
      });

      // reviews: reviews.map(r => r.get({ plain: true })),

      res.render('reviews', {
        errors: req.session.errors,
        user: req.user,
        game: game.get({ plain: true }),
        reviews: reviews.map(r => r.get({ plain: true })),
      });

    } catch (err) {
      console.log(err);
      res.send(err);
    }
    
  });

  router.get('/game', async (req, res) => {
    try {
      // const { data } = await axios.get(`${baseURL}/games?key=${process.env.API_KEY}&search=${req.query.title}&search_exact=true`);
      
      // let game;

      // let games;
      console.log('Review!', req.query.title);
      // res.render('reviews', {
      //   errors: req.session.errors,
      //   user: req.user,
      // });

      res.status(200).json({ message: 'Got games!'});

      // if (data.results.length > 1) {
      //   console.log('you have more than 1 result');
      //   games = data.results;
      //   // res.render('reviews');
      // } else if (data.results.length === 1) {
      //   console.log('1 result returned');
      //   game = data.results[0];
      //   // res.render('reviews');
      // } else {
      //   console.log('No results found');
  
      // }
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  })
  
  module.exports = router;