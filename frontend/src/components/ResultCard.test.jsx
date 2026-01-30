import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import ResultCard from './ResultCard';
import '@testing-library/jest-dom';

describe('ResultCard', () => {
  it('renders snapshot with data', () => {
    const { container } = render(
      <ResultCard
        shareId="abc123"
        result={{
          perVideoNet: 123.45,
          monthlyNet: 987.65,
          perVideoGross: 200,
          impressionsPerVideo: 100000,
          thousands: 100,
          usedCPM: 20,
          platformShare: 0.4,
          formatted: {
            perVideoNet: '$123.45',
            monthlyNet: '$987.65',
            perVideoGross: '$200',
            impressionsPerVideo: '100K',
            usedCPM: '$20',
            platformShare: '40%',
          },
        }}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

