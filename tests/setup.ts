import '@testing-library/jest-dom'
import * as fc from 'fast-check'

// fast-check global configuration
fc.configureGlobal({
  numRuns: 100,
  seed: 42,
  verbose: true,
})
