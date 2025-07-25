import { CheckCircle, Users, Calendar as CalendarIcon, BarChart3 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              TaskManager Pro
            </h1>
            <p className="text-muted-foreground">
              Built with Next.js 15, Redux Toolkit, and shadcn/ui
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Component Testing Section */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="setup">Setup</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-lg">Task Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Create, organize, and track your tasks efficiently
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <Users className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-lg">Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Work together seamlessly with your team
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <CalendarIcon className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-lg">Schedule Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Plan and schedule your projects effectively
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <BarChart3 className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-lg">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track progress with detailed analytics
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>shadcn/ui Components Test</CardTitle>
                <CardDescription>
                  All installed components are working correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buttons */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Buttons</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <Separator />

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Badges</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </div>

                <Separator />

                {/* Input */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Input</h3>
                  <Input placeholder="Type something here..." className="max-w-sm" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Setup Status</CardTitle>
                <CardDescription>Current implementation progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="default">✓</Badge>
                  <span>MongoDB running on localhost:27017</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">✓</Badge>
                  <span>Next.js 15 with App Router</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">✓</Badge>
                  <span>Redux Toolkit Store configured</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">✓</Badge>
                  <span>shadcn/ui components installed</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">✓</Badge>
                  <span>Dark/Light theme support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">→</Badge>
                  <span>Server API ready on localhost:5000</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}