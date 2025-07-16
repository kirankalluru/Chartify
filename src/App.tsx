import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { ChartTypeSelector, ChartType } from './components/ChartTypeSelector';
import { AxisSelector } from './components/AxisSelector';
import { ChartRenderer } from './components/ChartRenderer';
import { useFileParser } from './hooks/useCSVParser';
import { useChartExport } from './hooks/useChartExport';
import { RefreshCw, AlertCircle } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(true);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  
  const { parsedData, isLoading, parseFile, resetData } = useFileParser();
  const { exportChart } = useChartExport();

  // Auto-detect axes when data is loaded
  useEffect(() => {
    if (parsedData.columns.length > 0) {
      setXAxis(parsedData.columns[0]);
      setYAxis(parsedData.columns[1] || parsedData.columns[0]);
    }
  }, [parsedData.columns]);

  // Dark mode persistence
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = (file: File) => {
    parseFile(file);
  };

  const handleExport = (format: 'png' | 'svg' | 'pdf' | 'json') => {
    const exportData = {
      chartType,
      xAxis,
      yAxis,
      data: parsedData.data,
      columns: parsedData.columns
    };
    exportChart(format, exportData);
  };

  const handleReset = () => {
    resetData();
    setChartType('bar');
    setXAxis('');
    setYAxis('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Transform Your Excel & CSV Data Into Beautiful Charts
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your Excel or CSV files and instantly generate interactive charts. Perfect for data analysts, 
            marketers, and anyone who needs quick data visualization.
          </p>
        </div>

        {/* Error Display */}
        {parsedData.error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200">Error Processing File</h3>
                <p className="text-sm text-red-600 dark:text-red-300">{parsedData.error}</p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload */}
        {parsedData.data.length === 0 && (
          <div className="mb-8">
            <FileUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          </div>
        )}

        {/* Data Preview and Chart Configuration */}
        {parsedData.data.length > 0 && (
          <div className="space-y-8">
            {/* Reset Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Chart Configuration
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Data Preview */}
            <DataPreview
              data={parsedData.data}
              columns={parsedData.columns}
              isVisible={showDataPreview}
              onToggleVisibility={() => setShowDataPreview(!showDataPreview)}
            />

            {/* Chart Type Selection */}
            <ChartTypeSelector
              selectedType={chartType}
              onTypeChange={setChartType}
              dataColumns={parsedData.columns}
            />

            {/* Axis Configuration */}
            <AxisSelector
              columns={parsedData.columns}
              xAxis={xAxis}
              yAxis={yAxis}
              onXAxisChange={setXAxis}
              onYAxisChange={setYAxis}
            />

            {/* Chart Visualization */}
            {xAxis && yAxis && (
              <ChartRenderer
                data={parsedData.data}
                chartType={chartType}
                xAxis={xAxis}
                yAxis={yAxis}
                onExport={handleExport}
              />
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chartify - Create charts from data quickly and easily
          </p>
        </footer>
      </main>
    </div>
  );
} 

export default App;