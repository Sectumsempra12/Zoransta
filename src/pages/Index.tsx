
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Play, Coins, TrendingUp, Users, Upload, Zap } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Play,
      title: 'Create & Share Reels',
      description: 'Upload your creative content and build your audience'
    },
    {
      icon: Coins,
      title: 'Mint Creator Coins',
      description: 'Launch your own token and monetize your content'
    },
    {
      icon: TrendingUp,
      title: 'Earn from Engagement',
      description: 'Get rewarded when your content performs well'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with creators and fans in a decentralized space'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Create. Share. Earn.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            The first Web3 social platform where creators mint their own coins and fans invest in their favorite content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3">
                <Upload className="mr-2" size={20} />
                Start Creating
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 py-3">
                <Zap className="mr-2" size={20} />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why ReelsCoin?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Revolutionary features that put creators in control of their content and earnings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <feature.icon className="mx-auto mb-4 text-purple-400" size={48} />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-purple-400 mb-2">1,000+</h3>
              <p className="text-gray-400">Creators Joined</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-400 mb-2">50K+</h3>
              <p className="text-gray-400">Reels Uploaded</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-pink-400 mb-2">$100K+</h3>
              <p className="text-gray-400">Creator Earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join the revolution of decentralized content creation and start earning from your creativity today
          </p>
          <Link to="/upload">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-12 py-4">
              Launch Your First Reel
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
