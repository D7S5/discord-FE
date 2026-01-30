import React from "react";
import VoiceUserItem from "./VoiceUserItem";
import "../../styles/VoiceUserList.css";

// export default function VoiceUserList({ users }) {
//   return (
//     <div className="voice-user-list">
//       {users.map(user => (
//         <VoiceUserItem key={user.userId} user={user} />
//       ))}
//     </div>
//   );
// }

export default function VoiceUserList({ users }) {
  return (
    <div className="voice-user-list">
      {users.map(user => (
        <div key={user.id} className="voice-user">
          <div className="voice-user-avatar">
            {user.username[0]}
          </div>
          <div className="voice-user-name">
            {user.username}
          </div>
        </div>
      ))}
    </div>
  );
}

