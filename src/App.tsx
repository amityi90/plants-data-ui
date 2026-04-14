import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlantsProvider } from './context/PlantsContext';
import Header from './components/Header';
import AddPlantForm from './pages/AddPlantForm';
import AddRelationshipForm from './pages/AddRelationshipForm';
import ShowAllPlants from './pages/ShowAllPlants';
import About from './pages/About';
import MyActivity from './pages/MyActivity';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-cream)' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm" style={{ borderColor: 'rgba(45,106,79,0.1)', color: 'rgba(27,67,50,0.4)' }}>
        Plants Data — open source, grown together
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlantsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/plants" replace />} />
              <Route path="/plants" element={<ShowAllPlants />} />
              <Route path="/add-plant" element={<AddPlantForm />} />
              <Route path="/add-relationship" element={<AddRelationshipForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/my-activity" element={<MyActivity />} />
            </Routes>
          </Layout>
        </PlantsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
