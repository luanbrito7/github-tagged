import Tag from '../schemas/tag.js'

export default function TagFactory() {
    return {
        'getTags': async (githubId) => {
            let tags = []
            await Tag.find({ 'ownerId' : githubId }, function (err, docs) {
                if (err) {
                    console.log(err)
                    return null
                }
                tags = docs
            })
            return tags
        },
        'createTag': async ({githubId, name}) => {
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
        },
        'updateTag': async ({
            id = "",
            name = "",
            repositories = [],
            ownerId = ""
        }) => {
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
        },
        'deleteTag': async ({
            id = "",
            ownerId = ""
        }) => {
            await Tag.deleteOne(
                {_id: id, ownerId: ownerId},
                (err) => console.log(err)
            )
        }
    }
}