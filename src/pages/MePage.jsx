import { useState } from "react";
import DmList from "../components/DmList";
import FriendsView from "../components/FriendsView";
import DmChatView from "../components/DmChatView";
import AddFriendModal from "../components/AddFriendModal";
import ServerSidebar from "../components/ServerSidebar";
import "../styles/MePage.css";

export default function MePage() {
  const [view, setView] = useState("friends");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="me-layout">
        <ServerSidebar />
      {/* LEFT */}
      <aside className="sidebar">
        <div className="friends-header">
          <button onClick={() => setView("friends")}>Friends</button>
          <button className="add-friend" onClick={() => setOpenAdd(true)}>
            Add Friend
          </button>
        </div>

        <DmList
          onSelect={(roomId) => {
            setSelectedRoom(roomId);
            setView("dm");
          }}
        />
      </aside>

      {/* MAIN */}
      <main className="content">
        {view === "friends" && <FriendsView />}
        {view === "dm" && <DmChatView roomId={selectedRoom} />}
      </main>

      {openAdd && (
        <AddFriendModal onClose={() => setOpenAdd(false)} />
      )}
    </div>
  );
}
