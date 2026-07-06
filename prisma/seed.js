import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const listings = [
  { title: 'Quiet Study Nook', description: 'Peaceful corner with WiFi, perfect for focused work sessions. Located in a quiet residential area.', category: 'Study Desk', price: 15, lat: 28.6139, lng: 77.2090 },
  { title: 'Rooftop Study Space', description: 'Open-air study desk with scenic Delhi views. Fresh air and natural light all day.', category: 'Study Desk', price: 20, lat: 28.6300, lng: 77.2200 },
  { title: 'Library Style Desk', description: 'Silent co-working desk in a dedicated study zone. Bookshelves and ergonomic chairs.', category: 'Study Desk', price: 12, lat: 28.6000, lng: 77.1900 },
  { title: 'Catan Afternoon', description: 'Settlers of Catan board available. Coffee and snacks included. Group of 4 welcome.', category: 'Board Game', price: 25, lat: 19.0760, lng: 72.8777 },
  { title: 'Chess & Chai', description: 'Classic chess boards with masala chai. Indoor/outdoor seating in South Mumbai.', category: 'Board Game', price: 10, lat: 19.0500, lng: 72.8300 },
  { title: 'Monopoly Night', description: 'Full Monopoly set with house rules. Pizza and drinks provided. Minimum 3 players.', category: 'Board Game', price: 30, lat: 12.9716, lng: 77.5946 },
  { title: 'Weekend Garage Sale', description: 'Furniture, books, electronics. Everything must go! Saturday and Sunday only.', category: 'Garage Sale', price: 5, lat: 13.0827, lng: 80.2707 },
  { title: 'College Clearout', description: 'Graduating student selling textbooks, notes, desk lamp, and mini fridge.', category: 'Garage Sale', price: 8, lat: 28.5400, lng: 77.2000 },
  { title: 'Neighborhood Yard Sale', description: 'Kids toys, kitchenware, and clothes. Great bargains in a friendly community setup.', category: 'Garage Sale', price: 3, lat: 22.5726, lng: 88.3639 },
  { title: 'Sunset Study Deck', description: 'Study desk on a beautiful terrace overlooking the Arabian Sea. Evening slots available.', category: 'Study Desk', price: 18, lat: 19.1000, lng: 72.8600 },
];

async function main() {
  console.log('Seeding database...');
  for (const listing of listings) {
    await prisma.listing.create({ data: listing });
  }
  console.log(`Seeded ${listings.length} listings.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
