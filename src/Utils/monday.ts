export const handleSuccessClick = (subdomain: string, boardId: number) => {
  const boardUrl = `https://${subdomain}.monday.com/boards/${boardId}`;
  window.open(boardUrl, "_blank");
  return;
};
