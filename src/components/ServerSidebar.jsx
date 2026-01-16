import { useState } from "react";
import CreateServerModal from "./CreateServerModal";
import "../styles/ServerSidebar.css";

export default function ServerSidebar({ servers }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="server-sidebar">
        <div className="server-icon add" onClick={() => setOpen(true)}>
          +
        </div>

        {servers.map((server) => (
          <div key={server.id} className="server-icon">
            {server.name.charAt(0)}
          </div>
        ))}
      </div>

      {open && <CreateServerModal onClose={() => setOpen(false)} />}
    </>
  );
}
