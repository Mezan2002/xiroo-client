import { useDispatch } from "react-redux";
import { addToast, removeToast } from "@/redux/slices/toastSlice";

/** 
 * Senior Dev Hook: useToast
 * provides a simple interface for triggering global notifications via Redux.
 */
export const useToast = () => {
  const dispatch = useDispatch();

  const toast = ({ message, type = "info" }) => {
    dispatch(addToast({ message, type }));
  };

  const success = (message) => toast({ message, type: "success" });
  const error = (message) => toast({ message, type: "error" });
  const info = (message) => toast({ message, type: "info" });
  const warning = (message) => toast({ message, type: "warning" });

  const toastMethods = {
    info,
    success,
    error,
    warning,
    add: toast,
    remove: (id) => dispatch(removeToast(id)),
  };

  return {
    toast: toastMethods,
    ...toastMethods,
  };
};
