export default {
  changeRoom: ({commit, state}, room) => commit('CHANGE_ROOM', room),
  toggleChatWindow: ({commit, state}) => commit('TOGGLE_CHAT_WINDOW'),
  chatTarget: ({commit}, email) => commit('CHAT_TARGET', email),
  backToHome: ({commit}) => commit('BACK_TO_HOME'),
  submitComment: ({commit}, {topic_id, comment}) => {
    return qiscus.submitComment(topic_id, comment)
    .then((response) => {
      commit('SUBMIT_COMMENT', qiscus.selected)
      return Promise.resolve(qiscus.selected);
    })
  },
  loadComments: ({commit}, payload) => commit('LOAD_COMMENTS', payload),
  sync: ({commit}) => commit('SYNC'),
  setTyping: ({commit}, payload) => commit('SET_TYPING', payload),
  setRead: ({commit}, payload) => {
    //find the comment that need to be altered
    var commentToFind = _.find(qiscus.selected.comments, function(commentSelected){
      return (payload.unique_temp_id) ? commentSelected.unique_id == payload.unique_temp_id : commentSelected.id == payload.id;
    })
    if(commentToFind) commentToFind.markAsRead();
    commit('SET_READ', commentToFind);
  },
  toggleInit: ({commit}) => commit('TOGGLE_INIT'),
  updateSelected: ({commit}) => commit('UPDATE_SELECTED'),
  openImageModal: ({commit}, payload) => commit('OPEN_IMAGE_MODAL', payload),
  closeImageModal: ({commit}) => commit('CLOSE_IMAGE_MODAL')
}
// topic_id, last_comment_id, timestamp, after