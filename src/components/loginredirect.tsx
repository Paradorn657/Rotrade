import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginRedirect = () => {
  return (
    <div className="min-h-full flex items-center justify-center bg-slate-900">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-6 text-center pt-8">
          <div className="flex justify-center">
            <div className="p-4 bg-blue-500/10 rounded-2xl">
              <Bot className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-white">
              Access Your Trading Bot
            </CardTitle>
            <p className="text-blue-200 text-sm font-medium">
              MT5 Auto Trading System
            </p>
          </div>
        </CardHeader>
        <CardContent className="text-center pb-6">
          <p className="text-slate-400 text-sm">
            Sign in to manage your automated trading strategies and monitor your MT5 bots
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pb-8">
          <Button 
            onClick={() => window.location.href = '/signin'}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11 flex items-center justify-center gap-2"
          >
            Sign in to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost"
            onClick={() => window.location.href = '/'}
            className="w-full text-slate-400 hover:text-white hover:bg-slate-700 h-11"
          >
            Back to Homepage
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginRedirect;