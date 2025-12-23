import { useState } from "react";
import { MapPin, GraduationCap, Calendar, BookOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { Timeline } from "@/components/Timeline";
import { SkillTagGroup } from "@/components/SkillTagGroup";
import { Footer } from "@/components/Footer";
import { SnowEffect } from "@/components/SnowEffect";
import { YouTubeBackgroundMusic } from "@/components/YouTubeBackgroundMusic";
import { IntroSplash } from "@/components/IntroSplash";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import { skills } from "@/data/skills";
import alanImage from "@/assets/alan.png";

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const quickFacts = [
    { icon: MapPin, label: profile.quickFacts.location },
    { icon: BookOpen, label: profile.quickFacts.university },
    { icon: GraduationCap, label: profile.quickFacts.degree },
    { icon: Calendar, label: profile.quickFacts.graduation },
  ];

  return (
    <>
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      <YouTubeBackgroundMusic />
      <div className={`min-h-screen bg-background transition-opacity duration-700 ${showIntro ? "opacity-0" : "opacity-100"}`}>
        <SnowEffect />
        
        <Navbar />
      
      <main className="pt-24 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Hero / Summary Section */}
          <section id="summary" className="scroll-mt-24 mb-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-primary/20">
                <AvatarImage src={alanImage} alt={profile.name} />
                <AvatarFallback className="text-2xl">AL</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground mb-4">{profile.citizenship}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                  {quickFacts.map((fact, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="gap-1.5 text-xs"
                    >
                      <fact.icon className="h-3 w-3" />
                      {fact.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
              {profile.summary}
            </p>
          </section>

          {/* Projects Section */}
          <section id="projects" className="scroll-mt-24 mb-16">
            <SectionHeading title="Projects" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} />
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="scroll-mt-24 mb-16">
            <SectionHeading title="Experience" />
            <Timeline experiences={experience} />
          </section>

          {/* Skills Section */}
          <section id="skills" className="scroll-mt-24 mb-16">
            <SectionHeading title="Skills" />
            <SkillTagGroup categories={skills} />
          </section>

        </div>
      </main>

      <Footer />
    </div>
    </>
  );
};

export default Index;
