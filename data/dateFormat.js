class DateFormat {
  constructor(date) {
    this.date = date ? new Date(date) : new Date();
  }
  dayString() {
    return this.date.getFullYear() +
    '-' + ((this.date.getMonth() + 1).toString().length === 1 ?
    '0' + (this.date.getMonth() + 1) : (this.date.getMonth() + 1)) +
    '-' + (this.date.getDate().toString().length === 1 ?
    '0' + this.date.getDate() : this.date.getDate());
  }
  dateString() {
    return this.dayString() +
    'T' + (this.date.getHours().toString().length === 1 ?
    '0' + this.date.getHours() : this.date.getHours()) +
    ':' + (this.date.getMinutes().toString().length === 1 ?
    '0' + this.date.getMinutes() : this.date.getMinutes());
  }
  calendarDate() {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(this.date);
  }
  timesOfDay() {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(this.date);
  }
}
export default DateFormat;