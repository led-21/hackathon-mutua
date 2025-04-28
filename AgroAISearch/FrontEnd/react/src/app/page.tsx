'use client';

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard after the component mounts
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="container mx-auto py-10">
      <Card className="w-[600px] mx-auto">
        <CardHeader>
          <CardTitle>AgriWatch AI</CardTitle>
          <CardDescription>
            AI-Powered Agriculture and Wildfire Monitoring System.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
}

