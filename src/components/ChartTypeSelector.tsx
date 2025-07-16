import React from 'react';
import { BarChart3, LineChart, PieChart, ChartScatter as Scatter, TrendingUp, Donut as Doughnut, Radar, Triangle, TreePine, BarChart2, Target } from 'lucide-react';

export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'donut' | 'radar' | 'funnel' | 'treemap' | 'composed' | 'radialBar';

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  dataColumns: string[];
}

const chartTypes = [
  { 
    type: 'bar' as ChartType, 
    name: 'Bar Chart', 
    icon: BarChart3, 
    description: 'Compare values across categories',
    recommended: ['categorical', 'numerical']
  },
  { 
    type: 'line' as ChartType, 
    name: 'Line Chart', 
    icon: LineChart, 
    description: 'Show trends over time',
    recommended: ['time', 'numerical']
  },
  { 
    type: 'pie' as ChartType, 
    name: 'Pie Chart', 
    icon: PieChart, 
    description: 'Show proportions of a whole',
    recommended: ['categorical', 'percentage']
  },
  { 
    type: 'scatter' as ChartType, 
    name: 'Scatter Plot', 
    icon: Scatter, 
    description: 'Explore relationships between variables',
    recommended: ['numerical', 'correlation']
  },
  { 
    type: 'area' as ChartType, 
    name: 'Area Chart', 
    icon: TrendingUp, 
    description: 'Show trends with filled areas',
    recommended: ['time', 'cumulative']
  },
  { 
    type: 'donut' as ChartType, 
    name: 'Donut Chart', 
    icon: Doughnut, 
    description: 'Pie chart with center space for additional info',
    recommended: ['categorical', 'percentage']
  },
  { 
    type: 'radar' as ChartType, 
    name: 'Radar Chart', 
    icon: Radar, 
    description: 'Compare multiple variables in a circular format',
    recommended: ['multivariate', 'comparison']
  },
  { 
    type: 'funnel' as ChartType, 
    name: 'Funnel Chart', 
    icon: Triangle, 
    description: 'Show progressive reduction of data',
    recommended: ['process', 'conversion']
  },
  { 
    type: 'treemap' as ChartType, 
    name: 'Treemap', 
    icon: TreePine, 
    description: 'Display hierarchical data as nested rectangles',
    recommended: ['hierarchical', 'proportional']
  },
  { 
    type: 'composed' as ChartType, 
    name: 'Composed Chart', 
    icon: BarChart2, 
    description: 'Combine multiple chart types in one view',
    recommended: ['mixed', 'comparison']
  },
  { 
    type: 'radialBar' as ChartType, 
    name: 'Radial Bar', 
    icon: Target, 
    description: 'Circular bar chart for progress or comparison',
    recommended: ['progress', 'circular']
  }
];

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  dataColumns
}) => {
  const getRecommendedType = (): ChartType => {
    // Simple heuristic for chart type recommendation
    const hasTimeColumn = dataColumns.some(col => 
      col.toLowerCase().includes('date') || 
      col.toLowerCase().includes('time') || 
      col.toLowerCase().includes('year')
    );
    
    const numericalColumns = dataColumns.filter(col => 
      col.toLowerCase().includes('amount') || 
      col.toLowerCase().includes('value') || 
      col.toLowerCase().includes('price') ||
      col.toLowerCase().includes('count')
    );
    
    if (hasTimeColumn) return 'line';
    if (numericalColumns.length >= 2) return 'scatter';
    return 'bar';
  };

  const recommendedType = getRecommendedType();

  return (
    <div className=" bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 theme-transition">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Select Chart Type
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {chartTypes.map(({ type, name, icon: Icon, description }) => (
          <button
            key={type}
            onClick={() => onTypeChange(type)}
            className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md hover:scale-105 ${
              selectedType === type
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            {type === recommendedType && (
              <div className="absolute -top-2 -right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full animate-pulse">
                Recommended
              </div>
            )}
            
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full transition-all duration-200 ${
                selectedType === type
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white">{name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      </div>
    </div>
  );
};