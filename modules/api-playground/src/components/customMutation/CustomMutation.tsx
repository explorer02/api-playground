//components
import { Box } from '@sprinklrjs/spaceweb/box';
import { OutputEditor } from '../customQuery/components/OutputEditor';
import { Form, useForm } from '../form';

//hooks
import { useCustomMutation } from './hooks/useCustomMutation';

//types
import { CustomMutationConfig } from '@/types';

export const CustomMutation = ({ config }: { config: CustomMutationConfig }) => {
  const { fieldConfigMap, formLayout, validator, initialValues, outputConfig } = config;

  const { loading, onSubmit, onOutputEditorMount } = useCustomMutation({ config });

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
      <OutputEditor
        title="Output"
        readOnly={outputConfig?.readOnly ?? true}
        className="flex-1"
        onMount={onOutputEditorMount}
        loading={loading}
      />
    </Box>
  );
};
