// data/services.ts
//
// This is the price list. Edit this file to add, remove, or change a
// service — nothing else needs to change.
//
// Field notes:
//   id               stable slug, don't reuse after deleting a service
//   name             shown in large type
//   price            whole dollars
//   description      optional, shown smaller under the name
//   isStartingPrice  optional, renders "starting at $X" instead of "$X"
//   active           set false to hide without deleting (e.g. seasonal)
//   sortOrder        controls display order, low to high
//   screens          which wall TV(s) show this row: [1], [2], or [1, 2]

export type Service = {
  id: string;
  name: string;
  price: number;
  description?: string;
  isStartingPrice?: boolean;
  active: boolean;
  sortOrder: number;
  screens: number[];
};

export const services: Service[] = [
  {
    id: "regular-cut",
    name: "Regular Cut",
    price: 35,
    active: true,
    sortOrder: 10,
    screens: [1, 2],
  },
  {
    id: "special-cut",
    name: "Special Cut",
    price: 40,
    description: "Long hair styles, afros, cuts that demand more time",
    active: true,
    sortOrder: 20,
    screens: [1, 2],
  },
  {
    id: "senior-cut",
    name: "Senior Cut",
    price: 28,
    active: true,
    sortOrder: 30,
    screens: [1],
  },
  {
    id: "kids-cut",
    name: "Kids Cut",
    price: 33,
    active: true,
    sortOrder: 40,
    screens: [1],
  },
  {
    id: "beard-trim-cut",
    name: "Beard Trim w/Cut",
    price: 46,
    active: true,
    sortOrder: 50,
    screens: [1, 2],
  },
  {
    id: "specialty-cut",
    name: "Specialty Cut",
    price: 52,
    active: true,
    sortOrder: 60,
    screens: [1],
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    price: 30,
    active: true,
    sortOrder: 70,
    screens: [1],
  },
  {
    id: "line-up",
    name: "Line Up",
    price: 25,
    active: true,
    sortOrder: 80,
    screens: [1, 2],
  },
  {
    id: "line-up-beard-trim",
    name: "Line Up w/Beard Trim",
    price: 40,
    active: true,
    sortOrder: 90,
    screens: [1],
  },
  {
    id: "head-shave",
    name: "Head Shave",
    price: 25,
    description: "Foil shaver",
    active: true,
    sortOrder: 100,
    screens: [1, 2],
  },
  {
    id: "head-shave-beard-trim",
    name: "Head Shave w/Beard Trim",
    price: 40,
    active: true,
    sortOrder: 110,
    screens: [1],
  },
  {
    id: "design",
    name: "Design",
    price: 7,
    isStartingPrice: true,
    active: true,
    sortOrder: 120,
    screens: [1],
  },
  {
    id: "skip-the-line",
    name: "Big Hit Skip the Line",
    price: 100,
    active: true,
    sortOrder: 130,
    screens: [1, 2],
  },
];
