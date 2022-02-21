import { render, cleanup } from '@testing-library/react';
import App from './App';
import 'jest-canvas-mock';

afterEach(cleanup)

it('should take a snapshot', () => {
   const { asFragment } = render(<App />)

   expect(asFragment(<App />)).toMatchSnapshot()
  }) 