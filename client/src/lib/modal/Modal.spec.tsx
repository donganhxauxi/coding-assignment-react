import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal, { ModalProps } from './Modal';

describe('Modal Component', () => {
  const defaultProps: ModalProps = {
    show: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal Content</div>,
  };

  it('renders the Modal component when show is true', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render the Modal component when show is false', () => {
    render(<Modal {...defaultProps} show={false} />);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByText('×'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when the background is clicked', () => {
    render(<Modal {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
