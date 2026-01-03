export const isValidEmail = (email?: string): boolean => {
  if (!email) return false;
  // Simple, permissive email regex sufficient for client-side validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default isValidEmail;
