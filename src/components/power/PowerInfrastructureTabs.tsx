import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export function PowerInfrastructureTabs() {
  return (
    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="ultimate-finder">Ultimate Finder</TabsTrigger>
      <TabsTrigger value="capacity-estimator">Capacity</TabsTrigger>
      <TabsTrigger value="energy-rates">Energy Rates</TabsTrigger>
      <TabsTrigger value="ercot-live">ERCOT Live</TabsTrigger>
      <TabsTrigger value="ferc-data">FERC Data</TabsTrigger>
      <TabsTrigger value="usgs-data">USGS Data</TabsTrigger>
      <TabsTrigger value="environmental">Environmental</TabsTrigger>
    </TabsList>
  );
}