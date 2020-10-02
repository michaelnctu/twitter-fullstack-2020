const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User, Reply,
        { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const UserId = helpers.getUser(req).id
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.dataValues.description,
          isLiked: t.LikedUsers.map(d => d.id).includes(t.id)
        }))
        return User.findOne({ where: { id: UserId } })
          .then(user => {
            return res.render('tweets', { tweets: data, user })
          })
      })
      .catch(error => console.log(error))
  },

  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include:[
        User,
        {model: Reply, include:[User]}, 
        {model: User, as: 'LikedUsers'}
      ],
      order: [['Replies','createdAt', 'DESC']]
    }).then(tweet => {
      const UserId = helpers.getUser(req).id
      const isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)

        return User.findOne({ where: { id: UserId } })
          .then(user => { 
            console.log(user)
            return res.render('tweet', {
              tweet: tweet, 
              isLiked:isLiked })
      })
      
    })
    .catch(error => console.log(error))
  },

  postTweet: (req,res) => {
    if (!req.body.description){
      req.flash('error_messages','貼文不可空白')
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      req.flash('error_messages','貼文不得超過140個字')
      return res.redirect('back')
    }
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then(tweet => {
      return res.redirect('/tweets')
    })
    .catch(error => console.log(error))
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id, 
      TweetId: req.params.id
    }).then((like) => {
      return res.redirect('back') 
    })
    .catch(error => console.log(error))
  },

  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id, 
        TweetId: req.params.id
      }
    }).then((like) => {
      like.destroy()
      .then(tweet => {
        return res.redirect('back')
      })
    })
    .catch(error => console.log(error))
  },

  getReply: (req, res) => {
    return Tweet.findByPk(req.params.id, 
      { include:[{ model:Reply,  include: [User] }]
     }).then(tweet => {     
        const data = tweet.Replies.map(t => ({
          ...t.dataValues, 
          comment: t.comment
        }))
    
        return res.render('tweet',{ tweet: data})
      })
    .catch(error => console.log(error))
  },

  postReply: (req, res) => {
    if (req.body.comment.length > 140) {
      return res.redirect('back')
    }
    Reply.create({
      TweetId: req.params.id,
      comment: req.body.comment, 
      UserId: helpers.getUser(req).id
    })
    .then((reply) => {
      res.redirect('back')
    })
    .catch(error => console.log(error))
  },

  
  
  
}

module.exports = tweetController
