import { useEffect, useState } from 'react';
import {
  Activity,
  Leaf,
  GitBranch,
  Pencil,
  Trash2,
  Sprout,
  Heart,
  Swords,
  Check,
  X,
  Clock,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getUserPlants,
  updatePlant,
  deletePlant,
} from '../api/plants';
import {
  getUserRelationships,
  updateRelation,
  deleteRelation,
} from '../api/relations';
import { usePlants } from '../context/PlantsContext';
import { monthLabel } from '../components/MonthSelect';
import PlantFormFields from '../components/PlantFormFields';
import StatTile from '../components/StatTile';
import ConfirmDialog from '../components/ConfirmDialog';
import { CenteredSpinner } from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import FadeIn from '../components/FadeIn';
import type { Plant, Relation, NewPlant } from '../types';

function PendingChip() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-terra/10 text-terra ring-1 ring-terra/20">
      <Clock size={10} />
      Pending review
    </span>
  );
}

function plantToForm(p: Plant): NewPlant {
  return {
    name: p.name,
    planting_start: p.planting_start ?? 1,
    planting_end: p.planting_end ?? 12,
    harvesting_start: p.harvesting_start ?? 1,
    harvesting_end: p.harvesting_end ?? 12,
    water: p.water ?? 0,
    shadow: !!p.shadow,
    height: p.height ?? 0,
    spread: p.spread ?? 0,
    body_water: !!p.body_water,
    is_tree: !!p.is_tree,
    image_url: p.image_url,
  };
}

