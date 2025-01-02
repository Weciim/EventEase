export const headerLinks = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Packs",
    route: "/packs",
  },
  {
    label: "Furnitures",
    route: "/furnitures",
  },
  {
    label: "Add Furniture",
    route: "/furnitures/create",
  },
  {
    label: "My Profile",
    route: "/profile",
  },
];

export const eventDefaultValues = {
  title: "",
  description: "",
  location: "",
  imageUrl: "",
  startDateTime: new Date(),
  endDateTime: new Date(),
  categoryId: "",
  price: "",
  isFree: false,
  url: "",
};
