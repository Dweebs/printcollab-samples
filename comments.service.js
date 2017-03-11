module.exports = commentsService

function commentsService(options) {
    let Comment

    if (!options.modelService) {
        throw new Error('Options.modelService is required')
    }

    Comment = options.modelService

    return {

        getCommentByBlogId,
        getAll,
        getOne,
        insert,
        updateOne,
        removeOne,
        insertReply

    }

    function getCommentByBlogId(blogId) {
        console.log(blogId)
        return Comment.find({
            blog_id: blogId,
            parentCommentId: {$exists: false}
        })
        .populate('replies')
    }

    function getAll() {
        return Comment.find({
            parentCommentId: {$exists: false}
        })
            .populate('replies')
    }

    function getOne(queryCondition) {
        return Comment.findOne(queryCondition)
            .populate('replies')
    }

    function insert(document) {
        let newComment = new Comment(document)
        return newComment.save()
    }

    function insertReply(document) {
        Comment.findOne({
            _id: document.parentCommentId
        })
            .then(function(parentCommentDoc) {
                if (parentCommentDoc) {
                    parentCommentDoc.replies.push(document._id)
                    parentCommentDoc.save()
                }
            })
    }

    function updateOne(queryCondition, doc) {
        return Comment.findOneAndUpdate(queryCondition, doc, {
            new: true
        })
    }

    function removeOne(queryCondition) {
        return Comment.findOneAndRemove(queryCondition)
    }
}
