import { useState } from 'react';
import { Sprout } from 'lucide-react';
import { addPlant } from '../api/plants';
import { usePlants } from '../context/PlantsContext';
import { usePopup } from '../context/PopupContext';
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
  const [error, setError] = useState('');
  const { refresh } = usePlants();
  const { showPopup } = usePopup();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const name = form.name;
      await addPlant(form);
      setForm(defaultForm);
      refresh();
      showPopup({
        title: 'Plant added',
        message: `"${name}" is pending approval. See it on My Activity.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add plant');
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
            <Sprout className="inline-block mr-2 -mt-2 text-forest" size={30} />
            Add a plant
          </h1>
          <p className="text-sm text-forest/60 mt-2 max-w-xl leading-relaxed">
            Submit a new plant to the catalog. An admin will review it before it goes public.
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
          <PlantFormFields value={form} onChange={setForm} />
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-forest to-forest-dark py-3 text-cream font-semibold text-base tracking-wide hover:from-forest-dark hover:to-forest-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-forest/25 hover:shadow-lg hover:shadow-forest/35 mt-1"
          >
            {loading && <Spinner size={16} className="border-cream/30 border-t-cream" />}
            {loading ? 'Adding…' : 'Add plant'}
          </button>
        </form>
      </div>
    </FadeIn>
  );
}
