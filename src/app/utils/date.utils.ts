
export class DateUtils {
  static formatToApiDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static parseFromApiDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  static formatToInputDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static parseFromInputDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00');
  }
}
