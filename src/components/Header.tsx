interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  userName: string;
  onLogout: () => void;
}

export default function Header({ searchTerm, onSearchChange, userName, onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__titles">
        <h1 className="header__title">Dashboard General</h1>
        <p className="header__subtitle">Registro de proyectos y cursos</p>
      </div>

      <div className="header__tools">
        <input
          type="text"
          className="header__search"
          placeholder="Buscar proyecto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar proyecto"
        />
        <div className="header__account">
          <span className="header__user">Hola, {userName}</span>
          <button type="button" className="header__logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}