const responses = require('../models/responses')
const path = require('path')
const apiPrefix = '/api/comments'
const commentModel = require('../models/comment')
const commentsService = require('../services/comments.service')({
    modelService: commentModel
})

module.exports = commentsController

function commentsController() {
    return {
        ping,
        getCommentByBlogId,
        getAll,
        getOneById,
        insert,
        updateById,
        removeById
    }

    function ping(req, res) {
        commentsService.ping()
            .then((data) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = data
                res.json(responseModel)
            })
            .catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getCommentByBlogId(req, res) {
        commentsService.getCommentByBlogId(req.params.blogId)
            .then((comments) => {
                const responseModel = new responses.ItemResponse()
                responseModel.items = comments
                res.json(responseModel)
            })
            .catch((err) => {
                res.status(500).send(new responses.ItemResponse(err))
            })
    }

    function getAll(req, res) {
        commentsService.getAll()
            .then((comments) => {
                const responseModel = new responses.ItemsResponse()
                responseModel.items = comments
                res.json(responseModel)
            }).catch((err) => {
                res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function getOneById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }

        commentsService.getOne(queryCondition)
            .then((comment) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = comment
                res.json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function insert(req, res) {
        commentsService.insert(req.body)
            .then((comment) => {
                if (comment.parentCommentId) {
                    commentsService.insertReply(comment)
                }
                const responseModel = new responses.ItemResponse()
                responseModel.item = comment
                res.status(201)
                    .location(path.join(apiPrefix, comment._id.toString()))
                    .json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }

    function updateById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }
        commentsService.updateOne(queryCondition, req.body)
            .then((comment) => {
                const responseModel = new responses.ItemResponse()
                res.status(204)
                    .json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err.stack))
            })
    }

    function removeById(req, res) {
        let queryCondition = {
            _id: req.params.id
        }
        commentsService.removeOne(queryCondition)
            .then((comment) => {
                const responseModel = new responses.ItemResponse()
                responseModel.item = comment
                res.json(responseModel)
            })
            .catch((err) => {
                return res.status(500).send(new responses.ErrorResponse(err))
            })
    }
}
