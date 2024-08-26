export function getNextScheduledDate(selectedDays: string[], startTime: string): string {
    const dayButtons = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const now = new Date();
    const currentDay = now.getDay();
  
    let dayIndices: number[];
  
    if (selectedDays.length === 0) {
      // If no days are selected, use the current day
      dayIndices = [currentDay];
    } else {
      dayIndices = selectedDays.map((day) => dayButtons.indexOf(day));
    }
  
    const closestDay = dayIndices.reduce((closest, day) => {
      const diff = (day - currentDay + 7) % 7;
      const closestDiff = (closest - currentDay + 7) % 7;
      return diff < closestDiff ? day : closest;
    }, dayIndices[0]);
  
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + ((closestDay - currentDay + 7) % 7));
  
    const [hours, minutes] = startTime.split(":");
    targetDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  
    return targetDate.toISOString();
  }