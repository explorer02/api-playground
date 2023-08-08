import { Box } from '@sprinklrjs/spaceweb/box';
import { Loader } from '@sprinklrjs/spaceweb/loader';

export const FullSizeLoader = () => (
  <Box className="absolute inset-0 flex items-center justify-center">
    <Loader size={8} />
  </Box>
);
