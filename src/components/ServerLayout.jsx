import "./ServerLayout.css";
import ChannelSidebar from "./ChannelSidebar";
import ChatArea from "./ChatArea";
import MemberList from "./MemberList";

export default function ServerLayout({ channels, members }) {
  return (
    <div className="server-layout">
      <ChannelSidebar channels={channels}/>
      <ChatArea />
      <MemberList members={members} />
    </div>
  );
}
