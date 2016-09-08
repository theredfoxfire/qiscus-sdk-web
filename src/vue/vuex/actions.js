export const changeRoom = ({dispatch, state}, room) => dispatch('CHANGE_ROOM', room);
export const toggleChatWindow = ({dispatch, state}) => dispatch('TOGGLE_CHAT_WINDOW');
export const chatTarget = ({dispatch}, email) => dispatch('CHAT_TARGET', email);
export const backToHome = ({dispatch}) => dispatch('BACK_TO_HOME');
export const submitComment = ({dispatch}, topic_id, comment) => dispatch('SUBMIT_COMMENT', topic_id, comment);
export const loadComments = ({dispatch}, topic_id, last_comment_id, timestamp, after) => dispatch('LOAD_COMMENTS', topic_id, last_comment_id, timestamp, after);
