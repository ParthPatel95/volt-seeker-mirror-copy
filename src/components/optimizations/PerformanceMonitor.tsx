import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isDevelopment } from '@/utils/performance';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  showMetrics?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  componentName,
  children,
  showMetrics = isDevelopment
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  const [startTime] = useState(() => performance.now());

  const updateMetrics = useCallback(() => {
    const renderTime = performance.now() - startTime;
    
    setMetrics(prev => {
      const newRenderCount = prev.renderCount + 1;
      const newAverageRenderTime = 
        (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount;
      
      return {
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverageRenderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize || undefined
      };
    });
  }, [startTime]);

  useEffect(() => {
    updateMetrics();
  });

  const getPerformanceStatus = (avgTime: number) => {
    if (avgTime < 16) return { status: 'excellent', color: 'bg-green-500' };
    if (avgTime < 33) return { status: 'good', color: 'bg-yellow-500' };
    return { status: 'needs-optimization', color: 'bg-red-500' };
  };

  if (!showMetrics) {
    return <>{children}</>;
  }

  const { status, color } = getPerformanceStatus(metrics.averageRenderTime);

  return (
    <div className="relative">
      {children}
      <Card className="fixed bottom-4 right-4 z-50 w-64 bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            {componentName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Renders:</span>
            <Badge variant="outline">{metrics.renderCount}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Avg Time:</span>
            <Badge variant="outline">{metrics.averageRenderTime.toFixed(2)}ms</Badge>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <Badge variant={status === 'excellent' ? 'default' : 'secondary'}>
              {status}
            </Badge>
          </div>
          {metrics.memoryUsage && (
            <div className="flex justify-between">
              <span>Memory:</span>
              <Badge variant="outline">
                {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;