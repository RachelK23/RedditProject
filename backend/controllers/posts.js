const { Post } = require('../models')

//type in before running frontend: export NODE_OPTIONS=--openssl-legacy-provider

module.exports.index = (req, res, next) => {
  let recentDate = new Date(req.query.currDate)
  let oldDate = new Date (req.query.currDate)
  if (req.query.dateRange == 'Past week'){
    oldDate.setDate(recentDate.getDate() - 7)
    oldDate.setHours(0, 0, 0, 0)
        Post
        .find({ createdAt: { $lte: recentDate, $gte: oldDate}})
        .populate('comments')
        .sort('-createdAt')
        .then(posts => {
          res.locals.data = {posts}
          res.locals.status = 200
          return next()
        })
        .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
        })
      }
  else if (req.query.dateRange == 'Past month'){
    oldDate.setMonth(recentDate.getMonth()-1)
    oldDate.setHours(0, 0, 0, 0)
    Post.find({ createdAt: { $lte: recentDate, $gte: oldDate}})
    .populate('comments')
    .sort('-createdAt')
    .then(posts => {
      res.locals.data = {posts}
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      return next()
      })
    }
    else if (req.query.dateRange == 'Past year'){
      oldDate.setFullYear(recentDate.getFullYear()-1)
      oldDate.setHours(0, 0, 0, 0)
      Post.find({ createdAt: { $lte: recentDate, $gte: oldDate}})
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = {posts}
        res.locals.status = 200
        return next()
      })
      .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      return next()
      })
    }
    else if (req.query.dateRange == 'A year ago'){
      oldDate.setFullYear(recentDate.getFullYear()-1)
      Post.find({ createdAt: { $lte: oldDate}})
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = {posts}
        res.locals.status = 200
        return next()
      })
      .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      return next()
      })
    }
    else if (req.query.dateRange == 'Ancient times'){
      oldDate.setFullYear(recentDate.getFullYear()-10)
        Post.find({ createdAt: { $lte: oldDate }})
        .populate('comments')
        .sort('-createdAt')
        .then(posts => {
          res.locals.data = {posts}
          res.locals.status = 200
          return next()
        })
        .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
    })
    }else {
      Post.find()
      .populate('comments')
      .sort('-createdAt')
      .then(posts => {
        res.locals.data = { posts }
        res.locals.status = 200
        return next()
     })
      .catch(err => {
        console.error(err)
        res.locals.error = { error: err.message }
        return next()
     })
    }
  }

module.exports.test = (req, res, next) => {
  let userDate = new Date(req.query.date)
  let testPost = new Post({
    author: 'Anonymous',
    text: 'Hi',
    title: '??',
    createdAt: userDate.toISOString()
  })

  testPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 200
      return next()
    })
    .catch((err) => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.get = (req, res, next) => {
  Post.findById(req.params.id)
    .populate('comments')
    .then(post => {
      res.locals.data = { post }
      res.locals.status = post === null ? 404 : 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.errors = { error: err.message }
      return next()
    })
}

module.exports.store = (req, res, next) => {
  const newPost = new Post(req.body)
  newPost
    .save()
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.update = (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
    runValidators: true,
    new: true,
  })
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.delete = (req, res, next) => {
  Post.findByIdAndCascadeDelete({ _id: req.params.id })
    .then(_ => {
      res.locals.data = { deleted: 'Success' }
      res.locals.status = 200
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}

module.exports.comment = (req, res, next) => {
  Post.findByIdAndAddComment(req.params.id, req.body)
    .then(post => {
      res.locals.data = { post }
      res.locals.status = 201
      return next()
    })
    .catch(err => {
      console.error(err)
      res.locals.error = { error: err.message }
      res.locals.status = 400
      return next()
    })
}


