import {
  SlideFade,
  Box,
  Avatar,
  AvatarBadge,
  Icon,
  VisuallyHiddenInput,
  Button,
} from "@chakra-ui/react";
import { FC, useRef, useCallback, ChangeEvent, MouseEvent } from "react";
import { MdCamera } from "react-icons/md";

import useAccountStore from "../../../../zustand/useAccountStore";
import useFirebaseUpload from "../../../../hooks/useFirebaseUpload";
import { LOGO } from "../../../../images/images.const";

const ChangeInfo: FC = () => {
  const updateCurrentProfile = useAccountStore(
    (state) => state.updateCurrentProfile
  );
  const userInfo = useAccountStore((state) => state.userInfo);
  const reUpdateUserData = useAccountStore((state) => state.reUpdateUserData);
  const { firebaseImg, setFirebaseImg, handleUpload, fileLoading } =
    useFirebaseUpload();

  const fileRef = useRef<HTMLInputElement>(null);

  const handleChangeFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const {
        target: { files },
      } = event;
      handleUpload(`Avatar`, files);
    },
    [handleUpload]
  );

  const handleUpdateProfile = useCallback(
    (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      e.preventDefault();
      updateCurrentProfile({
        photoURL: firebaseImg,
        displayName: "",
        onSuccess: () => {
          reUpdateUserData({
            userInfo: {
              ...userInfo,
              avatar: firebaseImg,
            } as any,
          });
          setTimeout(() => {
            setFirebaseImg("");
          }, 300);
        },
      });
    },
    [
      firebaseImg,
      reUpdateUserData,
      setFirebaseImg,
      updateCurrentProfile,
      userInfo,
    ]
  );

  return (
    <SlideFade in>
      <VisuallyHiddenInput
        type="file"
        ref={fileRef}
        onChange={handleChangeFile}
        accept="image/*"
        placeholder="avatar"
      />
      <Box display="flex" px="20" mt="10">
        <Avatar boxSize="150px" src={firebaseImg || userInfo?.avatar || LOGO}>
          <AvatarBadge
            boxSize="2.5em"
            bg={fileLoading ? "gray.500" : "green.500"}
            cursor="pointer"
            onClick={() => fileRef?.current?.click()}
            pointerEvents={fileLoading ? "none" : "auto"}
            transition="all 0.3s ease-in"
          >
            <Icon as={MdCamera} w={6} h={6} />
          </AvatarBadge>
        </Avatar>
        <Button
          colorScheme="teal"
          onClick={handleUpdateProfile}
          disabled={firebaseImg.length === 0}
        >
          Cập nhật
        </Button>
      </Box>
    </SlideFade>
  );
};

export default ChangeInfo;
