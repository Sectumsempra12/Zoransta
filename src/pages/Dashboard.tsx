
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Heart, Share, Coins, TrendingUp, DollarSign, Users, Gift, ThumbsUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data - replace with real data from your backend
  const stats = {
    totalReels: 24,
    totalViews: 125000,
    totalLikes: 8500,
    coinsEarned: 2450.50,
    coinsFromLikes: 348.75, // New stat for coins earned from liking
    coinValue: 0.25,
    followers: 1250
  };

  const reels = [
    {
      id: 1,
      title: "Amazing Dance Moves",
      views: 15000,
      likes: 890,
      shares: 45,
      earnings: 125.50,
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=400&fit=crop"
    },
    {
      id: 2,
      title: "Cooking Tutorial",
      views: 8500,
      likes: 456,
      shares: 23,
      earnings: 89.25,
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop"
    },
    {
      id: 3,
      title: "Tech Review",
      views: 12000,
      likes: 678,
      shares: 34,
      earnings: 156.75,
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=400&fit=crop"
    }
  ];

  const coinStats = {
    name: "CreatorCoin",
    symbol: "CC",
    currentPrice: 0.25,
    holders: 156,
    marketCap: 12500,
    change24h: +12.5
  };

  // New section for liked reels earnings
  const likedReelsEarnings = [
    { creator: "DanceKing", reel: "Amazing Dance Performance", earned: 5.2, timeAgo: "2h ago" },
    { creator: "ChefMaster", reel: "Cooking Masterclass", earned: 3.8, timeAgo: "4h ago" },
    { creator: "TechGuru", reel: "Tech Innovation Review", earned: 4.5, timeAgo: "6h ago" },
    { creator: "ArtistPro", reel: "Digital Art Tutorial", earned: 2.9, timeAgo: "8h ago" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Creator Dashboard</h1>
        <p className="text-gray-400">Track your content performance and coin statistics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Reels</p>
                <p className="text-3xl font-bold text-white">{stats.totalReels}</p>
              </div>
              <Play className="text-purple-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="text-blue-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Likes</p>
                <p className="text-3xl font-bold text-white">{stats.totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="text-pink-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Coins from Content</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.coinsEarned}</p>
              </div>
              <Coins className="text-yellow-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Coins from Likes</p>
                <p className="text-3xl font-bold text-green-400">{stats.coinsFromLikes}</p>
              </div>
              <ThumbsUp className="text-green-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Followers</p>
                <p className="text-3xl font-bold text-white">{stats.followers}</p>
              </div>
              <Users className="text-purple-400" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Reels */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Your Recent Reels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reels.map((reel) => (
              <div key={reel.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{reel.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
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
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">${reel.earnings}</p>
                  <p className="text-xs text-gray-400">earned</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Earnings from Likes */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Gift className="mr-2 text-green-400" />
              Recent Earnings from Likes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {likedReelsEarnings.map((earning, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{earning.reel}</h4>
                  <p className="text-purple-400 text-sm">by @{earning.creator}</p>
                  <p className="text-xs text-gray-400 mt-1">{earning.timeAgo}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">+{earning.earned}</p>
                  <p className="text-xs text-gray-400">coins</p>
                </div>
              </div>
            ))}
            <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              View All Earnings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Coin Stats */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Coins className="mr-2 text-yellow-400" />
            Your Creator Coin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white">{coinStats.name} ({coinStats.symbol})</h3>
            <p className="text-3xl font-bold text-yellow-400 mt-2">${coinStats.currentPrice}</p>
            <Badge className={`mt-2 ${coinStats.change24h > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
              {coinStats.change24h > 0 ? '+' : ''}{coinStats.change24h}% (24h)
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <DollarSign className="mx-auto text-green-400 mb-2" size={24} />
              <p className="text-gray-400 text-sm">Market Cap</p>
              <p className="text-white font-semibold">${coinStats.marketCap.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <Users className="mx-auto text-blue-400 mb-2" size={24} />
              <p className="text-gray-400 text-sm">Holders</p>
              <p className="text-white font-semibold">{coinStats.holders}</p>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            View Coin Analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
