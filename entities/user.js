import User from '../schemas/user.js'

export function getUserFactory() {
    return function getUser(githubId) {
        User.findOne({ 'githubId': githubId }, function (err, user) {
            if (err) {
                console.log(err)
                return null
                // return err
            }
            return user
        })
    }
}

export function createUserFactory() {
    return function createUser({githubId, login}) {
        const newUser = new User({
            githubId: githubId,
            login: login
        });
        newUser.save(function (err) {
            if (err) return null
            return newUser
        })
        return newUser
    }
}