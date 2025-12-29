import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { JournalEntry, Sentiment } from '../types';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, sentiment?: Sentiment) => void;
  entry?: JournalEntry | null;
}

const EntryModal = ({ isOpen, onClose, onSave, entry }: EntryModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<Sentiment | ''>('');

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setSentiment(entry.sentiment);
    } else {
      setTitle('');
      setContent('');
      setSentiment('');
    }
  }, [entry, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, content, sentiment || undefined);
    setTitle('');
    setContent('');
    setSentiment('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-scaleIn">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {entry ? 'Edit Entry' : 'New Entry'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800"
                placeholder="Give your entry a title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none text-gray-800"
                placeholder="Write your thoughts..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sentiment (Optional)
              </label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as Sentiment | '')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-800 appearance-none bg-white"
              >
                <option value="">Auto-detect (AI)</option>
                <option value="HAPPY">Happy</option>
                <option value="SAD">Sad</option>
                <option value="ANGRY">Angry</option>
                <option value="ANXIOUS">Anxious</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold hover:scale-105"
            >
              {entry ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryModal;
