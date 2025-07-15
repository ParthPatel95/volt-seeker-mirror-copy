import { Card, CardContent } from '@/components/ui/card';

interface PowerData {
  totalSubstations: number;
  totalCapacity: number;
  averageCapacity: number;
  highCapacityCount: number;
}

interface PowerInfrastructureHeaderProps {
  powerData: PowerData;
}

export function PowerInfrastructureHeader({ powerData }: PowerInfrastructureHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Power Infrastructure Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{powerData.totalSubstations}</div>
              <div className="text-sm opacity-90">Total Substations</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{powerData.totalCapacity}</div>
              <div className="text-sm opacity-90">Total Capacity (MVA)</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{powerData.averageCapacity}</div>
              <div className="text-sm opacity-90">Average Capacity</div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{powerData.highCapacityCount}</div>
              <div className="text-sm opacity-90">High Capacity</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}