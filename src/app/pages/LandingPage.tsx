import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { 
  BookOpen, 
  Search, 
  Download, 
  Clock, 
  FileText,
  Youtube,
  Cloud,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Library,
  Filter,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Smart Search',
      description: 'Find papers instantly with powerful search and filter capabilities',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Instant Preview',
      description: 'View complete question papers directly in your browser before downloading',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Easy Download',
      description: 'Download papers for offline study and access them anytime',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: <Youtube className="w-6 h-6" />,
      title: 'Video Solutions',
      description: 'Watch video explanations and solutions for better understanding',
      color: 'bg-red-50 text-red-600'
    },
    {
      icon: <Library className="w-6 h-6" />,
      title: 'Organized Library',
      description: 'Papers categorized by department, batch, and subject for easy navigation',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: '24/7 Access',
      description: 'Study materials available anytime, anywhere on any device',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const stats = [
    { label: 'Question Papers', value: '500+' },
    { label: 'Departments', value: '20+' },
    { label: 'Students Helped', value: '5000+' },
    { label: 'Success Rate', value: '95%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">InfoVibe</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/browse">
                <Button>Browse Papers</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />
                Your Ultimate Study Resource
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Access Previous Year{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Question Papers
                </span>{' '}
                Instantly
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Your comprehensive repository of question papers, study materials, and video solutions. 
                Organized by department, batch, and subject for easy access.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/browse">
                  <Button size="lg" className="text-lg h-14 px-8">
                    <Search className="w-5 h-5 mr-2" />
                    Browse Papers
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                {stats.slice(0, 3).map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1752920299180-e8fd9276c202?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBsaWJyYXJ5JTIwYm9va3N8ZW58MXx8fHwxNzczODk4OTM4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students studying"
                  className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make studying easier and more effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Browse or Search</h3>
              <p className="text-muted-foreground">
                Use filters to find papers by department, batch, or subject
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">Preview Content</h3>
              <p className="text-muted-foreground">
                View papers, videos, and materials directly in your browser
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Study & Excel</h3>
              <p className="text-muted-foreground">
                Download materials and ace your exams with confidence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Types */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1771765780945-c788a6ce4b33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBlZHVjYXRpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc3Mzg1MjYyNHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern education"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Access Multiple Content Types</h2>
              <p className="text-xl text-muted-foreground">
                Different formats to match your learning style
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">PDF Documents</h4>
                    <p className="text-muted-foreground">Download and view question papers in PDF format</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Cloud Storage</h4>
                    <p className="text-muted-foreground">Access papers stored in Google Drive seamlessly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Video Solutions</h4>
                    <p className="text-muted-foreground">Watch detailed explanations and step-by-step solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl font-bold">Ready to Ace Your Exams?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of students who are already using our platform to access quality study materials
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/browse">
                <Button size="lg" className="text-lg h-14 px-8">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start Browsing Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                  Contribute Papers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">QPaper</span>
              </div>
              <p className="text-gray-400">
                Your ultimate question paper repository for academic excellence
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/browse" className="hover:text-white">Browse Papers</Link></li>
                <li><Link to="/login" className="hover:text-white">Admin Panel</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Smart Search</li>
                <li>Multiple Formats</li>
                <li>Secure Storage</li>
                <li>24/7 Access</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ST Software Solution. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
