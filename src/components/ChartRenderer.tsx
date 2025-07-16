import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  RadarChart,
  Radar as RadarArea,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  FunnelChart,
  Funnel,
  LabelList,
  Treemap,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell as TreemapCell
} from 'recharts';
import { ChartType } from './ChartTypeSelector';
import { Download, Image, FileText, Settings, Info } from 'lucide-react';

interface ChartRendererProps {
  data: any[];
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  onExport: (format: 'png' | 'svg' | 'pdf' | 'json') => void;
}

const COLORS = ['#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899'];
const EXTENDED_COLORS = [
  '#3B82F6', '#14B8A6', '#F97316', '#EF4444', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899',
  '#06B6D4', '#84CC16', '#F43F5E', '#8B5A2B', '#6366F1', '#D946EF', '#0EA5E9', '#22C55E'
];

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  data,
  chartType,
  xAxis,
  yAxis,
  onExport
}) => {
  const [showLegend, setShowLegend] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  const processedData = data.map(item => ({
    ...item,
    [yAxis]: parseFloat(item[yAxis]) || 0,
    value: parseFloat(item[yAxis]) || 0,
    name: item[xAxis]
  }));

  // Process data for specific chart types
  const getRadarData = () => {
    const numericColumns = Object.keys(data[0] || {}).filter(key => 
      !isNaN(parseFloat(data[0][key]))
    );
    
    return data.slice(0, 5).map(item => {
      const radarItem: any = { name: item[xAxis] };
      numericColumns.forEach(col => {
        radarItem[col] = parseFloat(item[col]) || 0;
      });
      return radarItem;
    });
  };

  const getFunnelData = () => {
    return processedData.map((item, index) => ({
      ...item,
      fill: COLORS[index % COLORS.length]
    }));
  };

  const getTreemapData = () => {
    return processedData.map((item, index) => ({
      name: item[xAxis],
      size: Math.abs(parseFloat(item[yAxis])) || 1,
      fill: EXTENDED_COLORS[index % EXTENDED_COLORS.length]
    }));
  };

  const getRadialBarData = () => {
    const maxValue = Math.max(...processedData.map(item => parseFloat(item[yAxis]) || 0));
    return processedData.slice(0, 6).map((item, index) => ({
      name: item[xAxis],
      value: parseFloat(item[yAxis]) || 0,
      fill: EXTENDED_COLORS[index % EXTENDED_COLORS.length],
      percentage: ((parseFloat(item[yAxis]) || 0) / maxValue) * 100
    }));
  };

  const renderChart = () => {
    const commonProps = {
      width: 800,
      height: 400,
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar dataKey={yAxis} fill="#3B82F6" />
          </BarChart>
        );
      
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Line type="monotone" dataKey={yAxis} stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        );
      
      case 'pie':
        return (
          <PieChart width={400} height={400}>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yAxis}
              nameKey={xAxis}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        );
      
      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Scatter dataKey={yAxis} fill="#3B82F6" />
          </ScatterChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Area type="monotone" dataKey={yAxis} stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
          </AreaChart>
        );
      
      case 'donut':
        return (
          <PieChart width={400} height={400}>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={40}
              fill="#8884d8"
              dataKey={yAxis}
              nameKey={xAxis}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            {showLegend && <Legend />}
          </PieChart>
        );
      
      case 'radar':
        const radarData = getRadarData();
        const radarKeys = Object.keys(radarData[0] || {}).filter(key => key !== 'name');
        
        return (
          <RadarChart width={400} height={400} data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" />
            <PolarRadiusAxis />
            {radarKeys.slice(0, 3).map((key, index) => (
              <RadarArea
                key={key}
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
            <Tooltip />
            {showLegend && <Legend />}
          </RadarChart>
        );
      
      case 'funnel':
        return (
          <FunnelChart width={400} height={400}>
            <Tooltip />
            <Funnel
              dataKey={yAxis}
              data={getFunnelData()}
              isAnimationActive
            >
              <LabelList position="center" fill="#fff" stroke="none" />
            </Funnel>
          </FunnelChart>
        );
      
      case 'treemap':
        return (
          <Treemap
            width={600}
            height={400}
            data={getTreemapData()}
            dataKey="size"
            ratio={4/3}
            stroke="#fff"
            fill="#8884d8"
          >
            <Tooltip />
          </Treemap>
        );
      
      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar dataKey={yAxis} fill="#3B82F6" />
            <Line type="monotone" dataKey={yAxis} stroke="#F97316" strokeWidth={2} />
          </ComposedChart>
        );
      
      case 'radialBar':
        return (
          <RadialBarChart width={400} height={400} data={getRadialBarData()}>
            <RadialBar
              minAngle={15}
              label={{ position: 'insideStart', fill: '#fff' }}
              background
              clockWise
              dataKey="value"
            />
            <Tooltip />
            {showLegend && <Legend />}
          </RadialBarChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chart Visualization</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {chartType === 'donut' ? 'Donut' : 
             chartType === 'radialBar' ? 'Radial Bar' : 
             chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart showing {yAxis} by {xAxis}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded-lg transition-all duration-200 border ${
                showGrid 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title="Toggle Grid"
            >
              <Settings className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => setShowLegend(!showLegend)}
              className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 border ${
                showLegend 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Legend
            </button>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onExport('png')}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              title="Export as PNG"
            >
              <Image className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onExport('pdf')}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              title="Export as PDF"
            >
              <FileText className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onExport('json')}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
              title="Export Configuration"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {(chartType === 'radar' || chartType === 'treemap') && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-medium">
                  {chartType === 'radar' ? 'Radar Chart Info:' : 'Treemap Info:'}
                </p>
                <p className="text-blue-700 dark:text-blue-300">
                  {chartType === 'radar' 
                    ? 'Shows multiple numeric variables for comparison. Using first 5 rows and up to 3 numeric columns.'
                    : 'Displays hierarchical data as nested rectangles. Rectangle size represents the data value.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="w-full overflow-x-auto">
          <ResponsiveContainer width="100%" height={chartType === 'treemap' ? 400 : 400}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};