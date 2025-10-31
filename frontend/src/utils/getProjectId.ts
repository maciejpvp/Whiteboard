export const getProjectId = () => {
  const parts = window.location.pathname.split("/");
  // /project/123 -> ["", "project", "123"]
  return parts[2]; // "123"
};
