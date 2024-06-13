export const getImageUrl = (imgPath: string) => {
  if (!imgPath || imgPath.length === 0) {
    return null;
  }
  return require(`../Static/images/${imgPath}.png`);
};
