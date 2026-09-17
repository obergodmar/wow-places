import { act, render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { ViewComponent } from './view-component';

it('starts loading immediately and ignores a previous scene after navigation', () => {
    vi.useFakeTimers();
    const images: { src: string; onload: (() => void) | null }[] = [];
    vi.stubGlobal(
        'Image',
        class {
            src = '';
            onload: (() => void) | null = null;
            constructor() {
                images.push(this);
            }
        },
    );
    const { container, rerender, unmount } = render(<ViewComponent src="/media/first.jpg" />);
    expect(images[0].src).toBe('/media/first.jpg');
    rerender(<ViewComponent src="/media/second.jpg" />);
    expect(images[0].onload).toBeNull();
    expect(images[1].src).toBe('/media/second.jpg');
    act(() => images[1].onload?.());
    expect(container.querySelector('.view')).toHaveStyle({
        backgroundImage: 'url("/media/second.jpg")',
    });
    unmount();
    expect(images[1].onload).toBeNull();
});
