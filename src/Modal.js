import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useRef } from "react";
import * as Yup from "yup";

export function BookModal(props) {
  const { isOpen, onClose, data, onClick } = props;

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required."),
      phone: Yup.string().required("Phone Number is required."),
    }),
    onSubmit: async (values) => {
      const { name, phone } = values;
      console.log({ name, phone });
      try {
        onClick(data.time, name, phone);
      } catch (e) {
        console.log(e);
      }
    },
  });

  const ErrorText = (props) => <Text color="#FF5656">{props.children}</Text>;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent rounded="2xl" top={0}>
        <ModalHeader p={0}>
          <Flex width="full" pt={3.5} justify="flex-end" align="center">
            <ModalCloseButton position="relative" top={0} />
          </Flex>
        </ModalHeader>
        <ModalBody p={4} zIndex={1}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={6}>
              <FormControl>
                <Input
                  name="name"
                  placeholder="Name"
                  isInvalid={!!formik.errors.name}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                />
                {formik.errors.name && (
                  <ErrorText>{formik.errors.name}</ErrorText>
                )}
              </FormControl>
              <FormControl>
                <Input
                  name="phone"
                  placeholder="Phone Number"
                  isInvalid={!!formik.errors.phone}
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                />
                {formik.errors.phone && (
                  <ErrorText>{formik.errors.phone}</ErrorText>
                )}
              </FormControl>
              <HStack spacing={4} justifyContent="flex-end">
                <Button colorScheme="red" onClick={onClose}>
                  Cancel
                </Button>

                <Button type="submit" colorScheme="green">
                  Book
                </Button>
              </HStack>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function CancelBook(props) {
  const { isOpen, onClose, onClick } = props;
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Cancel Schedule
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button colorScheme="red" ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={onClick} ml={3}>
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
