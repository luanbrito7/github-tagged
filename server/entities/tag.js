import Tag from '../schemas/tag.js'

export function getTagsFactory() {
    return async function getTags(githubId) {
        let tags = []
        await Tag.find({ 'ownerId' : githubId }, function (err, docs) {
            if (err) {
                console.log(err)
                return null
            }
            tags = docs
        })
        return tags
    }
}

export function createTagFactory() {
    return function createTag({
        githubId, 
        name
    }) {
        const newTag = new Tag({
            name: name,
            ownerId: githubId,
            repos: []
        });
        newTag.save(function (err) {
            if (err) return null
            return err
        })
        return newTag
    }
}

export function updateTagFactory() {
    return async function updateTag({
        id = "",
        name = "",
        repositories = [],
        ownerId = ""
    }) {
        if (name.length > 0) {
            await Tag.update(
                {_id: id, ownerId: ownerId},
                {$set: {name: name, repos: repositories}},
                (error, doc) => {
                    if (error) console.log(error)
                    console.log(doc)
                    return doc
                }
            )
        }
    }
}

export function deleteTagFactory() {
    return async function deleteTag({
        id = "",
        ownerId = ""
    }) {
        await Tag.deleteOne(
            {_id: id, ownerId: ownerId},
            (err) => console.log(err)
        )
    }
}