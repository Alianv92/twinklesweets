// src/lib/products.ts
export type Product = {
  id: string;
  name: string;
  price: number;   // price in cents
  image: string;   // path in /public
};

export const PRODUCTS: Product[] = [
  { id: "topper-custom",  name: "Custom Cake Topper",    price: 2200, image: "/Product1.png" },
  { id: "boxes-decor",    name: "Decorated Treat Boxes", price: 3500, image: "/Product2.png" },
  { id: "favor-pack",     name: "Event Favor Packaging", price: 2900, image: "/Product3.png" },
  { id: "party-set",      name: "Themed Party Set",      price: 5900, image: "/Product4.png" },
  { id: "name-number",    name: "Name & Number Topper",  price: 2500, image: "/Product5.png" },
  { id: "special-decor",  name: "Special Occasion Décor",price: 4500, image: "/Product6.png" },
];