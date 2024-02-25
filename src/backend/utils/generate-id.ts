export const generateUniqueId = () => {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 100000);
  const uniqueId = parseInt(timestamp.toString() + randomNum.toString());
  return uniqueId;
};
