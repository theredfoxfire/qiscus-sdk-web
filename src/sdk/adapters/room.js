import find from 'lodash/fp/find'
import reverse from 'lodash/fp/reverse'

export default class RoomAdapter {
  /**
  * Params used in this class
  * @method constructor
  * @param  {Object}    HTTPAdapter [Qiscus HTTP adapter]
  * @return {void}                Returns nothing
  */
  constructor (HTTPAdapter) {
    this.HTTPAdapter = HTTPAdapter
    this.token = HTTPAdapter.token
  }

  getOrCreateRoom (email, options, distinctId) {
    let params = { token: this.token, emails: email }
    if (distinctId) params[distinctId] = distinctId
    if (options) params['options'] = JSON.stringify(options)

    return this.HTTPAdapter.post(`api/v2/sdk/get_or_create_room_with_target`, params)
    .then((res) => {
      if (res.body.status !== 200) return new Promise((resolve, reject) => reject(res))
      const room = res.body.results.room
      room.comments = reverse(res.body.results.comments)
      const rivalUser = find(p => p.email === email)(room.participants)
      room.name = rivalUser ? rivalUser.username : 'Room name'
      debugger
      return Promise.resolve(room)
    })
  }

}
