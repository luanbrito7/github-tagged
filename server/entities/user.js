import User from '../schemas/user.js'

export default function UserFactory() {
    return {
        'getUser': async (githubId) => {
            let foundUser = undefined
            await User.findOne({ '_id': githubId }, function (err, user) {
                if (err) {
                    console.log(err)
                    return null
                }
                foundUser = user
            })
            return foundUser
        },
        'createUser': async ({githubId, login}) => {
            const newUser = new User({
                _id: githubId,
                login: login
            });
            newUser.save(function (err) {
                if (err) return null
                return newUser
            })
            return newUser
        }
    }
}