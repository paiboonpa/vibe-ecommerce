import { render, screen, waitFor } from '@testing-library/react';
import ProductPage from '../page';
import { getProductById } from '@/lib/products';
import { notFound } from 'next/navigation';
import ProductDetailClient from '../product-detail-client';

// Mock a server component that Next.js would typically handle
jest.mock('../product-detail-client', () => {
  return jest.fn(({ product }) => (
    <div data-testid="product-detail-client">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  ));
});

jest.mock('@/lib/products', () => ({
  getProductById: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('ProductPage', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    image: '/test-image.jpg',
    category: 'Test Category',
    stock: 10,
    is_active: true,
    created_at: new Date().toISOString(),
    category_id: 'cat1',
    image_url: '/test-image.jpg',
    categories: { name: 'Test Category' }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProductDetailClient when product is found', async () => {
    (getProductById as jest.Mock).mockResolvedValue(mockProduct);

    // ProductPage is an async Server Component, so we need to handle the promise it returns
    const PageComponent = await ProductPage({ params: { id: '1' } });
    render(PageComponent);

    await waitFor(() => {
      expect(ProductDetailClient).toHaveBeenCalledWith({ product: mockProduct }, {});
    });

    const productDetailClient = screen.getByTestId('product-detail-client');
    expect(productDetailClient).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should call notFound when product is not found', async () => {
    (getProductById as jest.Mock).mockResolvedValue(null);

    // As ProductPage directly calls notFound which throws an error,
    // we need to catch this error.
    try {
      await ProductPage({ params: { id: '1' } });
    } catch (e: any) {
      // Check if the error is a result of notFound() being called
      // Next.js notFound() throws a specific error that can be caught.
      // For testing, we verify that our mock was called.
    }

    // We need to await the call if ProductPage itself is async and might have internal awaits
    await waitFor(() => {
        expect(notFound).toHaveBeenCalledTimes(1);
    });
  });

  it('should call notFound when getProductById throws an error', async () => {
    (getProductById as jest.Mock).mockRejectedValue(new Error('Database error'));

    try {
      await ProductPage({ params: { id: '1' } });
    } catch (e: any) {
      // Error expected
    }

    await waitFor(() => {
      expect(notFound).toHaveBeenCalledTimes(1);
    });
  });
});
