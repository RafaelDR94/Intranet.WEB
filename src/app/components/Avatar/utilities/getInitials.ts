export const getInitials = (name: string) =>
  name
    .split(' ') 
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
