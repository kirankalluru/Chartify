import { useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const useChartExport = () => {
  const exportChart = useCallback(async (format: 'png' | 'svg' | 'pdf' | 'json', data?: any) => {
    const chartElement = document.querySelector('.recharts-wrapper');
    
    if (!chartElement && format !== 'json') {
      alert('No chart found to export');
      return;
    }

    switch (format) {
      case 'png':
        try {
          const canvas = await html2canvas(chartElement as HTMLElement);
          const link = document.createElement('a');
          link.download = `chart-${Date.now()}.png`;
          link.href = canvas.toDataURL();
          link.click();
        } catch (error) {
          console.error('Error exporting PNG:', error);
          alert('Failed to export chart as PNG');
        }
        break;

      case 'pdf':
        try {
          const canvas = await html2canvas(chartElement as HTMLElement);
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF();
          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save(`chart-${Date.now()}.pdf`);
        } catch (error) {
          console.error('Error exporting PDF:', error);
          alert('Failed to export chart as PDF');
        }
        break;

      case 'json':
        if (data) {
          const configData = {
            timestamp: new Date().toISOString(),
            data: data,
            version: '1.0.0'
          };
          
          const blob = new Blob([JSON.stringify(configData, null, 2)], {
            type: 'application/json'
          });
          
          const link = document.createElement('a');
          link.download = `chart-config-${Date.now()}.json`;
          link.href = URL.createObjectURL(blob);
          link.click();
        }
        break;

      default:
        alert('Export format not supported');
    }
  }, []);

  return { exportChart };
};