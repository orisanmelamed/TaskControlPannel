/**
 * Format date to a readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time to a readable string
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if a date is in the past
 */
export const isPastDue = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date < now;
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (Math.abs(diffInDays) >= 1) {
    const days = Math.round(Math.abs(diffInDays));
    return diffInDays > 0 
      ? `in ${days} day${days > 1 ? 's' : ''}`
      : `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.round(Math.abs(diffInHours));
    return diffInHours > 0 
      ? `in ${hours} hour${hours > 1 ? 's' : ''}`
      : `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateForInput = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toISOString().split('T')[0];
};