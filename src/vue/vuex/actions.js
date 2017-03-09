import find from 'lodash/fp/find'

export default {
  changeRoom: ({commit, state}, room) => commit('CHANGE_ROOM', room),
  toggleChatWindow: ({commit, state}) => commit('TOGGLE_CHAT_WINDOW'),
  chatTarget: ({commit}, {email, options = {}}) => {
    qiscus.chatTarget(email, options)
    .then((response) => {
      commit('CHAT_TARGET', {email, options})
      const selected = qiscus.selected.comments
      const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0
      setTimeout(function(){
        if(latestCommentId > 0){
          const elementToScroll = document.getElementById(latestCommentId)
          elementToScroll.scrollIntoView({block: 'end', behavior: 'smooth'})
        }
        //on entering the room, wait for data processed then focus on comment form
        document.getElementsByClassName('qcw-comment-form').item(0).getElementsByTagName('textarea').item(0).focus();
      }, 0)
    })
  },
  chatGroup: ({commit}, {id, oldSelected}) => {
    commit('CHAT_GROUP', {id, oldSelected})
    const selected = qiscus.selected.comments
    const latestCommentId = (selected.length > 0) ? selected[selected.length-1].id : 0
    setTimeout(function(){
      if(latestCommentId > 0){
        const elementToScroll = document.getElementById(latestCommentId)
        elementToScroll.scrollIntoView({block: 'end', behavior: 'smooth'})
      }
      //on entering the room, wait for data processed then focus on comment form
      document.getElementsByClassName('qcw-comment-form').item(0).getElementsByTagName('textarea').item(0).focus();
    }, 0)
  },
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
    // find the comment that need to be altered
    const commentToFind = find(selectedComment => {
      return (
        payload.unique_temp_id
          ? selectedComment.unique_id === payload.unique_temp_id
          : selectedComment.id === payload.id
      )
    })(qiscus.selected.comments)
    if (commentToFind){
      commentToFind.markAsRead()
      commit('SET_READ', commentToFind)
    } 
  },
  toggleInit: ({commit}) => commit('TOGGLE_INIT'),
  updateSelected: ({commit}) => commit('UPDATE_SELECTED'),
  openImageModal: ({commit}, payload) => commit('OPEN_IMAGE_MODAL', payload),
  closeImageModal: ({commit}) => commit('CLOSE_IMAGE_MODAL')
}
// topic_id, last_comment_id, timestamp, after