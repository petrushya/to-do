export class reviseDate {
  constructor(oneDate, twoDate){
    this.oneDate = new Date(oneDate).valueOf();
    this.twoDate = twoDate ? new Date(twoDate).valueOf() : new Date().valueOf();
  }
  get equalDate(){
    const dateValue = (term) => {
      return (`${new Date(term).getFullYear()}-${new Date(term).getMonth()}-${new Date(term).getDate()}`);
    };
    return (dateValue(this.oneDate) === dateValue(this.twoDate));
  }
  get overdueTime(){
    return (new Date(this.oneDate).valueOf() < new Date(this.twoDate).valueOf());
  }
  get hourMinute(){
    const hour = new Date(this.oneDate).getHours();
    const inputHour = (0 < hour && hour < 10) ? `0${hour}` : `${hour}`;
    const minute = new Date(this.oneDate).getMinutes();
    const inputMinute = (0 < minute && minute < 10) ? `0${minute}`: `${minute}`;
    return `${inputHour}:${inputMinute}`;
  }
  get fullDate(){
    const month = new Date(this.oneDate).getMonth();
    const inputMonth = (0 < month && month < 10) ? `0${month+1}` : `${month+1}`;
    const date = new Date(this.oneDate).getDate();
    const inputDate = (0 < date && date < 10) ? `0${date}`: `${date}`;
    return (`${new Date(this.oneDate).getFullYear()}-${inputMonth}-${inputDate}`);
  }
  get sortFullDate(){
    return `${this.fullDate}T${this.hourMinute}`;
  };
  get intlFullDate(){
    return (new Intl.DateTimeFormat('en-US', {weekday: 'short',year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(this.oneDate)));
  }
  get intlHour(){
    return (new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'}).format(new Date(this.oneDate)));
  }
}
