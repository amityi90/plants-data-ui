import { useState } from 'react';
import { Sprout } from 'lucide-react';
import { addPlant } from '../api/plants';
import { usePlants } from '../context/PlantsContext';
import PlantFormFields from '../components/PlantFormFields';
import Spinner from '../components/Spinner';
import FadeIn from '../components/FadeIn';
import type { NewPlant } from '../types';

const defaultForm: NewPlant = {
  name: '',
  planting_start: 3,
  planting_end: 5,
  harvesting_start: 6,
  harvesting_end: 9,
  water: 250,
  shadow: false,
  height: 50,
  spread: 30,
  body_water: false,
  is_tree: false,
  image_url: null,
};

export default function AddPlantForm() {
  const [form, setForm] = useState<NewPlant>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { refresh } = usePlants();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await addPlant(form);
      setSuccess(
        `"${form.name}" was submitted for review. You'll see it on My Activity until it's approved.`
      );
      setForm(defaultForm);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant');
    } finally {
      setLoading(false);
    }
  }

  return (
    <FadeIn>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Sprout size={28} className="text-forest" />
          <h1 className="text-3xl text-forest-dark m-0">Add a Plant</h1>
        </div>

        {success && (
          <div className="mb-6 rounded-xl bg-forest/10 border border-forest/20 px-4 py-3 text-forest font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white/60 rounded-2xl border border-forest/10 shadow-sm p-6 flex flex-col gap-5"
        >
          <PlantFormFields value={form} onChange={setForm} />
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-forest py-3 text-cream font-semibold text-base hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {loading && <Spinner size={16} className="border-cream/30 border-t-cream" />}
            {loading ? 'Adding...' : 'Add Plant'}
          </button>
        </form>
      </div>
    </FadeIn>
  );
}
