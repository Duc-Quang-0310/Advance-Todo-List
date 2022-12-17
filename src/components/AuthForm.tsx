import { motion } from "framer-motion";
import { FC, ReactNode } from "react";
import s from "./AuthForm.module.css";

interface Props {
  children?: ReactNode;
}

const AuthForm: FC<Props> = ({ children }) => {
  return (
    <div className={s.authContainer}>
      <motion.div
        initial={{
          transform: "translateY(-600px)",
        }}
        animate={{
          transform: "translateY(0px)",
        }}
        transition={{
          duration: 0.8,
        }}
      >
        <div className={s.form}>{children}</div>
        <div className={s.logo}>
          <motion.span
            initial={"disappear"}
            animate={["drop"]}
            variants={{
              disappear: {
                transform: "translateY(-600px)",
              },
              drop: {
                transform: "translateY(0px)",
                transition: {
                  duration: 2,
                },
              },
            }}
          />
          <div />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
