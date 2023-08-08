//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { OutputEditor } from './components/OutputEditor';
import { Form, useForm } from '../form';

//hooks
import { useCustomQuery } from './hooks/useCustomQuery';

//types
import { CustomQueryConfig } from '@/types';

export const CustomQuery = ({ config }: { config: CustomQueryConfig }) => {
  const { fieldConfigMap, formLayout, validator, initialValues } = config;

  const { loading, onSubmit, onOutputEditorMount } = useCustomQuery({ config });

  const { onAction, values, errors } = useForm({ fieldConfigMap, validator, initialValues, onSubmit });

  return (
    <Box className="h-full flex gap-4">
      <Box className="h-full flex flex-col gap-4 flex-1">
        <Form
          fieldConfigMap={fieldConfigMap}
          layout={formLayout}
          values={values}
          errors={errors}
          onAction={onAction}
          loading={loading}
        />
      </Box>
      <OutputEditor title="Output" readOnly className="flex-1" onMount={onOutputEditorMount} loading={loading} />
    </Box>
  );
};
