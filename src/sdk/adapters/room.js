import _ from 'lodash'
export default class RoomAdapter {
  /**
  * Params used in this class
  * @method constructor
  * @param  {Object}    HTTPAdapter [Qiscus HTTP adapter]
  * @return {void}                Returns nothing
  */
  constructor (HTTPAdapter) {
    this.HTTPAdapter = HTTPAdapter;
    this.token       = HTTPAdapter.token;
  }

  getOrCreateRoom(email) {
    return this.HTTPAdapter.post(`api/v2/mobile/get_or_create_room_with_target`, {
      token: this.token,
      "emails[]": email
    })
    .then((res) => {
      if(res.body.status != 200) return new Promise((resolve, reject) => reject(res));
      let data      = res.body.results.room;
      data.comments = _.reverse(res.body.results.comments);
      data.name     = email;
      return Promise.resolve(data);
    })
  }

}
