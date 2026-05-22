import { useState } from 'react';
import { GitBranch, Heart, Swords } from 'lucide-react';
import PlantSearchInput from '../components/PlantSearchInput';
import { addRelation } from '../api/relations';
import { usePopup } from '../context/PopupContext';
import Spinner from '../components/Spinner';
import FadeIn from '../components/FadeIn';
import type { Plant } from '../types';

export default function AddRelationshipForm() {
  const [isCompanion, setIsCompanion] = useState(true);
  const [plantA, setPlantA] = useState<Plant | null>(null);
  const [plantB, setPlantB] = useState<Plant | null>(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showPopup } = usePopup();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plantA || !plantB) return;
    setError('');
    setLoading(true);
    try {
      const aName = plantA.name;
      const bName = plantB.name;
      await addRelation({
        plant_a_id: plantA.id,
        plant_b_id: plantB.id,
        is_companion: isCompanion,
        explanation,
      });
      setPlantA(null);
      setPlantB(null);
      setExplanation('');
      setIsCompanion(true);
      showPopup({
        title: 'Relationship saved',
        message: `"${aName}" + "${bName}" is pending approval.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add relationship');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-forest/50 mb-2">Contribute</p>
          <h1 className="serif text-4xl text-forest-dark m-0 tracking-tight">
            <GitBranch className="inline-block mr-2 -mt-2 text-forest" size={30} />
            Add a relationship
          </h1>
          <p className="text-sm text-forest/60 mt-2 max-w-xl leading-relaxed">
            Two plants that grow well together — or get in each other's way. An admin will review.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-terra/10 border border-terra/30 px-5 py-4 text-terra animate-fade-in-up">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="card-soft rounded-3xl p-6 sm:p-8 flex flex-col gap-5 animate-fade-in-up delay-75"
        >
          {/* Relationship type */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5">Relationship type</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCompanion(true)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold border transition-all ${
                  isCompanion
                    ? 'bg-forest text-cream border-forest shadow-sm shadow-forest/20'
                    : 'bg-white/60 text-forest border-forest/25 hover:bg-forest/5'
                }`}
              >
                <Heart size={14} />
                Companion
              </button>
              <button
                type="button"
                onClick={() => setIsCompanion(false)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold border transition-all ${
                  !isCompanion
                    ? 'bg-terra text-cream border-terra shadow-sm shadow-terra/20'
                    : 'bg-white/60 text-terra border-terra/30 hover:bg-terra/5'
                }`}
              >
                <Swords size={14} />
                Antagonistic
              </button>
            </div>
            <p className="mt-2 text-xs text-forest/55 italic">
              {isCompanion
                ? 'Companion plants grow better near each other.'
                : 'Antagonistic plants grow worse near each other.'}
            </p>
          </div>

          {/* Plant A */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="plant-a">Plant A *</label>
            <PlantSearchInput
              id="plant-a"
              value={plantA?.id ?? null}
              onChange={p => { setPlantA(p); if (plantB?.id === p?.id) setPlantB(null); }}
              exclude={plantB?.id ?? null}
              placeholder="Search for first plant…"
            />
          </div>

          {/* Plant B */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="plant-b">Plant B *</label>
            <PlantSearchInput
              id="plant-b"
              value={plantB?.id ?? null}
              onChange={setPlantB}
              exclude={plantA?.id ?? null}
              placeholder="Search for second plant…"
            />
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-forest/60 mb-1.5" htmlFor="explanation">
              Explanation <span className="ml-1 normal-case font-normal text-forest/40">(optional)</span>
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={e => setExplanation(e.target.value)}
              rows={3}
              placeholder="Explain why these plants are related…"
              className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2.5 text-sm text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !plantA || !plantB}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-forest to-forest-dark py-3 text-cream font-semibold text-base tracking-wide hover:from-forest-dark hover:to-forest-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-forest/25 hover:shadow-lg hover:shadow-forest/35 mt-1"
          >
            {loading && <Spinner size={16} className="border-cream/30 border-t-cream" />}
            {loading ? 'Adding…' : 'Add relationship'}
          </button>
        </form>
      </div>
    </FadeIn>
  );
}
