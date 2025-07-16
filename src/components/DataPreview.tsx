import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface DataPreviewProps {
  data: any[];
  columns: string[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ 
  data, 
  columns, 
  isVisible, 
  onToggleVisibility 
}) => {
  if (!data.length) return null;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 theme-transition">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Preview</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {data.length} rows × {columns.length} columns
          </p>
        </div>
        <button
          onClick={onToggleVisibility}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg theme-transition border border-gray-200 dark:border-gray-700"
        >
          {isVisible ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show</span>
            </>
          )}
        </button>
      </div>
      
      {isVisible && (
        <div className="p-4 overflow-auto max-h-64">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-800">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-2 px-3 text-gray-700 dark:text-gray-300"
                    >
                      {row[column]?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 10 && (
            <div className="text-center py-3 text-sm text-gray-500 dark:text-gray-400">
              ... and {data.length - 10} more rows
            </div>
          )}
        </div>
      )}
    </div>
  );
};