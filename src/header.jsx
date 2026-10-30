
import { Bell, Search, ChevronDown } from "lucide-react";
import { student } from "./data/studentData";

export default function Header({ activePage }) {
  return (
    <header className="topbar">
      <div>
        <h2>{activePage}</h2>
        <p>Home / {activePage}</p>
      </div>

      <div className="header-actions">
        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search portal..."
            aria-label="Search portal"
          />
        </label>

        <button
          className="icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div className="header-user">
          <div className="avatar">AS</div>
          <div className="user-info">
            <strong>{student.name}</strong>
            <span>{student.id}</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
