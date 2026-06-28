import { useState, useCallback } from 'react';
import Layout from './components/Layout';
import ReleasesList from './components/ReleasesList';
import ReleaseDetail from './components/ReleaseDetail';
import CreateRelease from './components/CreateRelease';

type View = 'list' | 'detail' | 'create';

export default function App() {
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  const goToDetail = (id: number) => {
    setSelectedId(id);
    setView('detail');
  };

  const goToList = useCallback(() => {
    setView('list');
    setSelectedId(null);
    setKey((k) => k + 1);
  }, []);

  const onCreateSuccess = (id: number) => {
    goToDetail(id);
  };

  return (
    <Layout>
      {view === 'list' && (
        <ReleasesList
          key={key}
          onCreateNew={() => setView('create')}
          onViewDetail={goToDetail}
          onRefresh={() => setKey((k) => k + 1)}
        />
      )}
      {view === 'detail' && selectedId != null && (
        <ReleaseDetail releaseId={selectedId} onBack={goToList} />
      )}
      {view === 'create' && (
        <CreateRelease onCancel={goToList} onCreateSuccess={onCreateSuccess} />
      )}
    </Layout>
  );
}
