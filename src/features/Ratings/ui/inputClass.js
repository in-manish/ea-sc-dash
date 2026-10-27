export const inputClass = (invalid) =>
  `w-full h-10 px-3 border rounded-md text-sm bg-bg-primary text-text-primary focus:outline-none focus:ring-2 ${
    invalid
      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
      : 'border-border focus:ring-accent/20 focus:border-accent'
  }`;
