
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Heart, Eye, Share, User, Video, Image, Coins, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Feed = () => {
  const { toast } = useToast();
  const [likedContent, setLikedContent] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo'>('all');

  // Mock feed data with mixed content types
  const allContent = [
    {
      id: 1,
      title: "Amazing Dance Performance",
      creator: "DanceKing",
      type: "video" as const,
      views: 15000,
      likes: 890,
      shares: 45,
      coinReward: 5.2,
      timeAgo: "2h ago",
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=500&fit=crop"
    },
    {
      id: 2,
      title: "Beautiful Sunset Photography",
      creator: "PhotoPro",
      type: "photo" as const,
      views: 8500,
      likes: 456,
      shares: 23,
      coinReward: 3.8,
      timeAgo: "4h ago",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=500&fit=crop"
    },
    {
      id: 3,
      title: "Tech Innovation Review",
      creator: "TechGuru",
      type: "video" as const,
      views: 12000,
      likes: 678,
      shares: 34,
      coinReward: 4.5,
      timeAgo: "6h ago",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop"
    },
    {
      id: 4,
      title: "Street Art Masterpiece",
      creator: "ArtistPro",
      type: "photo" as const,
      views: 9200,
      likes: 523,
      shares: 28,
      coinReward: 3.1,
      timeAgo: "8h ago",
      thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=500&fit=crop"
    },
    {
      id: 5,
      title: "Cooking Tutorial: Pasta",
      creator: "ChefMaster",
      type: "video" as const,
      views: 18500,
      likes: 1200,
      shares: 67,
      coinReward: 6.8,
      timeAgo: "10h ago",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=500&fit=crop"
    },
    {
      id: 6,
      title: "Urban Photography Collection",
      creator: "CityLens",
      type: "photo" as const,
      views: 6800,
      likes: 389,
      shares: 19,
      coinReward: 2.9,
      timeAgo: "12h ago",
      thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=500&fit=crop"
    }
  ];

  const filteredContent = allContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || content.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleLike = (contentId: number, coinReward: number) => {
    if (likedContent.includes(contentId)) {
      toast({
        title: "Already Liked",
        description: "You've already liked this content!",
        variant: "destructive"
      });
      return;
    }

    setLikedContent([...likedContent, contentId]);
    
    toast({
      title: "Coins Earned! 🎉",
      description: `You earned ${coinReward} coins for liking this content!`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Content Feed</h1>
        <p className="text-gray-400">Discover amazing content from creators around the world</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search content or creators..."
            className="pl-10 bg-white/10 border-white/20 text-white"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={() => setFilterType('all')}
            className={`${
              filterType === 'all'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Filter size={16} className="mr-2" />
            All
          </Button>
          <Button
            onClick={() => setFilterType('video')}
            className={`${
              filterType === 'video'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Video size={16} className="mr-2" />
            Videos
          </Button>
          <Button
            onClick={() => setFilterType('photo')}
            className={`${
              filterType === 'photo'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Image size={16} className="mr-2" />
            Photos
          </Button>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((content) => (
          <Card key={content.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 overflow-hidden">
            <div className="relative">
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                {content.type === 'video' ? (
                  <Badge className="bg-purple-500/80 text-white">
                    <Video size={12} className="mr-1" />
                    Video
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/80 text-white">
                    <Image size={12} className="mr-1" />
                    Photo
                  </Badge>
                )}
              </div>
              <div className="absolute top-3 right-3">
                <Badge className="bg-yellow-500/80 text-white">
                  <Coins size={12} className="mr-1" />
                  +{content.coinReward}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-4">
              <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">{content.title}</h3>
              
              <div className="flex items-center text-gray-400 mb-3">
                <User size={14} className="mr-2" />
                <span className="text-purple-400 text-sm">@{content.creator}</span>
                <span className="text-gray-500 text-sm ml-auto">{content.timeAgo}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center">
                    <Eye size={12} className="mr-1" />
                    {content.views.toLocaleString()}
                  </span>
                  <span className="flex items-center">
                    <Heart size={12} className="mr-1" />
                    {content.likes}
                  </span>
                  <span className="flex items-center">
                    <Share size={12} className="mr-1" />
                    {content.shares}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => handleLike(content.id, content.coinReward)}
                disabled={likedContent.includes(content.id)}
                className={`w-full ${
                  likedContent.includes(content.id)
                    ? 'bg-pink-600 hover:bg-pink-700'
                    : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                } transition-all duration-200`}
              >
                <Heart size={16} className={`mr-2 ${likedContent.includes(content.id) ? 'fill-current' : ''}`} />
                {likedContent.includes(content.id) ? 'Liked' : 'Like & Earn'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredContent.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No content found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default Feed;
