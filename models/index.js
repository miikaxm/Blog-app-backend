const Blog = require('./blog')
const ReadList = require('./readList')
const User = require('./user')

Blog.belongsTo(User)
User.hasMany(Blog)

User.belongsToMany(Blog, { through: ReadList, as: 'reading_list' })
Blog.belongsToMany(User, { through: ReadList, as: 'users_marked' })

module.exports = {
    Blog, User, ReadList
}