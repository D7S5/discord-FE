import "./ServerLayout.css";
import ChannelSidebar from "./ChannelSidebar";
import ChatArea from "./ChatArea";
import MemberList from "./MemberList";

export default function ServerLayout({ members }) {
  return (
    <div className="server-layout">
      <ChannelSidebar />
      <ChatArea />
      <MemberList members={members} />
    </div>
  );
}
