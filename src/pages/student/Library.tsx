import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, Download,
  Star, Clock, Users,
  FileText, Video, Headphones, Grid3x3,
  List, Bookmark, Heart, Share2
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface Resource {
  id: string;
  title: string;
  type: 'book' | 'video' | 'audio' | 'document';
  format: 'pdf' | 'epub' | 'mp4' | 'mp3' | 'ppt' | 'doc';
  author: string;
  description: string;
  coverUrl?: string;
  duration?: string;
  pages?: number;
  size?: string;
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  downloads: number;
  views: number;
  likes: number;
  tags: string[];
  uploadedAt: Date;
  available: boolean;
  bookmarked?: boolean;
}

export const Library: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchTerm, selectedSubject, selectedType, resources]);

  const loadResources = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResources([
        {
          id: '1',
          title: 'Advanced Calculus: A Comprehensive Guide',
          type: 'book',
          format: 'pdf',
          author: 'Dr. James Stewart',
          description: 'Complete coverage of calculus concepts with practice problems and solutions.',
          coverUrl: '/images/books/calculus.jpg',
          pages: 1200,
          size: '25 MB',
          subject: 'Mathematics',
          level: 'advanced',
          rating: 4.8,
          downloads: 15234,
          views: 45231,
          likes: 1234,
          tags: ['calculus', 'mathematics', 'advanced'],
          uploadedAt: new Date('2024-01-15'),
          available: true
        },
        {
          id: '2',
          title: 'Physics Fundamentals Video Series',
          type: 'video',
          format: 'mp4',
          author: 'Prof. Richard Feynman',
          description: 'Engaging video lectures covering mechanics, thermodynamics, and waves.',
          coverUrl: '/images/books/physics.jpg',
          duration: '12 hours',
          size: '3.5 GB',
          subject: 'Physics',
          level: 'intermediate',
          rating: 4.9,
          downloads: 8934,
          views: 67890,
          likes: 2345,
          tags: ['physics', 'mechanics', 'video'],
          uploadedAt: new Date('2024-02-01'),
          available: true
        },
        {
          id: '3',
          title: 'English Literature Anthology',
          type: 'book',
          format: 'epub',
          author: 'Various Authors',
          description: 'Collection of classic and contemporary literary works.',
          coverUrl: '/images/books/english.jpg',
          pages: 850,
          size: '15 MB',
          subject: 'Literature',
          level: 'intermediate',
          rating: 4.7,
          downloads: 5678,
          views: 12345,
          likes: 890,
          tags: ['literature', 'poetry', 'fiction'],
          uploadedAt: new Date('2024-01-20'),
          available: true
        },
        {
          id: '4',
          title: 'Chemistry Lab Manual',
          type: 'document',
          format: 'pdf',
          author: 'Dr. Marie Curie Institute',
          description: 'Comprehensive lab procedures and safety guidelines.',
          pages: 320,
          size: '8 MB',
          subject: 'Chemistry',
          level: 'beginner',
          rating: 4.5,
          downloads: 3456,
          views: 7890,
          likes: 456,
          tags: ['chemistry', 'lab', 'practical'],
          uploadedAt: new Date('2024-02-10'),
          available: true
        },
        {
          id: '5',
          title: 'Study Music for Focus',
          type: 'audio',
          format: 'mp3',
          author: 'Study Beats',
          description: 'Ambient music designed to enhance concentration while studying.',
          duration: '3 hours',
          size: '180 MB',
          subject: 'General',
          level: 'beginner',
          rating: 4.6,
          downloads: 12345,
          views: 45678,
          likes: 1678,
          tags: ['music', 'focus', 'study'],
          uploadedAt: new Date('2024-01-05'),
          available: true
        },
        {
          id: '6',
          title: 'History of Zimbabwe',
          type: 'book',
          format: 'pdf',
          author: 'Prof. Chengetai Ncube',
          description: 'Comprehensive history from pre-colonial times to modern day.',
          coverUrl: '/images/books/history.jpg',
          pages: 450,
          size: '12 MB',
          subject: 'History',
          level: 'intermediate',
          rating: 4.9,
          downloads: 7890,
          views: 15678,
          likes: 1123,
          tags: ['history', 'zimbabwe', 'africa'],
          uploadedAt: new Date('2024-01-25'),
          available: true
        }
      ]);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(r => r.subject === selectedSubject);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    setFilteredResources(filtered);
  };

  const toggleBookmark = (resourceId: string) => {
    if (bookmarks.includes(resourceId)) {
      setBookmarks(bookmarks.filter(id => id !== resourceId));
    } else {
      setBookmarks([...bookmarks, resourceId]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book': return <BookOpen className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'pdf': return 'bg-red-100 text-red-800';
      case 'epub': return 'bg-green-100 text-green-800';
      case 'mp4': return 'bg-blue-100 text-blue-800';
      case 'mp3': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Library</h1>
          <p className="text-gray-600 mt-1">
            Access thousands of educational resources
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Bookmark className="w-4 h-4 mr-2" />
            My Library ({bookmarks.length})
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-2">
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Literature">Literature</option>
            <option value="History">History</option>
            <option value="General">General</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="book">Books</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </Card>

      {/* Results Count and View Toggle */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredResources.length} of {resources.length} resources
        </p>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Resource Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    resource.type === 'book' ? 'bg-blue-100' :
                    resource.type === 'video' ? 'bg-green-100' :
                    resource.type === 'audio' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <Badge className={getFormatColor(resource.format)}>
                    {resource.format.toUpperCase()}
                  </Badge>
                </div>

                {/* Content */}
                <h3 className="font-semibold mb-1 line-clamp-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {resource.author}</p>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {resource.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 text-xs text-gray-500 mb-3">
                  {resource.pages && (
                    <div className="flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {resource.pages} pages
                    </div>
                  )}
                  {resource.duration && (
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {resource.duration}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {resource.downloads.toLocaleString()} downloads
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(resource.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    ({resource.rating})
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <Button variant="primary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleBookmark(resource.id)}
                      className={`p-2 rounded-full hover:bg-gray-100 ${
                        bookmarks.includes(resource.id) ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${bookmarks.includes(resource.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                {/* Type Icon */}
                <div className={`p-3 rounded-lg ${
                  resource.type === 'book' ? 'bg-blue-100' :
                  resource.type === 'video' ? 'bg-green-100' :
                  resource.type === 'audio' ? 'bg-purple-100' :
                  'bg-orange-100'
                }`}>
                  {getTypeIcon(resource.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-gray-600">by {resource.author}</p>
                    </div>
                    <Badge className={getFormatColor(resource.format)}>
                      {resource.format.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                    <span>{resource.subject}</span>
                    <span>•</span>
                    <span className="capitalize">{resource.level}</span>
                    <span>•</span>
                    <span>
                      <Star className="w-4 h-4 text-yellow-400 inline mr-1" />
                      {resource.rating}
                    </span>
                    <span>•</span>
                    <span>{resource.downloads.toLocaleString()} downloads</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="primary" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <button
                        onClick={() => toggleBookmark(resource.id)}
                        className={`p-2 rounded-full hover:bg-gray-100 ${
                          bookmarks.includes(resource.id) ? 'text-primary-600' : 'text-gray-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${bookmarks.includes(resource.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredResources.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-2">No Resources Found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </Card>
      )}
    </div>
  );
};