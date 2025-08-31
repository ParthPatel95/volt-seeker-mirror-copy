import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface VoltMarketLocationDisplayProps {
  location: string;
  listingTitle: string;
}

export function VoltMarketLocationDisplay({ location, listingTitle }: VoltMarketLocationDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Property Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{listingTitle}</h3>
            <p className="text-gray-600 text-lg">{location}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Precise coordinates are not available for this listing. Contact the seller for specific location details.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}