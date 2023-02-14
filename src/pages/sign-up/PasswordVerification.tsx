import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Collapse, Stack } from "@chakra-ui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { passwordRegex } from "../../constants/validate.const";
import s from "./SignUp.module.css";

interface Props {
  password: string;
  defaultShow?: boolean;
}

const PasswordVerification: FC<Props> = ({ password, defaultShow = false }) => {
  const [passedArr, setPassedArr] = useState<Array<number>>([]);

  const renderIcon = useCallback(
    (step: number) => {
      if (passedArr.includes(step)) {
        return <CheckCircleIcon color="green.500" />;
      }

      return <WarningIcon color="yellow.500" />;
    },
    [passedArr]
  );

  useEffect(() => {
    if (password) {
      const regexLength = passwordRegex;
      const regexDigit = /^(?=.*\d)^/;
      const regexLowercase = /^(?=.*[a-z])^/;
      const regexUpperCase = /^(?=.*[A-Z])^/;
      const regexSpecial = /^(?=.*[#$@!%&*?])^/;

      const newArr: number[] = [];

      if (regexLength.test(password)) {
        newArr.push(1);
      }
      if (regexDigit.test(password)) {
        newArr.push(2);
      }
      if (regexLowercase.test(password)) {
        newArr.push(3);
      }
      if (regexUpperCase.test(password)) {
        newArr.push(4);
      }
      if (regexSpecial.test(password)) {
        newArr.push(5);
      }

      setPassedArr(newArr);
    } else {
      setPassedArr([]);
    }
  }, [password]);

  return (
    <Collapse in={!defaultShow ? !!password : true} animateOpacity>
      <Stack spacing={2} direction="column" className={s.PasswordCheck}>
        <div className={s.item}>
          {renderIcon(1)}
          <span>Độ dài từ 8-30 ký tự</span>
        </div>
        <div className={s.item}>
          {renderIcon(2)}
          <span>Chứa một chữ số</span>
        </div>
        <div className={s.item}>
          {renderIcon(3)}
          <span>Chứa một chữ thường</span>
        </div>
        <div className={s.item}>
          {renderIcon(4)}
          <span>Chứa một chữ in hoa</span>
        </div>
        <div className={s.item}>
          {renderIcon(5)}
          <span>Chứa một ký tự đặc biệt</span>
        </div>
      </Stack>
    </Collapse>
  );
};

export default PasswordVerification;
