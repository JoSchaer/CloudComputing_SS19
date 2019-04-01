var Type = Object.freeze({ msg: 0, user: 1 })

var UserEvent = Object.freeze({ join: 0, dc: 1 })

var Msg = function (
  username,
  type,
  text,
  file = null,
  timestamp = new Date()
) { return { username, type, text, timestamp, file } }

module.exports = { Type, Msg, UserEvent }
