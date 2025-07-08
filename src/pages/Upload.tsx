
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Coins, Video, Image, Heart, Eye, Share, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UploadPage = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coinName, setCoinName] = useState('');
  const [coinSymbol, setCoinSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState('');
  const [contentType, setContentType] = useState<'photo' | 'video'>('video');
  const [isUploading, setIsUploading] = useState(false);
  const [likedReels, setLikedReels] = useState<number[]>([]);

  // Mock feed data
  const feedReels = [
    {
      id: 1,
      title: "Amazing Dance Performance",
      creator: "DanceKing",
      type: "video" as const,
      views: 15000,
      likes: 890,
      shares: 45,
      coinReward: 5.2,
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Cooking Masterclass",
      creator: "ChefMaster",
      type: "video" as const,
      views: 8500,
      likes: 456,
      shares: 23,
      coinReward: 3.8,
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Tech Innovation Review",
      creator: "TechGuru",
      type: "photo" as const,
      views: 12000,
      likes: 678,
      shares: 34,
      coinReward: 4.5,
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=400&fit=crop"
    }
  ];

  const handleUpload = async () => {
    if (!title || !coinName || !coinSymbol || !initialSupply) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Success!",
        description: `${contentType === 'photo' ? 'Photo' : 'Reel'} uploaded and ${coinName} (${coinSymbol}) minted successfully!`,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCoinName('');
      setCoinSymbol('');
      setInitialSupply('');
      setIsUploading(false);
    }, 2000);
  };

  const handleLike = (reelId: number, coinReward: number) => {
    if (likedReels.includes(reelId)) {
      toast({
        title: "Already Liked",
        description: "You've already liked this content!",
        variant: "destructive"
      });
      return;
    }

    setLikedReels([...likedReels, reelId]);
    
    toast({
      title: "Coins Earned! 🎉",
      description: `You earned ${coinReward} coins for liking this content!`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-8">Share Your Content</h1>
          
          <Card className="bg-white/5 border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                {contentType === 'video' ? (
                  <Video className="mr-2 text-purple-400" />
                ) : (
                  <Image className="mr-2 text-green-400" />
                )}
                Content Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Type Toggle */}
              <div>
                <label className="block text-gray-300 mb-2">Content Type</label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => setContentType('video')}
                    className={`${
                      contentType === 'video'
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Video className="mr-2" size={16} />
                    Video/Reel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setContentType('photo')}
                    className={`${
                      contentType === 'photo'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <Image className="mr-2" size={16} />
                    Photo
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter your ${contentType} title`}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`Describe your ${contentType}...`}
                  className="bg-white/10 border-white/20 text-white min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">
                  Upload {contentType === 'video' ? 'Video' : 'Photo'}
                </label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                  {contentType === 'video' ? (
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  ) : (
                    <Image className="mx-auto mb-4 text-gray-400" size={48} />
                  )}
                  <p className="text-gray-400">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {contentType === 'video' 
                      ? 'MP4, MOV, AVI up to 100MB'
                      : 'JPG, PNG, GIF up to 50MB'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Coins className="mr-2 text-yellow-400" />
                Mint Your Creator Coin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Coin Name *</label>
                  <Input
                    value={coinName}
                    onChange={(e) => setCoinName(e.target.value)}
                    placeholder="CreatorCoin"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Symbol *</label>
                  <Input
                    value={coinSymbol}
                    onChange={(e) => setCoinSymbol(e.target.value.toUpperCase())}
                    placeholder="CC"
                    maxLength={5}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-2">Initial Supply *</label>
                <Input
                  type="number"
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  placeholder="1000000"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              
              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isUploading ? 'Uploading...' : `Upload ${contentType === 'video' ? 'Reel' : 'Photo'} & Mint Coin`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Feed Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">Discover & Earn</h2>
          <p className="text-gray-400 mb-6">Like content to earn coins from creators!</p>
          
          <div className="space-y-6">
            {feedReels.map((reel) => (
              <Card key={reel.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <div className="relative">
                      <img
                        src={reel.thumbnail}
                        alt={reel.title}
                        className="w-24 h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 left-2">
                        {reel.type === 'video' ? (
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
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2">{reel.title}</h3>
                      <div className="flex items-center text-gray-400 mb-3">
                        <User size={16} className="mr-2" />
                        <span className="text-purple-400">@{reel.creator}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {reel.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          {reel.likes}
                        </span>
                        <span className="flex items-center">
                          <Share size={14} className="mr-1" />
                          {reel.shares}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Coins size={14} className="mr-1" />
                          +{reel.coinReward} coins
                        </Badge>
                        
                        <Button
                          onClick={() => handleLike(reel.id, reel.coinReward)}
                          disabled={likedReels.includes(reel.id)}
                          className={`${
                            likedReels.includes(reel.id)
                              ? 'bg-pink-600 hover:bg-pink-700'
                              : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
                          } transition-all duration-200`}
                        >
                          <Heart size={16} className={`mr-2 ${likedReels.includes(reel.id) ? 'fill-current' : ''}`} />
                          {likedReels.includes(reel.id) ? 'Liked' : 'Like & Earn'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