export default function MyActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { plants: allPlants, refresh } = usePlants();
  const [myPlants, setMyPlants] = useState<Plant[]>([]);
  const [myRelations, setMyRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingPlantId, setEditingPlantId] = useState<number | null>(null);
  const [editPlantForm, setEditPlantForm] = useState<NewPlant | null>(null);
  const [editingRelationId, setEditingRelationId] = useState<number | null>(null);
  const [editRelationDraft, setEditRelationDraft] = useState<{
    is_companion: boolean;
    explanation: string;
  } | null>(null);

  const [confirmDeletePlant, setConfirmDeletePlant] = useState<Plant | null>(null);
  const [confirmDeleteRelation, setConfirmDeleteRelation] = useState<Relation | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    async function load() {
      const [plantsRes, relationsRes] = await Promise.allSettled([
        getUserPlants(),
        getUserRelationships(),
      ]);
      if (plantsRes.status === 'fulfilled') setMyPlants(plantsRes.value);
      if (relationsRes.status === 'fulfilled') setMyRelations(relationsRes.value);
      if (plantsRes.status === 'rejected' && relationsRes.status === 'rejected') {
        const reason = plantsRes.reason;
        const msg = reason instanceof Error ? reason.message : String(reason);
        if (!/failed to fetch|networkerror/i.test(msg)) {
          setError(msg);
        }
      }
      setLoading(false);
    }
    load();
  }, [user, navigate]);

  if (!user) return null;

  function plantName(id: number) {
    return allPlants.find((p) => p.id === id)?.name ?? `#${id}`;
  }

  function startEditPlant(p: Plant) {
    setEditingPlantId(p.id);
    setEditPlantForm(plantToForm(p));
  }

  function cancelEditPlant() {
    setEditingPlantId(null);
    setEditPlantForm(null);
  }

  async function saveEditPlant() {
    if (editingPlantId == null || !editPlantForm) return;
    try {
      const updated = await updatePlant(editingPlantId, editPlantForm);
      setMyPlants((arr) =>
        arr.map((p) => (p.id === editingPlantId ? updated : p)),
      );
      refresh();
      cancelEditPlant();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update plant');
    }
  }

  async function doDeletePlant() {
    if (!confirmDeletePlant) return;
    try {
      await deletePlant(confirmDeletePlant.id);
      setMyPlants((arr) => arr.filter((p) => p.id !== confirmDeletePlant.id));
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete plant');
    } finally {
      setConfirmDeletePlant(null);
    }
  }

  function startEditRelation(r: Relation) {
    setEditingRelationId(r.id);
    setEditRelationDraft({
      is_companion: r.is_companion,
      explanation: r.explanation ?? '',
    });
  }

  function cancelEditRelation() {
    setEditingRelationId(null);
    setEditRelationDraft(null);
  }

  async function saveEditRelation() {
    if (editingRelationId == null || !editRelationDraft) return;
    try {
      const updated = await updateRelation(editingRelationId, {
        is_companion: editRelationDraft.is_companion,
        explanation: editRelationDraft.explanation,
      });
      setMyRelations((arr) =>
        arr.map((r) => (r.id === editingRelationId ? { ...r, ...updated } : r)),
      );
      cancelEditRelation();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update relation');
    }
  }

  async function doDeleteRelation() {
    if (!confirmDeleteRelation) return;
    try {
      await deleteRelation(confirmDeleteRelation.id);
      setMyRelations((arr) =>
        arr.filter((r) => r.id !== confirmDeleteRelation.id),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete relation');
    } finally {
      setConfirmDeleteRelation(null);
    }
  }

  return (
    <FadeIn>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-8 animate-fade-in-up">
          <p className="text-xs uppercase tracking-[0.25em] text-forest/50 mb-2">You</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="serif text-4xl text-forest-dark m-0 tracking-tight">
              <Activity className="inline-block mr-2 -mt-2 text-forest" size={30} />
              My activity
            </h1>
            <span className="text-sm text-forest/55 truncate">{user.email}</span>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-terra/10 border border-terra/30 px-5 py-4 text-terra mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <CenteredSpinner label="Loading your activity…" />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 animate-fade-in-up delay-75">
              <StatTile
                value={myPlants.length}
                label="Plants added"
                icon={<Leaf size={20} strokeWidth={1.7} />}
              />
              <StatTile
                value={myRelations.length}
                label="Relations added"
                icon={<GitBranch size={20} strokeWidth={1.7} />}
              />
              <StatTile
                value={myPlants.length + myRelations.length}
                label="Total contributions"
                icon={<Sprout size={20} strokeWidth={1.7} />}
              />
              <StatTile
                value={
                  myPlants.filter((p) => !p.approved).length +
                  myRelations.filter((r) => !r.approved).length
                }
                label="Pending approval"
                icon={<Clock size={20} strokeWidth={1.7} />}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up delay-150">
              {/* Plants */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={18} className="text-forest" />
                  <h2 className="serif text-xl text-forest-dark m-0 tracking-tight">Plants I added</h2>
                  <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-forest/45">
                    {myPlants.length}
                  </span>
                </div>

                {myPlants.length === 0 ? (
                  <EmptyState
                    icon={<Leaf size={30} strokeWidth={1.5} />}
                    title="No plants yet."
                    subtitle="Add a plant to see it here."
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {myPlants.map((plant) => (
                      <div
                        key={plant.id}
                        className="group card-soft rounded-2xl px-4 py-3 transition-all hover:shadow-md"
                      >
                        {editingPlantId === plant.id && editPlantForm ? (
                          <div className="flex flex-col gap-4">
                            <PlantFormFields
                              value={editPlantForm}
                              onChange={setEditPlantForm}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={cancelEditPlant}
                                className="px-3 py-1.5 text-sm rounded-xl text-forest hover:bg-forest/5 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveEditPlant}
                                className="px-3 py-1.5 text-sm rounded-xl bg-forest text-cream font-semibold hover:bg-forest-dark transition-colors shadow-sm shadow-forest/20"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-forest-dark m-0">
                                  {plant.name}
                                </p>
                                {!plant.approved && <PendingChip />}
                              </div>
                              <p className="text-xs text-forest/55 mt-1 m-0">
                                Plant <span className="text-forest-dark font-medium">{monthLabel(plant.planting_start)}–{monthLabel(plant.planting_end)}</span>
                                <span className="text-forest/25"> · </span>
                                Harvest <span className="text-forest-dark font-medium">{monthLabel(plant.harvesting_start)}–{monthLabel(plant.harvesting_end)}</span>
                                <span className="text-forest/25"> · </span>
                                <span className="text-forest-dark font-medium">{plant.height} cm</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditPlant(plant)}
                                title="Edit"
                                className="p-1.5 rounded-full text-forest/65 hover:bg-forest/10 hover:text-forest transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDeletePlant(plant)}
                                title="Delete"
                                className="p-1.5 rounded-full text-terra/65 hover:bg-terra/10 hover:text-terra transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Relationships */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch size={18} className="text-forest" />
                  <h2 className="serif text-xl text-forest-dark m-0 tracking-tight">
                    Relationships I added
                  </h2>
                  <span className="ml-auto text-[11px] font-bold uppercase tracking-wider text-forest/45">
                    {myRelations.length}
                  </span>
                </div>

                {myRelations.length === 0 ? (
                  <EmptyState
                    icon={<GitBranch size={30} strokeWidth={1.5} />}
                    title="No relationships yet."
                    subtitle="Add a relationship to see it here."
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {myRelations.map((rel) => (
                      <div
                        key={rel.id}
                        className="group card-soft rounded-2xl px-4 py-3 transition-all hover:shadow-md"
                      >
                        {editingRelationId === rel.id && editRelationDraft ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-sm flex-wrap">
                              <span className="font-medium text-forest-dark">
                                {plantName(rel.plant_a_id)}
                              </span>
                              <button
                                onClick={() =>
                                  setEditRelationDraft({
                                    ...editRelationDraft,
                                    is_companion: !editRelationDraft.is_companion,
                                  })
                                }
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                                  editRelationDraft.is_companion
                                    ? 'bg-forest/10 text-forest ring-1 ring-forest/20'
                                    : 'bg-terra/10 text-terra ring-1 ring-terra/20'
                                }`}
                              >
                                {editRelationDraft.is_companion ? (
                                  <Heart size={11} />
                                ) : (
                                  <Swords size={11} />
                                )}
                                {editRelationDraft.is_companion
                                  ? 'Companion'
                                  : 'Antagonist'}
                              </button>
                              <span className="font-medium text-forest-dark">
                                {plantName(rel.plant_b_id)}
                              </span>
                            </div>
                            <textarea
                              value={editRelationDraft.explanation}
                              onChange={(e) =>
                                setEditRelationDraft({
                                  ...editRelationDraft,
                                  explanation: e.target.value,
                                })
                              }
                              placeholder="Why this relationship? (optional)"
                              rows={2}
                              className="w-full rounded-xl border border-forest/20 bg-white/80 px-3 py-2 text-sm text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/40 focus:border-forest/40 transition-all resize-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={cancelEditRelation}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl text-forest hover:bg-forest/5 transition-colors"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                              <button
                                onClick={saveEditRelation}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-xl bg-forest text-cream font-semibold hover:bg-forest-dark transition-colors shadow-sm shadow-forest/20"
                              >
                                <Check size={14} />
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-medium text-forest-dark">
                                  {plantName(rel.plant_a_id)}
                                </span>
                                <span
                                  className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                    rel.is_companion
                                      ? 'bg-forest/10 text-forest ring-1 ring-forest/20'
                                      : 'bg-terra/10 text-terra ring-1 ring-terra/20'
                                  }`}
                                >
                                  {rel.is_companion ? <Heart size={10} /> : <Swords size={10} />}
                                  {rel.is_companion ? 'Companion' : 'Antagonist'}
                                </span>
                                <span className="font-medium text-forest-dark">
                                  {plantName(rel.plant_b_id)}
                                </span>
                                {!rel.approved && <PendingChip />}
                              </div>
                              {rel.explanation && (
                                <p className="text-xs text-forest/55 mt-1.5 m-0 italic leading-relaxed">
                                  "{rel.explanation}"
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditRelation(rel)}
                                title="Edit"
                                className="p-1.5 rounded-full text-forest/65 hover:bg-forest/10 hover:text-forest transition-colors"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteRelation(rel)}
                                title="Delete"
                                className="p-1.5 rounded-full text-terra/65 hover:bg-terra/10 hover:text-terra transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        <ConfirmDialog
          open={confirmDeletePlant != null}
          title="Delete plant?"
          body={
            confirmDeletePlant
              ? `"${confirmDeletePlant.name}" will be permanently removed. If it has relations, the server will refuse — remove them first.`
              : ''
          }
          confirmLabel="Delete"
          destructive
          onConfirm={doDeletePlant}
          onCancel={() => setConfirmDeletePlant(null)}
        />

        <ConfirmDialog
          open={confirmDeleteRelation != null}
          title="Delete relationship?"
          body={
            confirmDeleteRelation
              ? `This relationship between ${plantName(confirmDeleteRelation.plant_a_id)} and ${plantName(confirmDeleteRelation.plant_b_id)} will be permanently removed.`
              : ''
          }
          confirmLabel="Delete"
          destructive
          onConfirm={doDeleteRelation}
          onCancel={() => setConfirmDeleteRelation(null)}
        />
      </div>
    </FadeIn>
  );
}
