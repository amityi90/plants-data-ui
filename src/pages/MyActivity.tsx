import { useEffect, useState } from 'react';
import { Activity, Leaf, GitBranch, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserPlants } from '../api/plants';
import { getUserRelationships } from '../api/relations';
import { usePlants } from '../context/PlantsContext';
import { monthLabel } from '../components/MonthSelect';
import type { Plant, Relation } from '../types';

export default function MyActivity() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { plants: allPlants } = usePlants();
  const [myPlants, setMyPlants] = useState<Plant[]>([]);
  const [myRelations, setMyRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    async function load() {
      try {
        const [plants, relations] = await Promise.all([getUserPlants(), getUserRelationships()]);
        setMyPlants(plants);
        setMyRelations(relations);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, navigate]);

  if (!user) return null;

  function plantName(id: number) {
    return allPlants.find(p => p.id === id)?.name ?? `#${id}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Activity size={28} className="text-forest" />
        <h1 className="text-3xl text-forest-dark m-0">My Activity</h1>
        <span className="ml-2 text-sm text-forest/60">{user.email}</span>
      </div>

      {!user && (
        <div className="flex flex-col items-center gap-3 py-16 text-forest/50">
          <Lock size={32} />
          <p>Please log in to see your activity.</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 mb-6">{error}</div>
      )}

      {loading && (
        <div className="text-center py-16 text-forest/60">Loading your activity...</div>
      )}

      {!loading && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Plants I added */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Leaf size={18} className="text-forest" />
              <h2 className="text-xl text-forest-dark m-0">Plants I added</h2>
              <span className="ml-auto text-sm text-forest/50">{myPlants.length}</span>
            </div>
            {myPlants.length === 0 ? (
              <div className="rounded-2xl border border-forest/10 bg-white/40 px-4 py-8 text-center text-forest/40">
                You haven't added any plants yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {myPlants.map(plant => (
                  <div key={plant.id} className="rounded-xl border border-forest/10 bg-white/60 px-4 py-3 shadow-sm">
                    <p className="font-medium text-forest-dark">{plant.name}</p>
                    <p className="text-xs text-forest/60 mt-0.5">
                      Planting: {monthLabel(plant.planting_start)}–{monthLabel(plant.planting_end)} &nbsp;·&nbsp;
                      Harvest: {monthLabel(plant.harvesting_start)}–{monthLabel(plant.harvesting_end)} &nbsp;·&nbsp;
                      {plant.height} cm
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Relationships I added */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={18} className="text-forest" />
              <h2 className="text-xl text-forest-dark m-0">Relationships I added</h2>
              <span className="ml-auto text-sm text-forest/50">{myRelations.length}</span>
            </div>
            {myRelations.length === 0 ? (
              <div className="rounded-2xl border border-forest/10 bg-white/40 px-4 py-8 text-center text-forest/40">
                You haven't added any relationships yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {myRelations.map(rel => (
                  <div key={rel.id} className="rounded-xl border border-forest/10 bg-white/60 px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-forest-dark">{plantName(rel.plant_a_id)}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${rel.is_companion ? 'bg-forest/15 text-forest' : 'bg-terra/15 text-terra'}`}>
                        {rel.is_companion ? 'companion' : 'antagonist'}
                      </span>
                      <span className="font-medium text-forest-dark">{plantName(rel.plant_b_id)}</span>
                    </div>
                    {rel.explanation && (
                      <p className="text-xs text-forest/60 mt-1 italic">"{rel.explanation}"</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
