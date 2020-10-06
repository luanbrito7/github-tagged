import User from '../schemas/user.js'

export function getUserFactory() {
    return async function getUser(githubId) {
        let foundUser = undefined
        await User.findOne({ '_id': githubId }, function (err, user) {
            if (err) {
                console.log(err)
                return null
                // return err
            }
            foundUser = user
        })
        return foundUser
    }
}

export function createUserFactory() {
    return function createUser({githubId, login}) {
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