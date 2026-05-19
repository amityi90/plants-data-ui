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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-terra/15 text-terra">
      <Clock size={11} />
      pending review
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
      // Surface an error only when both failed *and* it's not a plain network drop —
      // a new user with no activity shouldn't see "Failed to fetch".
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
        <div className="flex items-center gap-3 mb-8">
          <Activity size={28} className="text-forest" />
          <h1 className="text-3xl text-forest-dark m-0">My Activity</h1>
          <span className="ml-2 text-sm text-forest/60">{user.email}</span>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <CenteredSpinner label="Loading your activity..." />
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              <StatTile
                value={myPlants.length}
                label="Plants added"
                icon={<Leaf size={20} />}
              />
              <StatTile
                value={myRelations.length}
                label="Relations added"
                icon={<GitBranch size={20} />}
              />
              <StatTile
                value={myPlants.length + myRelations.length}
                label="Total contributions"
                icon={<Sprout size={20} />}
              />
              <StatTile
                value={
                  myPlants.filter((p) => !p.approved).length +
                  myRelations.filter((r) => !r.approved).length
                }
                label="Pending approval"
                icon={<Clock size={20} />}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Plants I added */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Leaf size={18} className="text-forest" />
                  <h2 className="text-xl text-forest-dark m-0">Plants I added</h2>
                  <span className="ml-auto text-sm text-forest/50">
                    {myPlants.length}
                  </span>
                </div>

                {myPlants.length === 0 ? (
                  <EmptyState
                    icon={<Leaf size={32} />}
                    title="No plants yet."
                    subtitle="Add a plant to see it here."
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {myPlants.map((plant) => (
                      <div
                        key={plant.id}
                        className="group rounded-xl border border-forest/10 bg-white/60 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
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
                                className="px-3 py-1.5 text-sm rounded-lg text-forest hover:bg-forest/5"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={saveEditPlant}
                                className="px-3 py-1.5 text-sm rounded-lg bg-forest text-cream font-semibold hover:bg-forest-dark"
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
                              <p className="text-xs text-forest/60 mt-0.5 m-0">
                                Planting: {monthLabel(plant.planting_start)}–
                                {monthLabel(plant.planting_end)}
                                {' · '}
                                Harvest: {monthLabel(plant.harvesting_start)}–
                                {monthLabel(plant.harvesting_end)}
                                {' · '}
                                {plant.height} cm
                              </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditPlant(plant)}
                                title="Edit"
                                className="p-1.5 rounded-lg text-forest/70 hover:bg-forest/10 hover:text-forest"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDeletePlant(plant)}
                                title="Delete"
                                className="p-1.5 rounded-lg text-terra/70 hover:bg-terra/10 hover:text-terra"
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

              {/* Relationships I added */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <GitBranch size={18} className="text-forest" />
                  <h2 className="text-xl text-forest-dark m-0">
                    Relationships I added
                  </h2>
                  <span className="ml-auto text-sm text-forest/50">
                    {myRelations.length}
                  </span>
                </div>

                {myRelations.length === 0 ? (
                  <EmptyState
                    icon={<GitBranch size={32} />}
                    title="No relationships yet."
                    subtitle="Add a relationship to see it here."
                  />
                ) : (
                  <div className="flex flex-col gap-2">
                    {myRelations.map((rel) => (
                      <div
                        key={rel.id}
                        className="group rounded-xl border border-forest/10 bg-white/60 px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        {editingRelationId === rel.id && editRelationDraft ? (
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-sm">
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
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                                  editRelationDraft.is_companion
                                    ? 'bg-forest/15 text-forest'
                                    : 'bg-terra/15 text-terra'
                                }`}
                              >
                                {editRelationDraft.is_companion ? (
                                  <Heart size={11} />
                                ) : (
                                  <Swords size={11} />
                                )}
                                {editRelationDraft.is_companion
                                  ? 'companion'
                                  : 'antagonist'}
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
                              className="w-full rounded-lg border border-forest/30 bg-cream px-3 py-2 text-sm text-forest-dark placeholder-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/50"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={cancelEditRelation}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-forest hover:bg-forest/5"
                              >
                                <X size={14} />
                                Cancel
                              </button>
                              <button
                                onClick={saveEditRelation}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg bg-forest text-cream font-semibold hover:bg-forest-dark"
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
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                    rel.is_companion
                                      ? 'bg-forest/15 text-forest'
                                      : 'bg-terra/15 text-terra'
                                  }`}
                                >
                                  {rel.is_companion ? 'companion' : 'antagonist'}
                                </span>
                                <span className="font-medium text-forest-dark">
                                  {plantName(rel.plant_b_id)}
                                </span>
                                {!rel.approved && <PendingChip />}
                              </div>
                              {rel.explanation && (
                                <p className="text-xs text-forest/60 mt-1 m-0 italic">
                                  "{rel.explanation}"
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => startEditRelation(rel)}
                                title="Edit"
                                className="p-1.5 rounded-lg text-forest/70 hover:bg-forest/10 hover:text-forest"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setConfirmDeleteRelation(rel)}
                                title="Delete"
                                className="p-1.5 rounded-lg text-terra/70 hover:bg-terra/10 hover:text-terra"
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
