import { useState } from "react";
import DmList from "../components/DmList";
import FriendsViews from "../components/FriendViews";
import DmChatView from "../components/DmChatView";
import AddFriendModal from "../components/AddFriendModal";
import ServerSidebar from "../components/ServerSidebar";
import "../styles/MePage.css";

export default function MePage() {
  const [view, setView] = useState("friends"); // friends | dm
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="me-layout">
      {/* 서버 사이드바 */}
      <ServerSidebar />

      {/* LEFT */}
      <aside className="sidebar">
        <div className="friends-header">
          <button onClick={() => setView("friends")}>
            Friends
          </button>

          <button
            className="add-friend"
            onClick={() => setOpenAdd(true)}
          >
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
        {view === "friends" && (
          <FriendsViews
            onOpenDm={(roomId) => {
              setSelectedRoom(roomId);
              setView("dm");
            }}
          />
        )}

        {view === "dm" && selectedRoom && (
          <DmChatView roomId={selectedRoom} />
        )}
      </main>

      {openAdd && (
        <AddFriendModal onClose={() => setOpenAdd(false)} />
      )}
    </div>
  );
}
