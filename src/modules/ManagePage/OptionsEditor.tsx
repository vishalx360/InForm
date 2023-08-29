import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import {
  ErrorMessage,
  FieldArray,
  useFormikContext,
  type FieldArrayRenderProps,
  type FormikProps,
} from "formik";
import { type QuestionType } from "./QuestionEditor";

type OptionFieldProps = {
  index: number;
  option: string;
  touched: boolean;
  error?: string;
  form: FormikProps<OptionFieldProps>;
  remove: (index: number) => void;
};

function OptionField({
  index,
  option,
  touched,
  error,
  form,
  remove,
}: OptionFieldProps) {
  return (
    <FormControl id={`options[${index}]`} isInvalid={Boolean(touched && error)}>
      <Stack direction="row">
        <Input
          autoComplete="off"
          name={`options[${index}]`}
          value={option}
          placeholder={`Option ${index + 1}`}
          onChange={(event) => {
            form
              .setFieldValue(`options[${index}]`, event.target.value)
              .catch((error) => {
                console.log(error);
              });
            form.setFieldTouched(`options[${index}]`, true).catch((error) => {
              console.log(error);
            });
          }}
        />
        <IconButton
          aria-label="Delete Option"
          type="button"
          variant={"outline"}
          colorScheme="red"
          icon={<DeleteIcon />}
          onClick={() => remove(index)}
          ml="2"
        />
      </Stack>
      <ErrorMessage name={`options[${index}]`} component={FormErrorMessage} />
    </FormControl>
  );
}

export function OptionsEditor() {
  const form = useFormikContext<QuestionType>();

  const options = form.values?.options ?? [];
  const touchedOptions = form.touched?.options ?? [];
  const errorsOptions = form.errors?.options ?? [];

  return (
    <FieldArray name="options">
      {({ push, remove, form }: FieldArrayRenderProps) => (
        <FormControl id="options">
          <FormLabel fontSize="sm">Options</FormLabel>
          {options.length > 0 ? (
            <VStack alignItems="start" spacing="1">
              {options.map((option, index) => (
                <div key={index}>
                  <OptionField
                    index={index}
                    option={option}
                    touched={Boolean(Array(touchedOptions)[index]) ?? false}
                    error={errorsOptions[index]}
                    form={form}
                    remove={remove}
                  />
                </div>
              ))}
            </VStack>
          ) : (
            <Alert rounded="md" status="warning">
              <AlertIcon />
              No options added
            </Alert>
          )}

          {options.length > 0 && options.length < 2 && (
            <Box my="2">
              <Alert size="sm" rounded="md" status="warning">
                <AlertIcon />
                Must have at least 2 options
              </Alert>
            </Box>
          )}
          {options.length < 4 && (
            <Button
              mt="2"
              variant="outline"
              size="sm"
              type="button"
              onClick={() => push("")}
            >
              Add Option
            </Button>
          )}
        </FormControl>
      )}
    </FieldArray>
  );
}
