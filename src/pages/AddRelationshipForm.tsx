import { useState } from 'react';
import { GitBranch } from 'lucide-react';
import PlantSearchInput from '../components/PlantSearchInput';
import { addRelation } from '../api/relations';
import type { Plant } from '../types';

export default function AddRelationshipForm() {
  const [isCompanion, setIsCompanion] = useState(true);
  const [plantA, setPlantA] = useState<Plant | null>(null);
  const [plantB, setPlantB] = useState<Plant | null>(null);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!plantA || !plantB) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await addRelation({
        plant_a_id: plantA.id,
        plant_b_id: plantB.id,
        is_companion: isCompanion,
        explanation,
      });
      setSuccess(`Relationship between "${plantA.name}" and "${plantB.name}" added!`);
      setPlantA(null);
      setPlantB(null);
      setExplanation('');
      setIsCompanion(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add relationship');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <GitBranch size={28} className="text-forest" />
        <h1 className="text-3xl text-forest-dark m-0">Add a Relationship</h1>
      </div>

      {success && (
        <div className="mb-6 rounded-xl bg-forest/10 border border-forest/20 px-4 py-3 text-forest font-medium">{success}</div>
      )}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/60 rounded-2xl border border-forest/10 shadow-sm p-6 flex flex-col gap-5">
        {/* Relationship type */}
        <div>
          <p className="text-sm font-medium text-forest-dark mb-2">Relationship type</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsCompanion(true)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${isCompanion ? 'bg-forest text-cream border-forest' : 'bg-transparent text-forest border-forest/30 hover:bg-forest/10'}`}
            >
              Companion
            </button>
            <button
              type="button"
              onClick={() => setIsCompanion(false)}
              className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-colors ${!isCompanion ? 'bg-terra text-cream border-terra' : 'bg-transparent text-terra border-terra/30 hover:bg-terra/10'}`}
            >
              Antagonistic
            </button>
          </div>
          <p className="mt-2 text-xs text-forest/60">
            {isCompanion
              ? 'Companion plants grow better near each other.'
              : 'Antagonistic plants grow worse near each other.'}
          </p>
        </div>

        {/* Plant A */}
        <div>
          <label className="block text-sm font-medium text-forest-dark mb-1" htmlFor="plant-a">Plant A *</label>
          <PlantSearchInput
            id="plant-a"
            value={plantA?.id ?? null}
            onChange={p => { setPlantA(p); if (plantB?.id === p?.id) setPlantB(null); }}
            exclude={plantB?.id ?? null}
            placeholder="Search for first plant..."
          />
        </div>

        {/* Plant B */}
        <div>
          <label className="block text-sm font-medium text-forest-dark mb-1" htmlFor="plant-b">Plant B *</label>
          <PlantSearchInput
            id="plant-b"
            value={plantB?.id ?? null}
            onChange={setPlantB}
            exclude={plantA?.id ?? null}
            placeholder="Search for second plant..."
          />
        </div>

        {/* Explanation */}
        <div>
          <label className="block text-sm font-medium text-forest-dark mb-1" htmlFor="explanation">Explanation</label>
          <textarea
            id="explanation"
            value={explanation}
            onChange={e => setExplanation(e.target.value)}
            rows={3}
            placeholder="Explain why these plants are related..."
            className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/50 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !plantA || !plantB}
          className="w-full rounded-xl bg-forest py-3 text-cream font-semibold text-base hover:bg-forest-dark transition-colors disabled:opacity-50 mt-1"
        >
          {loading ? 'Adding...' : 'Add Relationship'}
        </button>
      </form>
    </div>
  );
}
