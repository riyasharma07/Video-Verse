/* eslint-disable prettier/prettier */
jest.mock('fluent-ffmpeg', () => {
    return jest.fn(() => ({
      setStartTime: jest.fn().mockReturnThis(),
      setDuration: jest.fn().mockReturnThis(),
      output: jest.fn().mockReturnThis(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'end') callback(); // Simulate successful processing
        return this;
      }),
      run: jest.fn(),
      input: jest.fn().mockReturnThis(),
      mergeToFile: jest.fn().mockReturnThis(),
    }));
  });
  