import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, BookOpen, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';
import { JournalEntry, Sentiment } from '../types';
import JournalEntryCard from '../components/JournalEntryCard';
import EntryModal from '../components/EntryModal';

const Dashboard = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/journal');
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleCreateEntry = async (title: string, content: string, sentiment?: Sentiment) => {
    try {
      await api.post('/journal', { title, content, sentiment });
      await fetchEntries();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  const handleUpdateEntry = async (title: string, content: string, sentiment?: Sentiment) => {
    if (!selectedEntry) return;
    try {
      await api.put(`/journal/id/${selectedEntry.id}`, { title, content, sentiment });
      await fetchEntries();
      setIsModalOpen(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await api.delete(`/journal/id/${id}`);
      await fetchEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  const openEditModal = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                JournalApp
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Hello, {username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 font-medium hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Journals</h1>
            <p className="text-gray-600">Capture your thoughts and feelings</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>New Entry</span>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading your entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-purple-100 rounded-full mb-4">
              <BookOpen className="w-16 h-16 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No entries yet</h3>
            <p className="text-gray-600 mb-6">Start your journaling journey by creating your first entry</p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Entry</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                onEdit={openEditModal}
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        )}
      </div>

      <EntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={selectedEntry ? handleUpdateEntry : handleCreateEntry}
        entry={selectedEntry}
      />
    </div>
  );
};

export default Dashboard;
