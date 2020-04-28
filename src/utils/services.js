export const renderSize = (item) => {
  switch (Number(item)) {
    case 0:
      return "XXS";
    case 1:
      return "XS";
    case 2:
      return "S";
    case 3:
      return "M";
    case 4:
      return "L";
    case 5:
      return "XL";
    case 6:
      return "XXL";
    case 7:
      return "XXXL";
    case 8:
      return "XXXXL";
    default:
      return "";
  }
};
