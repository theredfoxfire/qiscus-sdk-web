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

  getOrCreateRoom(email, options, distinct_id) {
    let params = { token: this.token, emails: email };
    if(distinct_id) params[distinct_id] = distinct_id;
    if(options) params['options'] = JSON.stringify(options);

    return this.HTTPAdapter.post(`api/v2/sdk/get_or_create_room_with_target`, params)
    .then((res) => {
      if(res.body.status != 200) return new Promise((resolve, reject) => reject(res));
      let data      = res.body.results.room;
      data.comments = _.reverse(res.body.results.comments);
      data.name     = data.participants.filter((p) => p.email == email)[0].username;
      return Promise.resolve(data);
    })
  }

}
