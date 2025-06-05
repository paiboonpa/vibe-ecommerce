import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetailClient from '../product-detail-client';
import { useCart } from '@/contexts/cart-context';
import type { Product } from '@/lib/types';

// Mock the useCart hook
jest.mock('@/contexts/cart-context', () => ({
  useCart: jest.fn(),
}));

// Mock window.alert
global.alert = jest.fn();

describe('ProductDetailClient', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Awesome T-Shirt',
    description: 'A really cool t-shirt for coding.',
    price: 599,
    image: '/images/t-shirt.jpg',
    category: 'Apparel',
    stock: 10,
    is_active: true,
    created_at: new Date().toISOString(),
    category_id: 'cat_apparel',
    image_url: '/images/t-shirt.jpg',
    categories: { name: 'Apparel' }
  };

  const mockAddToCart = jest.fn();

  beforeEach(() => {
    (useCart as jest.Mock).mockReturnValue({
      addToCart: mockAddToCart,
    });
    jest.clearAllMocks();
  });

  it('renders product details correctly', () => {
    render(<ProductDetailClient product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(`฿${mockProduct.price.toLocaleString()}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(`สินค้าคงเหลือ: ${mockProduct.stock} ชิ้น`)).toBeInTheDocument();
  });

  it('initial quantity is 1', () => {
    render(<ProductDetailClient product={mockProduct} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('increments quantity when plus button is clicked', async () => {
    render(<ProductDetailClient product={mockProduct} />);
    const incrementButton = screen.getByRole('button', { name: /increment quantity/i }); // Assuming an accessible name
    await userEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrements quantity when minus button is clicked', async () => {
    render(<ProductDetailClient product={mockProduct} />);
    const incrementButton = screen.getByRole('button', { name: /increment quantity/i });
    const decrementButton = screen.getByRole('button', { name: /decrement quantity/i });

    await userEvent.click(incrementButton); // Qty becomes 2
    expect(screen.getByText('2')).toBeInTheDocument();
    await userEvent.click(decrementButton); // Qty becomes 1
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('plus button is disabled when quantity reaches stock', async () => {
    const lowStockProduct = { ...mockProduct, stock: 2 };
    render(<ProductDetailClient product={lowStockProduct} />);
    const incrementButton = screen.getByRole('button', { name: /increment quantity/i });

    await userEvent.click(incrementButton); // Qty is 2
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(incrementButton).toBeDisabled();
  });

  it('minus button is disabled when quantity is 1', () => {
    render(<ProductDetailClient product={mockProduct} />);
    const decrementButton = screen.getByRole('button', { name: /decrement quantity/i });
    expect(decrementButton).toBeDisabled();
  });

  it('calls addToCart and shows alert when "เพิ่มลงตะกร้า" button is clicked', async () => {
    render(<ProductDetailClient product={mockProduct} />);
    const addToCartButton = screen.getByRole('button', { name: /เพิ่มลงตะกร้า/i });

    await userEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
    expect(global.alert).toHaveBeenCalledWith('เพิ่มสินค้าในตะกร้าแล้ว!');
  });

  it('calls addToCart with updated quantity', async () => {
    render(<ProductDetailClient product={mockProduct} />);
    const incrementButton = screen.getByRole('button', { name: /increment quantity/i });
    const addToCartButton = screen.getByRole('button', { name: /เพิ่มลงตะกร้า/i });

    await userEvent.click(incrementButton); // Qty = 2
    await userEvent.click(incrementButton); // Qty = 3
    await userEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 3);
  });

  it('"เพิ่มลงตะกร้า" button is disabled and shows "สินค้าหมด" if stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductDetailClient product={outOfStockProduct} />);

    const addToCartButton = screen.getByRole('button', { name: /สินค้าหมด/i });
    expect(addToCartButton).toBeDisabled();
    expect(screen.getByText('สินค้าคงเหลือ: 0 ชิ้น')).toBeInTheDocument();
    expect(screen.getByText('(สินค้าหมด)')).toBeInTheDocument();
  });

  it('shows "(เหลือน้อย!)" when stock is low (<= 5 and > 0)', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 };
    render(<ProductDetailClient product={lowStockProduct} />);
    expect(screen.getByText(`สินค้าคงเหลือ: ${lowStockProduct.stock} ชิ้น`)).toBeInTheDocument();
    expect(screen.getByText('(เหลือน้อย!)')).toBeInTheDocument();
  });
});
