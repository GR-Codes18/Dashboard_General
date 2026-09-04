interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__titles">
        <h1 className="header__title">Dashboard General</h1>
        <p className="header__subtitle">Registro de proyectos y cursos</p>
      </div>

      <input
        type="text"
        className="header__search"
        placeholder="Buscar proyecto..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Buscar proyecto"
      />
    </header>
  );
}