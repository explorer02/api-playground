import { Loader } from '~/shared/loader';

export const FullSizeLoader = () => (
  <div className="absolute inset-0 flex items-center justify-center spr-ui-02 rounded-8">
    <Loader />
  </div>
);
