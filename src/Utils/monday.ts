export const handleSuccessClick = (subdomain: string, boardId: number) => {
  const boardUrl = `https://${subdomain}.monday.com/boards/${boardId}`;
  console.log(boardUrl);
  window.open(boardUrl, "_blank");
  return;
};
