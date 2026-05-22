import { Leaf, Heart, Database, Users } from 'lucide-react';
import FadeIn from '../components/FadeIn';

export default function About() {
  return (
    <FadeIn>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-10 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-forest/50 mb-2">About</p>
          <h1 className="serif text-4xl text-forest-dark m-0 mb-3 tracking-tight">
            <Leaf className="inline-block mr-2 -mt-2 text-forest" size={30} />
            companion plants data
          </h1>
          <p className="text-base text-forest/65 max-w-xl leading-relaxed">
            A community-built database of plants, their growing seasons, and the ways they help —
            or hurt — each other in the garden.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <Section
            icon={<Database size={20} className="text-forest" />}
            title="What is this?"
            delay=""
          >
            Companion Plants Data is an open-source collaborative database of plants and their relationships.
            We collect information about planting seasons, harvesting times, water needs, size, and
            whether plants grow better or worse near each other — a concept known as companion planting.
          </Section>

          <Section
            icon={<Users size={20} className="text-forest" />}
            title="Community driven"
            delay="delay-75"
          >
            Every gardener, botanist, and plant lover can contribute. Register an account to add plants
            and relationships to the database, and track your contributions in your personal activity page.
            Together we're building the most comprehensive open plant database.
          </Section>

          <Section
            icon={<Heart size={20} className="text-terra" />}
            title="Companion planting"
            delay="delay-150"
          >
            Companion planting is the practice of growing different plants in proximity for mutual benefit —
            improving growth, deterring pests, or attracting pollinators. Antagonistic plants are those
            that inhibit each other's growth. Our database helps you discover these relationships.
          </Section>
        </div>
      </div>
    </FadeIn>
  );
}

function Section({ icon, title, children, delay }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: string;
}) {
  return (
    <section className={`card-soft rounded-2xl p-6 animate-fade-in-up ${delay}`}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-forest/8 ring-1 ring-forest/15">
          {icon}
        </span>
        <h2 className="serif text-xl text-forest-dark m-0 tracking-tight">{title}</h2>
      </div>
      <p className="text-forest/75 leading-relaxed m-0">{children}</p>
    </section>
  );
}
