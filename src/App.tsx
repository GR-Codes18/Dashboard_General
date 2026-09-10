import { useState, useMemo } from "react";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import NewProjectButton from "./components/NewProjectButton";
import ProjectGrid from "./components/ProjectGrid";
import NewProjectModal from "./components/NewProjectModal";
import { initialProjects } from "./data/projects";
import type { Project } from "./types/project";

const SESSION_STORAGE_KEY = "dashboard_user";

interface AuthenticatedUser {
  name: string;
  email: string;
  password: string;
}

function getCurrentUser(): AuthenticatedUser | null {
  try {
    const user = localStorage.getItem(SESSION_STORAGE_KEY);
    return user ? (JSON.parse(user) as AuthenticatedUser) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(getCurrentUser);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return projects;

    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.code.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  function handleCreateProject(newProject: Project) {
    setProjects((prev) => [newProject, ...prev]);
  }

  function handleAuthenticated(user: AuthenticatedUser) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    setCurrentUser(user);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentUser(null);
  }

  if (!currentUser) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="container">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        userName={currentUser.name}
        onLogout={handleLogout}
      />

      <NewProjectButton
        projectCount={filteredProjects.length}
        onClick={() => setIsModalOpen(true)}
      />

      <ProjectGrid projects={filteredProjects} />

      {isModalOpen && (
        <NewProjectModal
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}