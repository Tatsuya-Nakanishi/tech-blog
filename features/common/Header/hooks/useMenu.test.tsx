import { renderHook, act } from '@testing-library/react';
import { useMenu } from './useMenu';

describe('useMenu', () => {
  beforeEach(() => {
    // 各テストの前にイベントリスナーをクリーンアップ
    jest.clearAllMocks();
  });

  it('初期状態ではメニューが閉じている', () => {
    const { result } = renderHook(() => useMenu());
    expect(result.current.isMenuOpen).toBe(false);
  });

  it('toggleMenu関数でメニューの開閉状態が切り替わる', () => {
    const { result } = renderHook(() => useMenu());

    act(() => {
      result.current.toggleMenu();
    });
    expect(result.current.isMenuOpen).toBe(true);

    act(() => {
      result.current.toggleMenu();
    });
    expect(result.current.isMenuOpen).toBe(false);
  });

  it('メニュー要素の外側をクリックするとメニューが閉じる', () => {
    const { result } = renderHook(() => useMenu());
    const mockDiv = document.createElement('div');

    // メニューを開く
    act(() => {
      result.current.toggleMenu();
      result.current.setMenuElement(mockDiv);
    });
    expect(result.current.isMenuOpen).toBe(true);

    // メニュー外のクリックをシミュレート
    act(() => {
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(mouseEvent);
    });
    expect(result.current.isMenuOpen).toBe(false);
  });

  it('メニュー要素内のクリックではメニューは閉じない', () => {
    const { result } = renderHook(() => useMenu());
    const mockDiv = document.createElement('div');

    // メニューを開く
    act(() => {
      result.current.toggleMenu();
      result.current.setMenuElement(mockDiv);
    });
    expect(result.current.isMenuOpen).toBe(true);

    // メニュー内のクリックをシミュレート
    act(() => {
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      mockDiv.dispatchEvent(mouseEvent);
    });
    expect(result.current.isMenuOpen).toBe(true);
  });
});
