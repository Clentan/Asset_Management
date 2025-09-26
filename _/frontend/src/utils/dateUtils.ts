export const greetUser = (): string => {
    const hours = new Date().getHours();
    if(hours < 12) {
      return "Good Morning"
    } else if (hours < 17) {
      return "Good Afternoon"
    } else {
      return "Good Evening"
    }
  };

export const getTodayFullDate = (): string => {
    const date = new Date(
        Date.UTC(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
      );
    
      const today_date = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "Africa/Johannesburg",
      }).format(date);

      return today_date
}