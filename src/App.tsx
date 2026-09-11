import { useMemo, useState } from "react";
import AuthScreen from "./components/AuthScreen";
import Header from "./components/Header";
import NewProjectButton from "./components/NewProjectButton";
import ProjectGrid from "./components/ProjectGrid";
import NewProjectModal from "./components/NewProjectModal";
import WorkerManagement from "./components/WorkerManagement";
import { initialProjects } from "./data/projects";
import { isAuthSession, type AuthSession } from "./types/auth";
import type { Project } from "./types/project";

const SESSION_STORAGE_KEY = "dashboard_user";

function getCurrentSession(): AuthSession | null {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    const session = storedSession ? JSON.parse(storedSession) as unknown : null;
    if (!isAuthSession(session)) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentSession, setCurrentSession] = useState<AuthSession | null>(getCurrentSession);
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

  function handleAuthenticated(session: AuthSession) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    setCurrentSession(session);
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentSession(null);
  }

  if (!currentSession || !isAuthSession(currentSession)) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="container">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        userName={currentSession.user.name}
        userRole={currentSession.user.role}
        onLogout={handleLogout}
      />

      <NewProjectButton
        projectCount={filteredProjects.length}
        onClick={() => setIsModalOpen(true)}
      />

      <div className="team-actions">
        <WorkerManagement session={currentSession} />
      </div>

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