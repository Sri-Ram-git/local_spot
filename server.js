import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/api/listings', async (req, res) => {
  const { category } = req.query;
  const listings = await prisma.listing.findMany({
    where: category ? { category } : {},
  });
  res.json(listings);
});

app.post('/api/listings', async (req, res) => {
  const { title, description, category, price, lat, lng } = req.body;
  try {
    const newListing = await prisma.listing.create({
      data: { title, description, category, price: parseFloat(price), lat, lng }
    });
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ error: "Failed to create listing" });
  }
});

app.post('/api/bookings', async (req, res) => {
  const { listingId } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: { listingId }
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: "Booking failed" });
  }
});

app.get('/api/bookings', async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: { listing: true }
  });
  res.json(bookings);
});

app.delete('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.booking.deleteMany({ where: { listingId: Number(id) } });
    await prisma.listing.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: "Failed to delete listing" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server sprinting on port ${PORT}`));
