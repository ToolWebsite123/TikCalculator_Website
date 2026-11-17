import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../i18n';
import Home from './Home';
import Calculator from './Calculator';
import * as api from '../utils/api';
import '@testing-library/jest-dom';

const SHARED_BACKEND_RESPONSE = {
  success: true,
  username: 'parity_creator',
  profile: {
    username: 'parity_creator',
    fullName: 'Parity Creator',
    verified: true,
    followers: 250000,
    following: 85,
    likes: 10000000,
    videos: 200,
    bio: 'Creator economy benchmarks',
    region: 'US',
    tiktokId: '6800000000000000000',
  },
  earningsData: {
    avgViews: 50000,
    engagementRate: 9.0,
    cpm: 34.99,
    cpmMin: 25.66,
    cpmMax: 48.99,
    platformFactor: 1.0,
    estimatedEarnings: 1749.5,
    earningPerVideo: 1749.5,
    earningsMin: 1283.0,
    earningsMax: 2449.5,
    analytics: {
      avgViews: 50000,
      engagementRate: 9.0,
      sampleSize: 30,
    },
  },
  analytics: {
    avgViews: 50000,
    engagementRate: 9.0,
    sampleSize: 30,
  },
};

describe('/calculator Authoritative Backend Alignment (KHK-08)', () => {
  afterEach(async () => {
    vi.restoreAllMocks();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('displays the exact same authoritative backend earnings estimate as the Homepage (/)', async () => {
    vi.spyOn(api, 'fetchTikTokStats').mockResolvedValueOnce(SHARED_BACKEND_RESPONSE);
    vi.spyOn(api, 'fetchTikTokProfile').mockResolvedValueOnce(SHARED_BACKEND_RESPONSE);

    const homeRender = render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/TikTok username input/i), {
      target: { value: '@parity_creator' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate Sponsorship Value$/i }));

    await waitFor(() => {
      expect(screen.getByText('$1,749.50')).toBeInTheDocument();
    });

    const homeEarningsText = screen.getByLabelText('Estimated TikTok earnings: $1,749.50').textContent;
    const homeRangeText = screen.getByText('$1,283.00 – $2,449.50').textContent;
    const homeCpmText = screen.getByText('$25.66 – $48.99').textContent;

    homeRender.unmount();

    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );

    // SEO metadata: noindex, follow on duplicate /calculator route while preserving canonical
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://www.kalkulatortik.com/calculator'
    );

    fireEvent.change(screen.getByLabelText(/TikTok username/i), {
      target: { value: '@parity_creator' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    await waitFor(() => {
      expect(screen.getByText('$1,749.50')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Estimated TikTok earnings: $1,749.50').textContent).toBe(
      homeEarningsText
    );
    expect(screen.getByText('$1,283.00 – $2,449.50').textContent).toBe(homeRangeText);
    expect(screen.getByText('$25.66 – $48.99').textContent).toBe(homeCpmText);
    expect(screen.getByText('50K')).toBeInTheDocument();
    expect(screen.getByText('9.00%')).toBeInTheDocument();
  });

  it('uses authoritative backend earnings after cache-refresh without recalculating legacy CPM', async () => {
    const clearSpy = vi.spyOn(api, 'clearTikTokCache').mockResolvedValueOnce({ success: true });
    const profileSpy = vi
      .spyOn(api, 'fetchTikTokProfile')
      .mockResolvedValueOnce(SHARED_BACKEND_RESPONSE)
      .mockResolvedValueOnce({
        ...SHARED_BACKEND_RESPONSE,
        earningsData: {
          ...SHARED_BACKEND_RESPONSE.earningsData,
          avgViews: 60000,
          estimatedEarnings: 2100.0,
          earningPerVideo: 2100.0,
          earningsMin: 1540.0,
          earningsMax: 2940.0,
        },
      });

    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/TikTok username/i), {
      target: { value: 'parity_creator' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    await waitFor(() => {
      expect(screen.getByText('$1,749.50')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Refresh Data/i }));

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalledWith('parity_creator');
      expect(profileSpy).toHaveBeenLastCalledWith(
        'parity_creator',
        { refresh: 'true' },
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(screen.getByText('$2,100.00')).toBeInTheDocument();
    });
  });

  it('shows an honest error without fabricating estimates on API failure or missing/invalid earningsData', async () => {
    vi.spyOn(api, 'fetchTikTokProfile')
      .mockRejectedValueOnce({ status: 404, response: { status: 404 } })
      .mockResolvedValueOnce({
        success: true,
        profile: { username: 'incomplete_creator', followers: 10000 },
        earningsData: null,
      })
      .mockResolvedValueOnce({
        success: true,
        profile: { username: 'corrupt_creator', followers: 10000 },
        earningsData: { estimatedEarnings: 'invalid' },
      });

    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );

    const input = screen.getByLabelText(/TikTok username/i);
    const submitBtn = screen.getByRole('button', { name: /^Calculate$/i });

    fireEvent.change(input, { target: { value: 'unknown_user' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /Unable to find public data for "@unknown_user"/i
      );
    });
    expect(screen.queryByText(/ESTIMATED SPONSORSHIP VALUE PER VIDEO/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'incomplete_creator' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /Unable to retrieve profile data right now/i
      );
    });
    expect(screen.queryByText(/ESTIMATED SPONSORSHIP VALUE PER VIDEO/i)).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'corrupt_creator' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        /Unable to retrieve profile data right now/i
      );
    });
    expect(screen.queryByText('$0.00')).not.toBeInTheDocument();
  });

  it('preserves identical authoritative estimate when Refresh Data receives the same backend response', async () => {
    const clearSpy = vi.spyOn(api, 'clearTikTokCache').mockResolvedValueOnce({ success: true });
    vi.spyOn(api, 'fetchTikTokProfile')
      .mockResolvedValueOnce(SHARED_BACKEND_RESPONSE)
      .mockResolvedValueOnce(SHARED_BACKEND_RESPONSE);

    render(
      <BrowserRouter>
        <Calculator />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/TikTok username/i), {
      target: { value: 'parity_creator' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^Calculate$/i }));

    await waitFor(() => {
      expect(screen.getByText('$1,749.50')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Refresh Data/i }));

    await waitFor(() => {
      expect(clearSpy).toHaveBeenCalledWith('parity_creator');
      expect(screen.getByText('$1,749.50')).toBeInTheDocument();
    });
  });
});
