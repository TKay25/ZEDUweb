import React, { useState } from 'react';
import {
  ComposableMap, Geographies, Geography, Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import Select from '../ui/Select';
import {
  ZoomIn, ZoomOut, RefreshCw,
  Download
} from 'lucide-react';

// Zimbabwe provinces geo data (simplified)
const geoUrl = "https://raw.githubusercontent.com/holtzy/react-simple-maps/master/examples/zimbabwe-provinces.json";

interface RegionalMapProps {
  data: {
    provinces: Array<{
      id: string;
      name: string;
      schools: number;
      students: number;
      teachers: number;
      passRate: number;
      coordinates: [number, number];
    }>;
    districts: Array<{
      id: string;
      name: string;
      province: string;
      schools: number;
      population: number;
      literacy: number;
      coordinates: [number, number];
    }>;
  };
  selectedMetric: 'schools' | 'students' | 'teachers' | 'passRate' | 'literacy';
  onMetricChange: (metric: string) => void;
  onRegionClick: (regionId: string, type: 'province' | 'district') => void;
  onExportMap: () => void;
}

export const RegionalMap: React.FC<RegionalMapProps> = ({
  data,
  selectedMetric,
  onMetricChange,
  onRegionClick,
  onExportMap
}) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [viewLevel, setViewLevel] = useState<'province' | 'district'>('province');

  const handleZoomIn = () => {
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.2 }));
  };

  const handleZoomOut = () => {
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.2 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const getMetricColor = (value: number, metric: string) => {
    switch (metric) {
      case 'passRate':
      case 'literacy':
        if (value >= 80) return '#10b981';
        if (value >= 60) return '#f59e0b';
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  const getMetricValue = (region: any) => {
    switch (selectedMetric) {
      case 'schools': return region.schools;
      case 'students': return region.students;
      case 'teachers': return region.teachers;
      case 'passRate': return region.passRate;
      case 'literacy': return region.literacy;
      default: return 0;
    }
  };

  // Metric options for select
  const metricOptions = [
    { value: 'schools', label: 'Schools' },
    { value: 'students', label: 'Students' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'passRate', label: 'Pass Rate' },
    { value: 'literacy', label: 'Literacy Rate' }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Regional Map of Zimbabwe</h2>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedMetric}
            onChange={(e) => onMetricChange(e.target.value)}
            options={metricOptions}
            className="w-40"
          />
          <Button variant="outline" size="sm" onClick={onExportMap}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Map Controls */}
      <Card className="p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500 ml-2">
            Zoom: {position.zoom.toFixed(1)}x
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewLevel === 'province' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewLevel('province')}
          >
            Provinces
          </Button>
          <Button
            variant={viewLevel === 'district' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewLevel('district')}
          >
            Districts
          </Button>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="p-4 h-[600px] relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 3000,
            center: [29.5, -19] // Zimbabwe coordinates
          }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates as [number, number]}
            onMoveEnd={setPosition}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const province = data.provinces.find(p => p.name === geo.properties.name);
                  const metricValue = province ? getMetricValue(province) : 0;
                  const color = getMetricColor(metricValue, selectedMetric);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => onRegionClick(province?.id || '', 'province')}
                      onMouseEnter={() => setSelectedRegion(province)}
                      onMouseLeave={() => setSelectedRegion(null)}
                      style={{
                        default: {
                          fill: color,
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: "#f59e0b",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "#e67e22",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Markers for districts */}
            {viewLevel === 'district' && data.districts.map((district) => (
              <Marker
                key={district.id}
                coordinates={district.coordinates}
                onClick={() => onRegionClick(district.id, 'district')}
              >
                <circle r={6} fill="#3b82f6" stroke="#FFFFFF" strokeWidth={2} />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{ fontSize: "8px", fill: "#4b5563" }}
                >
                  {district.name}
                </text>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Info Panel */}
        {selectedRegion && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
            <h3 className="font-semibold mb-2">{selectedRegion.name}</h3>
            <div className="space-y-1 text-sm">
              <p>Schools: {selectedRegion.schools}</p>
              <p>Students: {selectedRegion.students}</p>
              <p>Teachers: {selectedRegion.teachers}</p>
              <p>Pass Rate: {selectedRegion.passRate}%</p>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow border">
          <p className="text-xs font-medium mb-2">Color Scale</p>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2" />
              <span className="text-xs">High (≥80%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-2" />
              <span className="text-xs">Medium (60-79%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2" />
              <span className="text-xs">Low (&lt;60%)</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};