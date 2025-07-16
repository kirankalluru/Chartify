import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ParsedData {
  data: any[];
  columns: string[];
  error: string | null;
}

export const useFileParser = () => {
  const [parsedData, setParsedData] = useState<ParsedData>({
    data: [],
    columns: [],
    error: null
  });
  const [isLoading, setIsLoading] = useState(false);

  const parseFile = useCallback((file: File) => {
    setIsLoading(true);
    setParsedData({ data: [], columns: [], error: null });

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      parseCSVFile(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      parseExcelFile(file);
    } else {
      setIsLoading(false);
      setParsedData({
        data: [],
        columns: [],
        error: 'Unsupported file format. Please upload CSV or Excel files.'
      });
    }
  }, []);

  const parseCSVFile = useCallback((file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsLoading(false);
        
        if (results.errors.length > 0) {
          setParsedData({
            data: [],
            columns: [],
            error: results.errors[0].message
          });
          return;
        }

        const columns = results.meta.fields || [];
        const data = results.data as any[];

        if (data.length === 0) {
          setParsedData({
            data: [],
            columns: [],
            error: 'No data found in CSV file'
          });
          return;
        }

        setParsedData({
          data,
          columns,
          error: null
        });
      },
      error: (error) => {
        setIsLoading(false);
        setParsedData({
          data: [],
          columns: [],
          error: error.message
        });
      }
    });
  }, []);

  const parseExcelFile = useCallback((file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          setIsLoading(false);
          setParsedData({
            data: [],
            columns: [],
            error: 'No worksheets found in Excel file'
          });
          return;
        }

        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          setIsLoading(false);
          setParsedData({
            data: [],
            columns: [],
            error: 'No data found in Excel file'
          });
          return;
        }

        // Extract headers from first row
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1);
        
        // Convert to object format
        const formattedData = dataRows.map((row: any[]) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        }).filter(row => Object.values(row).some(val => val !== ''));

        setIsLoading(false);
        setParsedData({
          data: formattedData,
          columns: headers,
          error: null
        });
      } catch (error) {
        setIsLoading(false);
        setParsedData({
          data: [],
          columns: [],
          error: `Error parsing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      setParsedData({
        data: [],
        columns: [],
        error: 'Error reading file'
      });
    };
    
    reader.readAsArrayBuffer(file);
  }, []);

  const resetData = useCallback(() => {
    setParsedData({ data: [], columns: [], error: null });
  }, []);

  return {
    parsedData,
    isLoading,
    parseFile,
    resetData
  };
};