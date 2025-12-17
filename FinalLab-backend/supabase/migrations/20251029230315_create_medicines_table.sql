/*
  # Create Medicines Management Schema

  1. New Tables
    - `medicines`
      - `id` (uuid, primary key) - Unique identifier for each medicine
      - `name` (text) - Medicine name
      - `description` (text) - Detailed description of the medicine
      - `price` (numeric) - Price of the medicine
      - `stock` (integer) - Available quantity in stock
      - `image_url` (text) - URL to medicine image
      - `category` (text) - Medicine category (e.g., Painkiller, Antibiotic)
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

    - `orders`
      - `id` (uuid, primary key) - Unique identifier for each order
      - `medicine_id` (uuid, foreign key) - Reference to medicines table
      - `customer_name` (text) - Name of the customer
      - `customer_email` (text) - Email of the customer
      - `quantity` (integer) - Quantity ordered
      - `total_price` (numeric) - Total price of the order
      - `status` (text) - Order status (pending, completed, cancelled)
      - `created_at` (timestamptz) - Order timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to medicines
    - Add policies for inserting orders
    - Add policies for admin operations (requires authentication)
*/

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url text DEFAULT '',
  category text DEFAULT 'General',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id uuid REFERENCES medicines(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  total_price numeric(10, 2) NOT NULL CHECK (total_price >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policies for medicines table
CREATE POLICY "Anyone can view medicines"
  ON medicines FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert medicines"
  ON medicines FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update medicines"
  ON medicines FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete medicines"
  ON medicines FOR DELETE
  TO authenticated
  USING (true);

-- Policies for orders table
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_orders_medicine_id ON orders(medicine_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_medicines_updated_at
  BEFORE UPDATE ON medicines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
