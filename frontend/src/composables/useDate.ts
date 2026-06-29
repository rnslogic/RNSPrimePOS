export function useDate() {
  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      // YYYY-MM-DD to DD-MM-YY
      const year = parts[0].substring(2, 4); // gets 'yy'
      return `${parts[2]}-${parts[1]}-${year}`;
    }
    return dateString;
  }

  function formatTime(timeString: string | null | undefined): string {
    if (!timeString) return "";
    // e.g. "17:29:29.399130"
    const parts = timeString.split(":");
    if (parts.length >= 2) {
      // Returns "HH:mm"
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  }

  return {
    formatDate,
    formatTime,
  };
}
