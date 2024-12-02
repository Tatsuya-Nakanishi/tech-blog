import { render } from '@testing-library/react';
import { useLoading } from '@/contexts/LoadingContext';
import GlobalLoading from './index';

// LoadingContextのモック
jest.mock('@/contexts/LoadingContext');
const mockUseLoading = useLoading as jest.Mock;

describe('GlobalLoading', () => {
  it('isLoadingがtrueの場合、LoadingUIを表示する', () => {
    mockUseLoading.mockReturnValue({ isLoading: true });
    const { container } = render(<GlobalLoading />);
    expect(container.firstChild).not.toBeNull();
  });

  it('isLoadingがfalseの場合、何も表示しない', () => {
    mockUseLoading.mockReturnValue({ isLoading: false });
    const { container } = render(<GlobalLoading />);
    expect(container.firstChild).toBeNull();
  });
});
