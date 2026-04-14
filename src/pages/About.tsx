import { Leaf, Heart, Database, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-2">
        <Leaf size={28} className="text-forest" />
        <h1 className="text-3xl text-forest-dark m-0">About Plants Data</h1>
      </div>
      <p className="text-forest/60 mb-10 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
        A community garden of knowledge
      </p>

      <div className="flex flex-col gap-6">
        <section className="bg-white/60 rounded-2xl border border-forest/10 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Database size={20} className="text-forest" />
            <h2 className="text-xl text-forest-dark m-0">What is this?</h2>
          </div>
          <p className="text-forest/80 leading-relaxed">
            Plants Data is an open-source collaborative database of plants and their relationships.
            We collect information about planting seasons, harvesting times, water needs, size, and
            whether plants grow better or worse near each other — a concept known as companion planting.
          </p>
        </section>

        <section className="bg-white/60 rounded-2xl border border-forest/10 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Users size={20} className="text-forest" />
            <h2 className="text-xl text-forest-dark m-0">Community driven</h2>
          </div>
          <p className="text-forest/80 leading-relaxed">
            Every gardener, botanist, and plant lover can contribute. Register an account to add plants
            and relationships to the database, and track your contributions in your personal activity page.
            Together we're building the most comprehensive open plant database.
          </p>
        </section>

        <section className="bg-white/60 rounded-2xl border border-forest/10 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={20} className="text-terra" />
            <h2 className="text-xl text-forest-dark m-0">Companion planting</h2>
          </div>
          <p className="text-forest/80 leading-relaxed">
            Companion planting is the practice of growing different plants in proximity for mutual benefit —
            improving growth, deterring pests, or attracting pollinators. Antagonistic plants are those
            that inhibit each other's growth. Our database helps you discover these relationships.
          </p>
        </section>
      </div>
    </div>
  );
}
