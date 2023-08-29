import {
  Box,
  FormControl,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, type FieldProps } from "formik";
import { LucideText } from "lucide-react";
import {
  QuestionTypeTagIconMap,
  type QuestionType,
} from "../ManagePage/QuestionEditor";

export default function AnswerFiller({ question }: { question: QuestionType }) {
  const TagIcon = QuestionTypeTagIconMap[question.type].icon || LucideText;
  return (
    <Box borderWidth="1px" bg="whiteAlpha.200" rounded="md" p="6">
      <HStack justifyContent="space-between">
        <Tag colorScheme="teal" mb="2">
          <TagIcon size="16" className="mr-2" />
          {QuestionTypeTagIconMap[question.type].text}
        </Tag>
      </HStack>
      <Stack dir="col" gap="2">
        {question.text && <Text>{question.text}</Text>}
        {question.description && (
          <Text color={"GrayText"}>{question.description}</Text>
        )}
        {question.type === "MULTIPLE_CHOICE" ? (
          <Box>
            <Field name={question.id}>
              {({ field, meta, form }: FieldProps) => (
                <FormControl
                  id={question.id}
                  isInvalid={Boolean(meta.touched && meta.error)}
                  onChange={(event) => {
                    form
                      .setFieldValue(question.id, event.target.value)
                      .catch((err) => {
                        console.log(err);
                      });
                  }}
                >
                  <RadioGroup colorScheme="teal">
                    {/* <pre>
                      {JSON.stringify(form.values, null, 2)}
                    </pre> */}
                    <VStack align="start" spacing={2}>
                      {question?.options.map((option, index) => (
                        <Radio key={index} value={option}>
                          {option}
                        </Radio>
                      ))}
                    </VStack>
                  </RadioGroup>
                  {meta.touched && meta.error && (
                    <p className="ml-2 mt-2 text-sm text-red-500">
                      {meta.error}
                    </p>
                  )}
                </FormControl>
              )}
            </Field>
          </Box>
        ) : (
          <Box>
            <Field name={question.id}>
              {({ field, meta, form }: FieldProps) => (
                <FormControl
                  id={question.id}
                  isInvalid={Boolean(meta.touched && meta.error)}
                >
                  <Input
                    type={QuestionTypeTagIconMap[question.type].inputType}
                    autoComplete="off"
                    placeholder="Write your answer here"
                    required
                    // size="lg"
                    {...field}
                  />
                  {meta.touched && meta.error && (
                    <p className="ml-2 mt-2 text-sm text-red-500">
                      {meta.error}
                    </p>
                  )}
                </FormControl>
              )}
            </Field>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
