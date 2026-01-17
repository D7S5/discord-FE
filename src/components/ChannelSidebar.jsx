import "./ChannelSidebar.css";

export default function ChannelSidebar() {
  return (
    <aside className="channel-sidebar">
      <div className="server-header">
        <span className="server-name">My Server</span>
      </div>

      <div className="channel-group">
        <div className="channel-group-title">TEXT CHANNELS</div>

        <div className="channel-item active"># general</div>
        <div className="channel-item"># random</div>
      </div>
    </aside>
  );
}
