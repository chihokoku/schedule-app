export function createCalendear(year, month) {
  const first = new Date(year, month - 1, 1).getDay();

  return [0, 1, 2, 3, 4, 5].map((weekIndex) => {
    return [0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
      const day = dayIndex + 1 + weekIndex * 7;
      return day - first;
    });
  });
}

export function zeroPadding(num) {
  return ("0" + num).slice(-2);
}
