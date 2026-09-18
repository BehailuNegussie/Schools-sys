export function calculateWeightedScore(hw: number, mid: number, fin: number, part: number): number {
  const weighted = hw * 0.2 + mid * 0.3 + fin * 0.4 + part * 0.1;
  return Math.round(weighted * 10) / 10;
}

export function getLetterAndGPA(score: number): { letter: string; gpa: number } {
  if (score >= 97) return { letter: 'A+', gpa: 4.0 };
  if (score >= 93) return { letter: 'A', gpa: 4.0 };
  if (score >= 90) return { letter: 'A-', gpa: 3.7 };
  if (score >= 87) return { letter: 'B+', gpa: 3.3 };
  if (score >= 83) return { letter: 'B', gpa: 3.0 };
  if (score >= 80) return { letter: 'B-', gpa: 2.7 };
  if (score >= 77) return { letter: 'C+', gpa: 2.3 };
  if (score >= 73) return { letter: 'C', gpa: 2.0 };
  if (score >= 70) return { letter: 'C-', gpa: 1.7 };
  if (score >= 65) return { letter: 'D', gpa: 1.0 };
  return { letter: 'F', gpa: 0.0 };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join(
      '\n'
    );
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
