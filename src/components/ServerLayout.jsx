import "./ServerLayout.css";
import ChannelSidebar from "./ChannelSidebar";
import ChatArea from "./ChatArea";
import MemberList from "./MemberList";

export default function ServerLayout({ members }) {
  return (
    <div className="server-layout">
      {/* 서버 리스트는 이미 따로 있음 */}
      <ChannelSidebar />
      <ChatArea />
      <MemberList members={members} />
    </div>
  );
}
