import { MsgPreview } from './MsgPreview.jsx'
export function MsgList({ msgs, users, onRemoveMsg, onUpdateMsg, showMsgId, setShowMsgId, loggedInUser }) {
   return (
      <ul className='msg-list grid'>
         {msgs.map((msg, idx) => (
            <li className={msg.isDone ? 'done' : ''} key={msg._id || idx}>
               <MsgPreview
                  msg={msg}
                  users={users}
                  onRemoveMsg={onRemoveMsg}
                  onUpdateMsg={onUpdateMsg}
                  showMsgId={showMsgId}
                  setShowMsgId={setShowMsgId}
                  loggedInUser={loggedInUser}
               />
            </li>
         ))}
      </ul>
   )
}
