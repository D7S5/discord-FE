import { useNavigate, useParams } from "react-router-dom";

export default function ChannelSidebar({ channels = [] }) {
  const navigate = useNavigate();
  const { serverId } = useParams();

  return (
    <aside className="channel-sidebar">
      {channels.map((c) => (
        <div
          key={c.id}
          className="channel-item"
          onClick={() =>
            navigate(`/channels/${serverId}/${c.id}`)
          }
        >
          # {c.name}
        </div>
      ))}
    </aside>
  );
}
