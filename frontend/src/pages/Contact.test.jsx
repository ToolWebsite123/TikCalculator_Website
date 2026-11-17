import React from 'react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import '../i18n';
import Contact, { CONTACT_FORM_LIMITS } from './Contact';
import * as api from '../utils/api';

const renderContact = (props = {}) =>
  render(
    <MemoryRouter initialEntries={['/contact']}>
      <Contact {...props} />
    </MemoryRouter>
  );

describe('Contact Page Safety, Validation & Honest Delivery Behavior (KHK-11)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps form strictly disabled in default unconfigured mode without inventing emails or faking submission', async () => {
    const submitSpy = vi.spyOn(api, 'submitContactMessage');
    renderContact();

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Contact Us/i);
    expect(screen.getByRole('status')).toHaveTextContent(/unavailable/i);
    expect(screen.getByRole('status')).toHaveTextContent(/does not collect, store, or transmit/i);

    const nameInput = screen.getByLabelText(/^Name/i);
    const emailInput = screen.getByLabelText(/^Email/i);
    const subjectInput = screen.getByLabelText(/Subject/i);
    const messageInput = screen.getByLabelText(/^Message/i);
    const submitBtn = screen.getByRole('button', { name: /Submission Currently Unavailable/i });

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(subjectInput).toBeDisabled();
    expect(messageInput).toBeDisabled();
    expect(submitBtn).toBeDisabled();

    // Even if DOM form submit fires programmatically, nothing is sent or faked
    fireEvent.submit(submitBtn.closest('form'));
    expect(submitSpy).not.toHaveBeenCalled();
    expect(screen.queryByText(/sent successfully/i)).not.toBeInTheDocument();

    // Helpful self-service links exist cleanly
    expect(screen.getByRole('link', { name: /Frequently Asked Questions/i })).toHaveAttribute('href', '/faq');
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /Terms & Conditions/i })).toHaveAttribute('href', '/terms');
  });

  it('validates empty fields, invalid email, and oversized messages when enabled', async () => {
    const submitSpy = vi.spyOn(api, 'submitContactMessage');
    renderContact({ enabled: true });

    const submitBtn = screen.getByRole('button', { name: /Send Message/i });
    expect(submitBtn).not.toBeDisabled();

    // 1. Empty fields
    fireEvent.click(submitBtn);
    expect(await screen.findByText(/at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/between 10 and 2,000 characters/i)).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();

    // 2. Invalid email + oversized message
    fireEvent.change(screen.getByLabelText(/^Name/i), { target: { value: 'Alex' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'bad-email' } });
    fireEvent.change(screen.getByLabelText(/^Message/i), {
      target: { value: 'x'.repeat(CONTACT_FORM_LIMITS.messageMax + 1) },
    });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/between 10 and 2,000 characters/i)).toBeInTheDocument();
    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('shows honest success only on real 200 delivery and honest errors on 429/502/503 failure', async () => {
    const submitSpy = vi
      .spyOn(api, 'submitContactMessage')
      .mockRejectedValueOnce(Object.assign(new Error('Rate limited'), { status: 429, response: { status: 429 } }))
      .mockRejectedValueOnce(Object.assign(new Error('Provider down'), { status: 502, response: { status: 502 } }))
      .mockResolvedValueOnce({ success: true, message: 'Your message has been delivered.' });

    renderContact({ enabled: true });

    fireEvent.change(screen.getByLabelText(/^Name/i), { target: { value: 'Creator One' } });
    fireEvent.change(screen.getByLabelText(/^Email/i), { target: { value: 'creator@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Formula question' } });
    fireEvent.change(screen.getByLabelText(/^Message/i), {
      target: { value: 'Could you clarify how regional CPM multipliers work?' },
    });

    const submitBtn = screen.getByRole('button', { name: /Send Message/i });

    // 429 rate-limit response -> never fakes success
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Too many submissions/i);
    });
    expect(screen.queryByText(/sent successfully/i)).not.toBeInTheDocument();

    // 502 provider failure -> never fakes success
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Unable to send your message/i);
    });

    // Real 200 success -> shows delivered notice and resets fields
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/sent successfully/i);
    });
    expect(submitSpy).toHaveBeenCalledTimes(3);
    expect(screen.getByLabelText(/^Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/^Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/^Message/i)).toHaveValue('');
  });
});

