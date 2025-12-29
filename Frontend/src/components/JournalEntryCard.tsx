import { Pencil, Trash2 } from 'lucide-react';
import { JournalEntry, Sentiment } from '../types';

interface JournalEntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const sentimentConfig: Record<Sentiment, { color: string; bg: string }> = {
  HAPPY: { color: 'text-green-700', bg: 'bg-green-100 border-green-200' },
  SAD: { color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
  ANGRY: { color: 'text-red-700', bg: 'bg-red-100 border-red-200' },
  ANXIOUS: { color: 'text-orange-700', bg: 'bg-orange-100 border-orange-200' },
};

const JournalEntryCard = ({ entry, onEdit, onDelete }: JournalEntryCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const config = sentimentConfig[entry.sentiment];

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-1 animate-fadeIn">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
            {entry.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
            {entry.sentiment}
          </span>
        </div>

        <p className="text-sm text-gray-500 mb-4 flex items-center">
          {formatDate(entry.date)}
        </p>

        <p className="text-gray-700 leading-relaxed mb-6 min-h-[60px]">
          {truncateContent(entry.content)}
        </p>

        <div className="flex space-x-2 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(entry)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition-all duration-300 font-medium hover:scale-105"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-300 font-medium hover:scale-105"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntryCard;
