import { useState, useMemo } from "react";
import Header from "./components/Header";
import NewProjectButton from "./components/NewProjectButton";
import ProjectGrid from "./components/ProjectGrid";
import NewProjectModal from "./components/NewProjectModal";
import { initialProjects } from "./data/projects";
import type { Project } from "./types/project";

export default function App() {
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

  return (
    <div className="container">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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